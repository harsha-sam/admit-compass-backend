import prisma from '../config/database';
import { Prisma, AttributeType } from '@prisma/client';
import ruleService from './ruleService';

const getAllAttributes = async () => {
  const attributes = await prisma.attribute.findMany({
    include: {
      category: true,
    },
  });

  // Fetch rules for all attributes
  const attributeRules = await prisma.rule.findMany({
    include: { conditions: true },
  });

  // Map attributes to include their rules
  return attributes.map((attr) => {
    const rules = attributeRules.filter((rule) => rule.targetAttributeId === attr.attributeId);

    return {
      ...attr,
      options: attr.options ? JSON.parse(attr.options as string) : null,
      validationRule: attr.validationRule ? JSON.parse(attr.validationRule as string) : null,
      rules, // Add associated rules
    };
  });
};


const getAttributeById = async (id: number) => {
  const attribute = await prisma.attribute.findUnique({
    where: { attributeId: id },
    include: { category: true },
  });

  if (!attribute) return null;

  // Fetch rules for the attribute
  const rules = await prisma.rule.findMany({
    where: { targetAttributeId: id },
    include: { conditions: true },
  });

  return {
    ...attribute,
    options: attribute.options ? JSON.parse(attribute.options as string) : null,
    validationRule: attribute.validationRule ?  JSON.parse(attribute.validationRule as string) : null,
    rules
  };
};

const createAttribute = async (data: {
  name: string;
  displayName: string;
  type: AttributeType;
  description?: string;
  validationRule?: object;
  categoryId?: string; // Add category_id support
  options?: { value: string; label: string,  }[];
  isGlobal?: boolean;
  rules?: {
    targetOptionValue?: string, logicOperator: string, action: JSON, conditions: {
      evaluatedAttributeId: string,
      operator: string,
      value1: string,
      value2?: string
  }[]}[]; // Add rules support
}) => {
  const { rules, categoryId, description, validationRule, type, ...attributeData } = data;

  let options = data.options?.filter((option) => option.label)
  const createdAttribute = await prisma.attribute.create({
    data: {
      ...attributeData,
      type,
      categoryId: parseInt(categoryId!) ?? null,
      description: description ?? '', 
      validationRule: validationRule ? JSON.stringify(validationRule) : Prisma.JsonNull,
      isGlobal: data.isGlobal ?? false,
      options: options ? JSON.stringify(options) : Prisma.JsonNull,
    },
    include: { category: true },
  });

  if (rules?.length) {
    for (const rule of rules) {
      if (rule.conditions && rule.conditions.length > 0) {
        await ruleService.createAttributeRule(createdAttribute.attributeId, rule);
      }
    }
  }

  return getAttributeById(createdAttribute.attributeId);
};

const updateAttribute = async (
  id: number,
  data: Partial<{
    name: string;
    displayName: string;
    type: AttributeType;
    description?: string;
    validationRule?: object;
    categoryId?: string; // Add category_id support
    options?: { value: string; label: string }[];
    isGlobal?: boolean;
    rules?: any[]; // Add rules support
  }>
) => {
  const { rules, categoryId, validationRule, ...attributeData } = data;

  console.log(data, "data")
  let options = data.options?.filter((option) => option.label)
  const updatedAttribute = await prisma.attribute.update({
    where: { attributeId: id },
    data: {
      ...attributeData,
      categoryId: parseInt(categoryId!) ?? null,
      ...(options !== undefined && { options: options ? JSON.stringify(options) : Prisma.JsonNull }),
      validationRule: validationRule ? JSON.stringify(validationRule) : Prisma.JsonNull,
    },
    include: { category: true },
  });

  // Handle rules update
  if (rules) {
    // Delete all existing rules and recreate
    await prisma.rule.deleteMany({ where: { targetAttributeId: id } });
    for (const rule of rules) {
      if (rule && rule.conditions && rule.conditions.length > 0) {
        await ruleService.createAttributeRule(id, rule);
      }
    }
  }
  return getAttributeById(id);
};


const deleteAttribute = async (id: number) => {
  await prisma.rule.deleteMany({ where: { targetAttributeId: id } });
  await prisma.attribute.delete({
    where: { attributeId: id },
  });
};

export default {
  getAllAttributes,
  getAttributeById,
  createAttribute,
  updateAttribute,
  deleteAttribute,
};

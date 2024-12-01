import prisma from '../config/database';
import { Prisma, AttributeType } from '@prisma/client';
import ruleService from './ruleService';

const getAllAttributes = async () => {
  const attributes = await prisma.attribute.findMany({
    include: { category: true },
  });

  return attributes.map((attr) => ({
    ...attr,
    options: attr.options ? JSON.parse(attr.options as string) : null,
  }));
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
    rules
  };
};

const createAttribute = async (data: {
  name: string;
  displayName: string;
  type: AttributeType;
  description?: string;
  validationRule?: object;
  categoryId?: number; // Add category_id support
  options?: { value: string; label: string }[];
  isGlobal?: boolean;
  rules?: any[]; // Add rules support
}) => {
  const { options, rules, categoryId, description, validationRule, type, ...attributeData } = data;

  const createdAttribute = await prisma.attribute.create({
    data: {
      ...attributeData,
      type,
      categoryId: categoryId ?? null,
      description: description ?? '', 
      validationRule: validationRule ? JSON.stringify(validationRule) : Prisma.JsonNull,
      isGlobal: data.isGlobal ?? false,
      options: options ? JSON.stringify(options) : Prisma.JsonNull,
    },
    include: { category: true },
  });

  if (rules && rules.length > 0) {
    for (const rule of rules) {
      await ruleService.createAttributeRule(createdAttribute.attributeId, rule);
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
    categoryId?: number; // Add category_id support
    options?: { value: string; label: string }[];
    isGlobal?: boolean;
    rules?: any[]; // Add rules support
  }>
) => {
  const { options, rules, categoryId, ...attributeData } = data;

  const updatedAttribute = await prisma.attribute.update({
    where: { attributeId: id },
    data: {
      ...attributeData,
      categoryId,
      ...(options !== undefined && { options: options ? JSON.stringify(options) : Prisma.JsonNull }),
    },
    include: { category: true },
  });

  // Handle rules update
  if (rules) {
    // Delete all existing rules and recreate
    await prisma.rule.deleteMany({ where: { targetAttributeId: id } });
    for (const rule of rules) {
      await ruleService.createAttributeRule(id, rule);
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

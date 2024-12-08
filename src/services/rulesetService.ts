import prisma from '../config/database';
import ruleService from './ruleService';

const calculateMaxWeightForRules = (rule: any): number => {
  if (!rule) return 0;

  let maxWeight = 0;

  let currentWeight = 0;

  if (rule.action) {
    // Calculate weight for the current rule
    if (rule.action?.operation === 'add') {
      currentWeight += rule.action.points;
    } else if (rule.action?.operation === 'subtract') {
      currentWeight -= rule.action.points;
    } else if (rule.action?.operation === 'multiply') {
      currentWeight *= rule.action.points;
    } else if (rule.action?.operation === 'divide' && rule.action.points !== 0) {
      currentWeight /= rule.action.points;
    }
  }

  // Recursively calculate the weight for child rules
  if (rule.childRules && rule.childRules.length > 0) {
    const childWeights = rule.childRules.map(calculateMaxWeightForRules);

    if (rule.logicOperator === 'AND') {
      // For AND, sum up all child rule weights
      currentWeight += childWeights.reduce((sum: any, weight: any) => sum + weight, 0);
    } else if (rule.logicOperator === 'OR') {
      // For OR, take the maximum child rule weight
      currentWeight += Math.max(...childWeights);
    }
  }

  // Update the overall max weight
  maxWeight = Math.max(maxWeight, currentWeight);

  return maxWeight;
};


const createRuleset = async (data: any) => {
  const { name, baseWeight = 0, maxWeight = 100, rules, description, attributes, formOrder } = data;

  // Calculate maxWeight based on rules if needed
  const calculatedMaxWeight = calculateMaxWeightForRules(rules[0]) || maxWeight;

  // Step 1: Create the Ruleset
  const createdRuleset = await prisma.ruleset.create({
    data: {
      name,
      description,
      baseWeight: baseWeight || 0,
      maxWeight: calculatedMaxWeight,
      attribute_ids: attributes.map((attr: any) => attr.attributeId), // Map attributes to attribute IDs
    },
  });

  // Step 2: Handle formOrder and create RulesetAttributeConfig
  if (formOrder && Array.isArray(formOrder)) {
    formOrder.forEach((position: number, index: number) => {
      prisma.rulesetAttributeConfig.create({
        data: {
          rulesetId: createdRuleset.rulesetId,
          attributeId: attributes[index].attributeId,
          displayOrder: position,
        },
      });
    });
  }

  // Step 3: Create Rules (if any are provided)
  if (rules && rules.length > 0) {
    for (const rule of rules) {
      await ruleService.createRulesetRule(createdRuleset.rulesetId, rule);
    }
  }

  // Step 4: Return the created ruleset with related data
  return prisma.ruleset.findUnique({
    where: { rulesetId: createdRuleset.rulesetId },
    include: { rules: true, rulesetAttributeConfig: true },
  });
};


const getAllRulesets = async () => {
  return prisma.ruleset.findMany({
    include: { rules: true }, // Include associated rules if needed
  });
};

const getRulesetById = async (rulesetId: number) => {
  // Fetch the ruleset along with rules and attribute configuration
  const ruleset = await prisma.ruleset.findUnique({
    where: { rulesetId },
    include: { rules: { include: { conditions: true }}, rulesetAttributeConfig: true },
  });

  if (!ruleset) {
    throw new Error(`Ruleset with ID ${rulesetId} not found`);
  }

  // Fetch attributes using attribute_ids
  const attributes = await prisma.attribute.findMany({
    where: {
      attributeId: { in: ruleset.attribute_ids },
    },
  });

  // Fetch rules targeting attributes
  const attributeRules = await prisma.rule.findMany({
    where: {
      targetAttributeId: {
        in: ruleset.attribute_ids,
      }, // Fetch only rules with a targetAttributeId
    },
    include: { conditions: true },
  });

  // Group rules by targetAttributeId
  const rulesByAttribute: Record<number, any[]> = {};
  attributeRules.forEach((rule) => {
    if (!rulesByAttribute[rule.targetAttributeId!]) {
      rulesByAttribute[rule.targetAttributeId!] = [];
    }
    rulesByAttribute[rule.targetAttributeId!].push(rule);
  });

  // Derive formOrder: attributeId positions based on displayOrder, or use default ordering
  const formOrder = Array(attributes.length).fill(null);

  if (ruleset.rulesetAttributeConfig && ruleset.rulesetAttributeConfig.length > 0) {
    // Use displayOrder from rulesetAttributeConfig
    ruleset.rulesetAttributeConfig.forEach((config) => {
      const attributeIndex = attributes.findIndex(
        (attr) => attr.attributeId === config.attributeId
      );
      if (attributeIndex !== -1) {
        formOrder[attributeIndex] = config.displayOrder;
      }
    });
  } else {
    // Use default order if config is not present
    attributes.forEach((attr, index) => {
      formOrder[index] = index; // Assign default positions starting from 1
    });
  }

  // Sort attributes by formOrder
  const sortedAttributes = attributes
    .map((attr) => ({
      ...attr,
      options: attr.options ? JSON.parse(attr.options as string) : null, // Parse options as JSON
      validationRule: attr.validationRule ? JSON.parse(attr.validationRule as string) : null,
      rules: rulesByAttribute[attr.attributeId] || [], // Attach rules for the attribute
    }))
    .sort((a, b) => {
      const orderA = formOrder[attributes.findIndex((attr) => attr.attributeId === a.attributeId)];
      const orderB = formOrder[attributes.findIndex((attr) => attr.attributeId === b.attributeId)];
      return (orderA || Infinity) - (orderB || Infinity);
    });

  // Return ruleset with attributes, their rules, and formOrder
  return {
    ...ruleset,
    attributes: sortedAttributes,
    formOrder,
  };
};





const updateRuleset = async (rulesetId: number, data: any) => {
  const { name, baseWeight, maxWeight, rules, description, attributes, formOrder } = data;

  // Update the ruleset's main properties
  const updatedRuleset = await prisma.ruleset.update({
    where: { rulesetId },
    data: {
      name,
      description,
      baseWeight: baseWeight || 0,
      maxWeight: calculateMaxWeightForRules(rules[0]),
      attribute_ids: attributes.map((attr: any) => attr.attributeId), // Update attributes
    },
  });

  // Handle formOrder updates
  if (formOrder && Array.isArray(formOrder)) {
    // Delete existing attribute configurations
    await prisma.rulesetAttributeConfig.deleteMany({ where: { rulesetId } });

    // Recreate attribute configurations with new formOrder
    for (const [index, position] of formOrder.entries()) {
      await prisma.rulesetAttributeConfig.create({
        data: {
          rulesetId,
          attributeId: attributes[index].attributeId,
          displayOrder: position,
        },
      });
    }
  }

  // Handle rules updates
  if (rules && rules.length > 0) {
    // Delete existing rules for this ruleset
    await prisma.rule.deleteMany({ where: { rulesetId } });

    // Recreate rules
    for (const rule of rules) {
      await ruleService.createRulesetRule(rulesetId, rule);
    }
  }

  // Return the updated ruleset with related data
  return prisma.ruleset.findUnique({
    where: { rulesetId },
    include: { rules: true, rulesetAttributeConfig: true },
  });
};


const deleteRuleset = async (rulesetId: number) => {
  return prisma.ruleset.delete({
    where: { rulesetId },
  });
};

export default {
  createRuleset,
  getAllRulesets,
  getRulesetById,
  updateRuleset,
  deleteRuleset,
};

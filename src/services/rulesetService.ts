import prisma from '../config/database';
import ruleService from './ruleService';

const calculateMaxWeightForRules = (rules: any[]): number => {
  let maxWeight = 0;

  for (const rule of rules) {
    // Base weight for this rule
    let currentWeight = 0;

    if (rule.action?.type === 'ASSIGN_WEIGHT') {
      currentWeight = rule.action.value;
    } else if (rule.action?.type === 'ADD_WEIGHT') {
      currentWeight += rule.action.value;
    } else if (rule.action?.type === 'SUBTRACT_WEIGHT') {
      currentWeight -= rule.action.value;
    } else if (rule.action?.type === 'MULTIPLY_WEIGHT') {
      currentWeight *= rule.action.value;
    }
    else if (rule.action?.type === 'DIVIDE_WEIGHT') {
      currentWeight /= rule.action.value;
    }

    // If the rule has nested child rules, evaluate them recursively
    if (rule.childRules && rule.childRules.length > 0) {
      const nestedMaxWeight = calculateMaxWeightForRules(rule.childRules);
      if (rule.logicOperator === 'AND') {
        currentWeight += nestedMaxWeight;
      } else if (rule.logicOperator === 'OR') {
        currentWeight = Math.max(currentWeight, nestedMaxWeight);
      }
    }

    maxWeight = Math.max(maxWeight, currentWeight);
  }

  return maxWeight;
};

const createRuleset = async (data: any) => {
  const { name, baseWeight = 0, maxWeight = 100, rules } = data;

  const createdRuleset = await prisma.ruleset.create({
    data: {
      name,
      baseWeight: baseWeight || 0,
      maxWeight: calculateMaxWeightForRules(rules)
    },
  });

  if (rules && rules.length > 0) {
    for (const rule of rules) {
      await ruleService.createRulesetRule(createdRuleset.rulesetId, rule);
    }
  }

  return prisma.ruleset.findUnique({
    where: { rulesetId: createdRuleset.rulesetId },
    include: { rules: true },
  });
};

const getAllRulesets = async () => {
  return prisma.ruleset.findMany({
    include: { rules: true }, // Include associated rules if needed
  });
};

const getRulesetById = async (rulesetId: number) => {
  return prisma.ruleset.findUnique({
    where: { rulesetId },
    include: { rules: true }, // Include associated rules if needed
  });
};

const updateRuleset = async (rulesetId: number, data: any) => {
  const { name, baseWeight, maxWeight, rules } = data;

  const updatedRuleset = await prisma.ruleset.update({
    where: { rulesetId },
    data: {
      name,
      baseWeight,
      maxWeight: calculateMaxWeightForRules(rules),
    },
  });

  if (rules) {
    // Delete all existing rules for this ruleset and recreate them
    await prisma.rule.deleteMany({ where: { rulesetId } });
    for (const rule of rules) {
      await ruleService.createRulesetRule(rulesetId, rule);
    }
  }

  return prisma.ruleset.findUnique({
    where: { rulesetId },
    include: { rules: true },
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

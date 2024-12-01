import prisma from '../config/database';
import { Rule } from '@prisma/client';


// Recursive function to create nested rules
const createRulesetRule = async (rulesetId: number, data: any, parentRuleId: number | null = null) => {
  const { action, logicOperator, conditions, childRules } = data;

  // Create the current rule
  const createdRule = await prisma.rule.create({
    data: {
      rulesetId,
      parentRuleId,
      logicOperator: parentRuleId ? null : logicOperator, // Only root rules have logicOperator
      action: action || {},
      conditions: {
        create: conditions?.map((condition: any) => ({
          evaluatedAttributeId: condition.evaluatedAttributeId,
          operator: condition.operator,
          value1: condition.value1,
          value2: condition.value2 || null,
        })) || [],
      },
    },
    include: { conditions: true, childRules: true },
  });

  // Recursively create child rules
  if (childRules && childRules.length > 0) {
    for (const childRule of childRules) {
      await createRulesetRule(rulesetId, childRule, createdRule.ruleId);
    }
  }

  return createdRule;
};

type RuleWithChildren = Rule & { childRules: RuleWithChildren[] };
// Recursive function to fetch rules with nested logic
const getRulesetRules = async (rulesetId: number): Promise<RuleWithChildren[]> => {
  const fetchRulesRecursively = async (parentRuleId: number | null): Promise<RuleWithChildren[]> => {
    const rules = await prisma.rule.findMany({
      where: { rulesetId, parentRuleId },
      include: { conditions: true },
    });

    return Promise.all(
      rules.map(async (rule) => ({
        ...rule,
        childRules: await fetchRulesRecursively(rule.ruleId),
      }))
    );
  };

  return fetchRulesRecursively(null);
};

// Create attribute-level rule
const createAttributeRule = async (attributeId: number, data: any) => {
  const { action, logicOperator, conditions, targetOptionValue } = data;

  return prisma.rule.create({
    data: {
      targetAttributeId: attributeId,
      targetOptionValue,
      logicOperator: logicOperator || "AND",
      action,
      conditions: {
        create: conditions.map((condition: any) => ({
          evaluatedAttributeId: condition.evaluatedAttributeId,
          operator: condition.operator,
          value1: condition.value1,
          value2: condition.value2 || null,
        })),
      },
    },
    include: { conditions: true },
  });
};

// Get attribute-level rules
const getAttributeRules = async (attributeId: number) => {
  return prisma.rule.findMany({
    where: { targetAttributeId: attributeId },
    include: { conditions: true },
  });
};

// Update a rule (both attribute-level and ruleset rules)
const updateRule = async (ruleId: number, data: any) => {
  const { action, logicOperator, conditions, childRules } = data;

  // Update the current rule
  const updatedRule = await prisma.rule.update({
    where: { ruleId },
    data: {
      action,
      logicOperator,
      conditions: conditions
        ? {
            deleteMany: {}, // Clear old conditions
            create: conditions.map((condition: any) => ({
              evaluatedAttributeId: condition.evaluatedAttributeId,
              operator: condition.operator,
              value1: condition.value1,
              value2: condition.value2 || null,
            })),
          }
        : undefined,
    },
    include: { conditions: true, childRules: true },
  });

  // Handle child rules (for ruleset rules)
  if (childRules) {
    // Delete existing child rules
    await prisma.rule.deleteMany({ where: { parentRuleId: ruleId } });

    // Recreate child rules
    for (const childRule of childRules) {
      await createRulesetRule(updatedRule.rulesetId!, childRule, updatedRule.ruleId);
    }
  }

  return updatedRule;
};

// Delete a rule
const deleteRule = async (ruleId: number) => {
  return prisma.rule.delete({
    where: { ruleId },
  });
};

export default {
  createAttributeRule,
  getAttributeRules,
  createRulesetRule,
  getRulesetRules,
  updateRule,
  deleteRule,
};

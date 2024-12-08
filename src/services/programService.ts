import prisma from '../config/database';
import { ProgramCategory } from '@prisma/client';

const getAllPrograms = async () => {
  return prisma.program.findMany();
};

const getProgramById = async (id: number) => {
  return prisma.program.findUnique({
    where: { programId: id },
  });
};

const createProgram = async (data: { name: string; description?: string; programCategory: ProgramCategory; programType: ProgramCategory }) => {
  return prisma.program.create({ data });
};

const updateProgram = async (id: number, data: Partial<{ name: string; description: string; programCategory: ProgramCategory; programType: string }>) => {
  return prisma.program.update({
    where: { programId: id },
    data,
  });
};

const deleteProgram = async (id: number) => {
  await prisma.program.delete({
    where: { programId: id },
  });
};

const getRulesWithChildren = async (rulesetId: number, parentRuleId: number | null = null): Promise<any> => {
  const rules = await prisma.rule.findMany({
    where: {
      rulesetId,
      parentRuleId,
    },
    include: { conditions: true },
  });

  // Fetch child rules for each rule recursively
  const rulesWithChildren = await Promise.all(
    rules.map(async (rule: any) => ({
      ...rule,
      childRules: await getRulesWithChildren(rulesetId, rule.ruleId),
    }))
  );

  return rulesWithChildren;
};

const evaluateRule = (rule: any, data: any): boolean => {
  if (!rule.conditions || rule.conditions.length === 0) return true; // If no conditions, the rule is valid

  const results = rule.conditions.map((condition: any) => {
    const attributeValue = data[condition.evaluatedAttributeId];
    switch (condition.operator) {
      case 'equals':
        return attributeValue === condition.value1;
      case 'not_equals':
        return attributeValue !== condition.value1;
      case 'greater_than':
        return parseFloat(attributeValue) > parseFloat(condition.value1);
      case 'less_than':
        return parseFloat(attributeValue) < parseFloat(condition.value1);
      case 'greater_than_or_equal':
        return parseFloat(attributeValue) >= parseFloat(condition.value1);
      case 'less_than_or_equal':
        return parseFloat(attributeValue) <= parseFloat(condition.value1);
      case 'contains':
        if (typeof attributeValue === 'string') {
          // Case-insensitive string contains
          return attributeValue.toLowerCase().includes(condition.value1.toLowerCase());
        } else if (typeof attributeValue === 'object' && attributeValue !== null) {
          // For objects, check if the key exists and matches the condition value
          const key = Object.keys(attributeValue).find(
            (k) => k.toLowerCase() === condition.value1.toLowerCase()
          );
          return key && attributeValue[key] === true;
        }
        return false;
      case 'not_contains':
        if (typeof attributeValue === 'string') {
          return !attributeValue.toLowerCase().includes(condition.value1.toLowerCase());
        } else if (typeof attributeValue === 'object' && attributeValue !== null) {
          const key = Object.keys(attributeValue).find(
            (k) => k.toLowerCase() === condition.value1.toLowerCase()
          );
          return !(key && attributeValue[key] === true);
        }
        return true;
      default:
        return false;
    }
  });

  // Use AND logic by default if no logicOperator is specified
  const logicOperator = rule.logicOperator || 'AND';
  return logicOperator === 'AND' ? results.every(Boolean) : results.some(Boolean);
};


const processRules = (rules: any[], data: any): number => {
  let totalWeight = 0;

  for (const rule of rules) {
    // Check if the current rule is satisfied
    const isRuleSatisfied = evaluateRule(rule, data);

    // Initialize weight for the current rule
    let currentWeight = 0;

    if (isRuleSatisfied && rule.action) {
      // Apply the action if the rule is satisfied
      switch (rule.action.operation) {
        case 'add':
          currentWeight += rule.action.points;
          break;
        case 'subtract':
          currentWeight -= rule.action.points;
          break;
        case 'multiply':
          currentWeight *= rule.action.points;
          break;
        case 'divide':
          currentWeight /= rule.action.points;
          break;
        default:
          break;
      }
    }

    // Process child rules recursively
    let childWeight = 0;
    if (rule.childRules?.length) {
      const childResults = rule.childRules.map((child: any) => ({
        weight: processRules([child], data),
        isSatisfied: evaluateRule(child, data),
      }))

      if (rule.logicOperator === 'AND') {
        // All child rules must be satisfied
        if (childResults.every((child: any) => child.isSatisfied)) {
          childWeight = childResults.reduce((sum: any, child: any) => sum + child.weight, 0);
        }
      } else if (rule.logicOperator === 'OR') {
        // Take the maximum weight from satisfied child rules
        childWeight = Math.max(0, ...childResults.map((child: any) => child.weight));
      }
    }

    // Combine the current rule's weight with its child rules' weight
    totalWeight += currentWeight + childWeight;
  }

  return totalWeight;
};



const evaluateProgramApplication = async (programId: number, submissionData: any) => {
  const program = await prisma.program.findUnique({
    where: { programId },
  });

  if (!program || !program.rulesetId) {
    throw new Error('Program or associated ruleset not found');
  }

  const ruleset = await prisma.ruleset.findUnique({
    where: { rulesetId: program.rulesetId },
  });

  if (!ruleset) {
    throw new Error('Program or associated ruleset not found');
  }

  // Fetch rules and their nested structure
  const rules = await getRulesWithChildren(ruleset.rulesetId);


  // Initialize score with baseWeight
  let score = ruleset.baseWeight || 0;

  // Process all rules
  score += processRules(rules, submissionData);


  return {
    programId,
    rulesetId: ruleset.rulesetId,
    maxScore: ruleset.maxWeight,
    acceptance: Math.round((score/ruleset.maxWeight) * 100),
  };
};


export default {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  evaluateProgramApplication
};

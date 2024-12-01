import prisma from '../config/database';

const createRule = async (attributeId: number, data: any) => {
  const { action, conditions } = data;

  return prisma.rule.create({
    data: {
      targetAttributeId: attributeId,
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

const getRulesByAttribute = async (attributeId: number) => {
  return prisma.rule.findMany({
    where: { targetAttributeId: attributeId },
    include: { conditions: true },
  });
};

const updateRule = async (ruleId: number, data: any) => {
  const { action, conditions } = data;

  return prisma.rule.update({
    where: { ruleId },
    data: {
      action,
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
    include: { conditions: true },
  });
};

const deleteRule = async (ruleId: number) => {
  return prisma.rule.delete({
    where: { ruleId },
  });
};

export default {
  createRule,
  getRulesByAttribute,
  updateRule,
  deleteRule,
};

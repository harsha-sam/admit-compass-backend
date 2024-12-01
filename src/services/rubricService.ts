import prisma from '../config/database';

const getAllRubrics = async () => {
  return prisma.rubric.findMany({
    include: { programs: true, rubricRulesets: true },
  });
};

const getRubricById = async (id: number) => {
  return prisma.rubric.findUnique({
    where: { rubricId: id },
    include: { programs: true, rubricRulesets: { include: { ruleset: true } } },
  });
};

const createRubric = async (data: { name: string; maxWeight?: number; programIds?: number[],  rulesetIds?: number[]; }) => {
  const { name, maxWeight, programIds, rulesetIds } = data;

  return prisma.rubric.create({
    data: {
      name,
      maxWeight: maxWeight || 0,
      programs: programIds
        ? {
            connect: programIds.map((id) => ({ programId: id })), // Connect existing programs
          }
        : undefined,
      rubricRulesets: rulesetIds
        ? {
            create: rulesetIds.map((rulesetId) => ({ rulesetId })), // Create rubricRulesets
          }
        : undefined,
    },
    include: {
      programs: true,
      rubricRulesets: { include: { ruleset: true } }
    },
  });
};

const updateRubric = async (
  id: number,
  data: Partial<{ name: string; maxWeight: number; programIds: number[], rulesetIds: number[] }>
) => {
  const { name, maxWeight, programIds, rulesetIds } = data;

  return prisma.rubric.update({
    where: { rubricId: id },
    data: {
      name,
      maxWeight,
      programs: programIds
        ? {
            set: programIds.map((id) => ({ programId: id })), // Replace current associations
          }
        : undefined,
      rubricRulesets: rulesetIds
        ? {
            deleteMany: {}, // Clear existing associations
            create: rulesetIds.map((rulesetId) => ({ rulesetId })), // Recreate rubricRulesets
          }
        : undefined,
    },
    include: { programs: true, rubricRulesets: { include: { ruleset: true } } },
  });
};

const deleteRubric = async (id: number) => {
  // Delete associated rubricRulesets first to maintain referential integrity
  await prisma.rubricRuleset.deleteMany({
    where: { rubricId: id },
  });
  
  await prisma.rubric.delete({
    where: { rubricId: id },
  });
};

export default {
  getAllRubrics,
  getRubricById,
  createRubric,
  updateRubric,
  deleteRubric,
};

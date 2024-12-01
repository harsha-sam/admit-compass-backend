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

export default {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
};

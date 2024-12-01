import { z } from 'zod';
import { ProgramCategory } from '@prisma/client';

export const createProgramSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  programCategory: z.nativeEnum(ProgramCategory, { 
    errorMap: () => ({ message: 'Invalid program category' })
  }),
  programType: z.string().min(1, { message: 'Program type is required' }),
});

export const updateProgramSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  programCategory: z.nativeEnum(ProgramCategory).optional(),
  programType: z.string().optional(),
});

import { z } from 'zod';

export const createRubricSchema = z.object({
  name: z.string().min(1, { message: 'Rubric name is required' }),
   maxWeight: z
    .number()
    .int()
    .nonnegative({ message: 'Max weight must be a non-negative integer' })
    .default(0), // Defaults to 0 if not provided
   programIds: z.array(z.number().int().positive({ message: 'Program IDs must be positive integers' })).optional(),
});

export const updateRubricSchema = z.object({
  name: z.string().min(1, { message: 'Rubric name must not be empty' }).optional(),
  maxWeight: z
    .number()
    .int()
    .nonnegative({ message: 'Max weight must be a non-negative integer' })
    .optional(),
   programIds: z.array(z.number().int().positive({ message: 'Program IDs must be positive integers' })).optional(),
});

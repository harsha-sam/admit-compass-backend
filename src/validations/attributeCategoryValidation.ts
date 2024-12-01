import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, { message: 'Category name is required' }),
  description: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, { message: 'Category name must not be empty' }).optional(),
  description: z.string().optional(),
});

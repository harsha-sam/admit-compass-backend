import { z } from 'zod';

export const createAttributeSchema = z.object({
  name: z.string().min(1, { message: 'Attribute name is required' }),
  displayName: z.string().min(1, { message: 'Display name is required' }),
  type: z.enum([
    'text',
    'number',
    'date',
    'datetime',
    'boolean',
    'dropdown',
    'multiselect',
    'file',
    'calculated',
  ]),
  description: z.string().optional(),
  validationRule: z.object({}).passthrough().optional(),
  categoryId: z.number().positive().optional(),
  options: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .optional(), // Only applicable for dropdown/multiselect
});

export const updateAttributeSchema = createAttributeSchema.partial();

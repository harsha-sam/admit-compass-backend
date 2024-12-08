import { z } from 'zod';

// Define a schema that accepts a string representing a number and parses it
const numericStringSchema = z
  .string()
  .refine((value) => !isNaN(Number(value)), {
    message: "Must be a string representing a valid number",
  })
  .transform((value) => Number(value)); // Parse it into a number

export const createAttributeSchema = z.object({
  name: z.string().min(1, { message: 'Attribute name is required' }),
  displayName: z.string().min(1, { message: 'Display name is required' }),
  type: z.enum([
    'singleLineText',
    'multiLineText',
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
  validationRule: z.object({}).passthrough().optional() || z.string().optional(),
  categoryId: z.union([z.number(), numericStringSchema]).optional(),
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

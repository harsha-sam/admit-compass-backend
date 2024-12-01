import { z } from 'zod';

export const createRulesetSchema = z.object({
  name: z.string().min(1, { message: 'Ruleset name is required' }),
  maxWeight: z.number().min(0).optional(), // Max weight should be >= 0
  attributeIds: z.array(z.number()).optional(), // Optional array of attributes to associate
});

export const updateRulesetSchema = z.object({
  name: z.string().min(1).optional(),
  maxWeight: z.number().min(0).optional(),
  attributeIds: z.array(z.number()).optional()
});

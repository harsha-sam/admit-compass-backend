import { z } from 'zod';

const conditionSchema = z.object({
  evaluatedAttributeId: z.number(),
  operator: z.enum(["=", "!=", ">", "<", ">=", "<=", "IN", "NOT_IN", "CONTAINS", "NOT_CONTAINS"]),
  value1: z.any(),
  value2: z.any().optional(),
});

export const createRuleSchema = z.object({
  targetAttributeId: z.number().optional(), // For attribute/option-level rules
  targetOptionValue: z.string().optional(), // For option-level rules
  parentRuleId: z.number().optional(), // For nested rules
  logicOperator: z.enum(["AND", "OR"]).optional(), // For parent rules
  action: z.object({
    type: z.enum(["SHOW", "HIDE", "SHOW_AND_MAKE_MANDATORY", "ASSIGN_WEIGHT", "ADD_WEIGHT", "SUBTRACT_WEIGHT", "MULTIPLY_WEIGHT", "DIVIDE_WEIGHT"]),
    value: z.any().optional(), // Action value (e.g., weight amount)
  }).optional(),
  conditions: z.array(conditionSchema).min(1, { message: "At least one condition is required" }),
});

export const updateRuleSchema = createRuleSchema.partial(); // Allow partial updates

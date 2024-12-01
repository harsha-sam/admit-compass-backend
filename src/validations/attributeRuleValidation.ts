import { z } from 'zod';

export const conditionSchema = z.object({
  evaluatedAttributeId: z.number(), // Attribute being evaluated
  operator: z.string().refine(
    (op) => ["=", "!=", ">", "<", ">=", "<=", "IN", "NOT_IN", "CONTAINS", "NOT_CONTAINS"].includes(op),
    { message: "Invalid operator" }
  ),
  value1: z.any(), // Primary condition value
  value2: z.any().optional(), // Optional secondary value for range-based conditions
});

export const createAttributeRuleSchema = z.object({
  action: z.enum(["HIDE", "SHOW", "SHOW_AND_MAKE_MANDATORY"]), // Actions for the rule
  conditions: z
    .array(conditionSchema)
    .min(1, { message: "At least one condition is required" }), // Validate conditions
});

export const updateAttributeRuleSchema = z.object({
  action: z.enum(["HIDE", "SHOW", "SHOW_AND_MANDATORY"]).optional(),
  conditions: z.array(conditionSchema).optional(),
});

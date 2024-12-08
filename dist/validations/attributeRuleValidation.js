"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAttributeRuleSchema = exports.createAttributeRuleSchema = exports.conditionSchema = void 0;
const zod_1 = require("zod");
exports.conditionSchema = zod_1.z.object({
    evaluatedAttributeId: zod_1.z.number(), // Attribute being evaluated
    operator: zod_1.z.string().refine((op) => ["=", "!=", ">", "<", ">=", "<=", "IN", "NOT_IN", "CONTAINS", "NOT_CONTAINS"].includes(op), { message: "Invalid operator" }),
    value1: zod_1.z.any(), // Primary condition value
    value2: zod_1.z.any().optional(), // Optional secondary value for range-based conditions
});
exports.createAttributeRuleSchema = zod_1.z.object({
    action: zod_1.z.enum(["HIDE", "SHOW", "SHOW_AND_MAKE_MANDATORY"]), // Actions for the rule
    conditions: zod_1.z
        .array(exports.conditionSchema)
        .min(1, { message: "At least one condition is required" }), // Validate conditions
});
exports.updateAttributeRuleSchema = zod_1.z.object({
    action: zod_1.z.enum(["HIDE", "SHOW", "SHOW_AND_MANDATORY"]).optional(),
    conditions: zod_1.z.array(exports.conditionSchema).optional(),
});

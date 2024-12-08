"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRuleSchema = exports.createRuleSchema = void 0;
const zod_1 = require("zod");
const conditionSchema = zod_1.z.object({
    evaluatedAttributeId: zod_1.z.number(),
    operator: zod_1.z.enum(["=", "!=", ">", "<", ">=", "<=", "IN", "NOT_IN", "CONTAINS", "NOT_CONTAINS"]),
    value1: zod_1.z.any(),
    value2: zod_1.z.any().optional(),
});
exports.createRuleSchema = zod_1.z.object({
    targetAttributeId: zod_1.z.number().optional(), // For attribute/option-level rules
    targetOptionValue: zod_1.z.string().optional(), // For option-level rules
    parentRuleId: zod_1.z.number().optional(), // For nested rules
    logicOperator: zod_1.z.enum(["AND", "OR"]).optional(), // For parent rules
    action: zod_1.z.object({
        type: zod_1.z.enum(["SHOW", "HIDE", "SHOW_AND_MAKE_MANDATORY", "ASSIGN_WEIGHT", "ADD_WEIGHT", "SUBTRACT_WEIGHT", "MULTIPLY_WEIGHT", "DIVIDE_WEIGHT"]),
        value: zod_1.z.any().optional(), // Action value (e.g., weight amount)
    }).optional(),
    conditions: zod_1.z.array(conditionSchema).min(1, { message: "At least one condition is required" }),
});
exports.updateRuleSchema = exports.createRuleSchema.partial(); // Allow partial updates

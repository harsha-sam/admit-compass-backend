"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRulesetSchema = exports.createRulesetSchema = void 0;
const zod_1 = require("zod");
exports.createRulesetSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'Ruleset name is required' }),
    maxWeight: zod_1.z.number().min(0).optional(), // Max weight should be >= 0
    attributeIds: zod_1.z.array(zod_1.z.number()).optional(), // Optional array of attributes to associate
});
exports.updateRulesetSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    maxWeight: zod_1.z.number().min(0).optional(),
    attributeIds: zod_1.z.array(zod_1.z.number()).optional()
});

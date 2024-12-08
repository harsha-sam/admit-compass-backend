"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRubricSchema = exports.createRubricSchema = void 0;
const zod_1 = require("zod");
exports.createRubricSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'Rubric name is required' }),
    maxWeight: zod_1.z
        .number()
        .int()
        .nonnegative({ message: 'Max weight must be a non-negative integer' })
        .default(0), // Defaults to 0 if not provided
    programIds: zod_1.z.array(zod_1.z.number().int().positive({ message: 'Program IDs must be positive integers' })).optional(),
});
exports.updateRubricSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'Rubric name must not be empty' }).optional(),
    maxWeight: zod_1.z
        .number()
        .int()
        .nonnegative({ message: 'Max weight must be a non-negative integer' })
        .optional(),
    programIds: zod_1.z.array(zod_1.z.number().int().positive({ message: 'Program IDs must be positive integers' })).optional(),
});

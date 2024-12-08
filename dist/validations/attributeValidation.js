"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAttributeSchema = exports.createAttributeSchema = void 0;
const zod_1 = require("zod");
// Define a schema that accepts a string representing a number and parses it
const numericStringSchema = zod_1.z
    .string()
    .refine((value) => !isNaN(Number(value)), {
    message: "Must be a string representing a valid number",
})
    .transform((value) => Number(value)); // Parse it into a number
exports.createAttributeSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'Attribute name is required' }),
    displayName: zod_1.z.string().min(1, { message: 'Display name is required' }),
    type: zod_1.z.enum([
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
    description: zod_1.z.string().optional(),
    validationRule: zod_1.z.object({}).passthrough().optional() || zod_1.z.string().optional(),
    categoryId: zod_1.z.union([zod_1.z.number(), numericStringSchema]).optional(),
    options: zod_1.z
        .array(zod_1.z.object({
        value: zod_1.z.string(),
        label: zod_1.z.string(),
    }))
        .optional(), // Only applicable for dropdown/multiselect
});
exports.updateAttributeSchema = exports.createAttributeSchema.partial();

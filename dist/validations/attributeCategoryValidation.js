"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'Category name is required' }),
    description: zod_1.z.string().optional(),
});
exports.updateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'Category name must not be empty' }).optional(),
    description: zod_1.z.string().optional(),
});

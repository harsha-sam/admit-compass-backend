"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProgramSchema = exports.createProgramSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createProgramSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'Name is required' }),
    description: zod_1.z.string().optional(),
    programCategory: zod_1.z.nativeEnum(client_1.ProgramCategory, {
        errorMap: () => ({ message: 'Invalid program category' })
    }),
    programType: zod_1.z.string().min(1, { message: 'Program type is required' }),
    rulesetId: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).optional()
});
exports.updateProgramSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    programCategory: zod_1.z.nativeEnum(client_1.ProgramCategory).optional(),
    programType: zod_1.z.string().optional(),
});

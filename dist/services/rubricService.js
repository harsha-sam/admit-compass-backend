"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const getAllRubrics = () => __awaiter(void 0, void 0, void 0, function* () {
    return database_1.default.rubric.findMany({
        include: { programs: true, rubricRulesets: true },
    });
});
const getRubricById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return database_1.default.rubric.findUnique({
        where: { rubricId: id },
        include: { programs: true, rubricRulesets: { include: { ruleset: true } } },
    });
});
const createRubric = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, maxWeight, programIds, rulesetIds } = data;
    return database_1.default.rubric.create({
        data: {
            name,
            maxWeight: maxWeight || 0,
            programs: programIds
                ? {
                    connect: programIds.map((id) => ({ programId: id })), // Connect existing programs
                }
                : undefined,
            rubricRulesets: rulesetIds
                ? {
                    create: rulesetIds.map((rulesetId) => ({ rulesetId })), // Create rubricRulesets
                }
                : undefined,
        },
        include: {
            programs: true,
            rubricRulesets: { include: { ruleset: true } }
        },
    });
});
const updateRubric = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, maxWeight, programIds, rulesetIds } = data;
    return database_1.default.rubric.update({
        where: { rubricId: id },
        data: {
            name,
            maxWeight,
            programs: programIds
                ? {
                    set: programIds.map((id) => ({ programId: id })), // Replace current associations
                }
                : undefined,
            rubricRulesets: rulesetIds
                ? {
                    deleteMany: {}, // Clear existing associations
                    create: rulesetIds.map((rulesetId) => ({ rulesetId })), // Recreate rubricRulesets
                }
                : undefined,
        },
        include: { programs: true, rubricRulesets: { include: { ruleset: true } } },
    });
});
const deleteRubric = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete associated rubricRulesets first to maintain referential integrity
    yield database_1.default.rubricRuleset.deleteMany({
        where: { rubricId: id },
    });
    yield database_1.default.rubric.delete({
        where: { rubricId: id },
    });
});
exports.default = {
    getAllRubrics,
    getRubricById,
    createRubric,
    updateRubric,
    deleteRubric,
};

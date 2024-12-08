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
const createRule = (attributeId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { action, conditions } = data;
    return database_1.default.rule.create({
        data: {
            targetAttributeId: attributeId,
            action,
            conditions: {
                create: conditions.map((condition) => ({
                    evaluatedAttributeId: condition.evaluatedAttributeId,
                    operator: condition.operator,
                    value1: condition.value1,
                    value2: condition.value2 || null,
                })),
            },
        },
        include: { conditions: true },
    });
});
const getRulesByAttribute = (attributeId) => __awaiter(void 0, void 0, void 0, function* () {
    return database_1.default.rule.findMany({
        where: { targetAttributeId: attributeId },
        include: { conditions: true },
    });
});
const updateRule = (ruleId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { action, conditions } = data;
    return database_1.default.rule.update({
        where: { ruleId },
        data: {
            action,
            conditions: conditions
                ? {
                    deleteMany: {}, // Clear old conditions
                    create: conditions.map((condition) => ({
                        evaluatedAttributeId: condition.evaluatedAttributeId,
                        operator: condition.operator,
                        value1: condition.value1,
                        value2: condition.value2 || null,
                    })),
                }
                : undefined,
        },
        include: { conditions: true },
    });
});
const deleteRule = (ruleId) => __awaiter(void 0, void 0, void 0, function* () {
    return database_1.default.rule.delete({
        where: { ruleId },
    });
});
exports.default = {
    createRule,
    getRulesByAttribute,
    updateRule,
    deleteRule,
};

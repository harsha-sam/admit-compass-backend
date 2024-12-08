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
// Recursive function to create nested rules
const createRulesetRule = (rulesetId_1, data_1, ...args_1) => __awaiter(void 0, [rulesetId_1, data_1, ...args_1], void 0, function* (rulesetId, data, parentRuleId = null) {
    const { action, logicOperator, conditions, childRules } = data;
    console.log("got", data, parentRuleId);
    // Create the current rule
    const createdRule = yield database_1.default.rule.create({
        data: {
            rulesetId,
            parentRuleId,
            logicOperator: logicOperator, // Only root rules have logicOperator
            action: action || {},
            conditions: {
                create: (conditions === null || conditions === void 0 ? void 0 : conditions.map((condition) => ({
                    evaluatedAttributeId: parseInt(condition.evaluatedAttributeId),
                    operator: condition.operator,
                    value1: condition.value1,
                    value2: condition.value2 || null,
                }))) || [],
            }
        },
        include: { conditions: true, childRules: true },
    });
    // Recursively create child rules
    if (childRules && childRules.length > 0) {
        for (const childRule of childRules) {
            yield createRulesetRule(rulesetId, childRule, createdRule.ruleId);
        }
    }
    return createdRule;
});
// Recursive function to fetch rules with nested logic
const getRulesetRules = (rulesetId) => __awaiter(void 0, void 0, void 0, function* () {
    const fetchRulesRecursively = (parentRuleId) => __awaiter(void 0, void 0, void 0, function* () {
        const rules = yield database_1.default.rule.findMany({
            where: { rulesetId, parentRuleId },
            include: { conditions: true },
        });
        return Promise.all(rules.map((rule) => __awaiter(void 0, void 0, void 0, function* () {
            return (Object.assign(Object.assign({}, rule), { childRules: yield fetchRulesRecursively(rule.ruleId) }));
        })));
    });
    return fetchRulesRecursively(null);
});
// Create attribute-level rule
const createAttributeRule = (attributeId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { action, logicOperator, conditions, targetOptionValue } = data;
    return database_1.default.rule.create({
        data: {
            targetAttributeId: attributeId,
            targetOptionValue,
            logicOperator: logicOperator || "AND",
            action,
            conditions: {
                create: conditions.map((condition) => ({
                    evaluatedAttributeId: parseInt(condition.evaluatedAttributeId),
                    operator: condition.operator,
                    value1: condition.value1,
                    value2: condition.value2 || null,
                })),
            },
        },
        include: { conditions: true },
    });
});
// Get attribute-level rules
const getAttributeRules = (attributeId) => __awaiter(void 0, void 0, void 0, function* () {
    return database_1.default.rule.findMany({
        where: { targetAttributeId: attributeId },
        include: { conditions: true },
    });
});
// Update a rule (both attribute-level and ruleset rules)
const updateRule = (ruleId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { action, logicOperator, conditions, childRules } = data;
    // Update the current rule
    const updatedRule = yield database_1.default.rule.update({
        where: { ruleId },
        data: {
            action,
            logicOperator,
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
        include: { conditions: true, childRules: true },
    });
    // Handle child rules (for ruleset rules)
    if (childRules) {
        // Delete existing child rules
        yield database_1.default.rule.deleteMany({ where: { parentRuleId: ruleId } });
        // Recreate child rules
        for (const childRule of childRules) {
            yield createRulesetRule(updatedRule.rulesetId, childRule, updatedRule.ruleId);
        }
    }
    return updatedRule;
});
// Delete a rule
const deleteRule = (ruleId) => __awaiter(void 0, void 0, void 0, function* () {
    return database_1.default.rule.delete({
        where: { ruleId },
    });
});
exports.default = {
    createAttributeRule,
    getAttributeRules,
    createRulesetRule,
    getRulesetRules,
    updateRule,
    deleteRule,
};

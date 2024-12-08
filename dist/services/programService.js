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
const getAllPrograms = () => __awaiter(void 0, void 0, void 0, function* () {
    return database_1.default.program.findMany();
});
const getProgramById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return database_1.default.program.findUnique({
        where: { programId: id },
    });
});
const createProgram = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return database_1.default.program.create({ data });
});
const updateProgram = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return database_1.default.program.update({
        where: { programId: id },
        data,
    });
});
const deleteProgram = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.default.program.delete({
        where: { programId: id },
    });
});
const getRulesWithChildren = (rulesetId_1, ...args_1) => __awaiter(void 0, [rulesetId_1, ...args_1], void 0, function* (rulesetId, parentRuleId = null) {
    const rules = yield database_1.default.rule.findMany({
        where: {
            rulesetId,
            parentRuleId,
        },
        include: { conditions: true },
    });
    // Fetch child rules for each rule recursively
    const rulesWithChildren = yield Promise.all(rules.map((rule) => __awaiter(void 0, void 0, void 0, function* () {
        return (Object.assign(Object.assign({}, rule), { childRules: yield getRulesWithChildren(rulesetId, rule.ruleId) }));
    })));
    return rulesWithChildren;
});
const evaluateRule = (rule, data) => {
    if (!rule.conditions || rule.conditions.length === 0)
        return true; // If no conditions, the rule is valid
    const results = rule.conditions.map((condition) => {
        const attributeValue = data[condition.evaluatedAttributeId];
        switch (condition.operator) {
            case 'equals':
                return attributeValue === condition.value1;
            case 'not_equals':
                return attributeValue !== condition.value1;
            case 'greater_than':
                return parseFloat(attributeValue) > parseFloat(condition.value1);
            case 'less_than':
                return parseFloat(attributeValue) < parseFloat(condition.value1);
            case 'greater_than_or_equal':
                return parseFloat(attributeValue) >= parseFloat(condition.value1);
            case 'less_than_or_equal':
                return parseFloat(attributeValue) <= parseFloat(condition.value1);
            case 'contains':
                if (typeof attributeValue === 'string') {
                    // Case-insensitive string contains
                    return attributeValue.toLowerCase().includes(condition.value1.toLowerCase());
                }
                else if (typeof attributeValue === 'object' && attributeValue !== null) {
                    // For objects, check if the key exists and matches the condition value
                    const key = Object.keys(attributeValue).find((k) => k.toLowerCase() === condition.value1.toLowerCase());
                    return key && attributeValue[key] === true;
                }
                return false;
            case 'not_contains':
                if (typeof attributeValue === 'string') {
                    return !attributeValue.toLowerCase().includes(condition.value1.toLowerCase());
                }
                else if (typeof attributeValue === 'object' && attributeValue !== null) {
                    const key = Object.keys(attributeValue).find((k) => k.toLowerCase() === condition.value1.toLowerCase());
                    return !(key && attributeValue[key] === true);
                }
                return true;
            default:
                return false;
        }
    });
    // Use AND logic by default if no logicOperator is specified
    const logicOperator = rule.logicOperator || 'AND';
    return logicOperator === 'AND' ? results.every(Boolean) : results.some(Boolean);
};
const processRules = (rules, data) => {
    var _a;
    let totalWeight = 0;
    for (const rule of rules) {
        // Check if the current rule is satisfied
        const isRuleSatisfied = evaluateRule(rule, data);
        // Initialize weight for the current rule
        let currentWeight = 0;
        if (isRuleSatisfied && rule.action) {
            // Apply the action if the rule is satisfied
            switch (rule.action.operation) {
                case 'add':
                    currentWeight += rule.action.points;
                    break;
                case 'subtract':
                    currentWeight -= rule.action.points;
                    break;
                case 'multiply':
                    currentWeight *= rule.action.points;
                    break;
                case 'divide':
                    currentWeight /= rule.action.points;
                    break;
                default:
                    break;
            }
        }
        // Process child rules recursively
        let childWeight = 0;
        if ((_a = rule.childRules) === null || _a === void 0 ? void 0 : _a.length) {
            const childResults = rule.childRules.map((child) => ({
                weight: processRules([child], data),
                isSatisfied: evaluateRule(child, data),
            }));
            if (rule.logicOperator === 'AND') {
                // All child rules must be satisfied
                if (childResults.every((child) => child.isSatisfied)) {
                    childWeight = childResults.reduce((sum, child) => sum + child.weight, 0);
                }
            }
            else if (rule.logicOperator === 'OR') {
                // Take the maximum weight from satisfied child rules
                childWeight = Math.max(0, ...childResults.map((child) => child.weight));
            }
        }
        // Combine the current rule's weight with its child rules' weight
        totalWeight += currentWeight + childWeight;
    }
    return totalWeight;
};
const evaluateProgramApplication = (programId, submissionData) => __awaiter(void 0, void 0, void 0, function* () {
    const program = yield database_1.default.program.findUnique({
        where: { programId },
    });
    if (!program || !program.rulesetId) {
        throw new Error('Program or associated ruleset not found');
    }
    const ruleset = yield database_1.default.ruleset.findUnique({
        where: { rulesetId: program.rulesetId },
    });
    if (!ruleset) {
        throw new Error('Program or associated ruleset not found');
    }
    // Fetch rules and their nested structure
    const rules = yield getRulesWithChildren(ruleset.rulesetId);
    // Initialize score with baseWeight
    let score = ruleset.baseWeight || 0;
    // Process all rules
    score += processRules(rules, submissionData);
    return {
        programId,
        rulesetId: ruleset.rulesetId,
        maxScore: ruleset.maxWeight,
        acceptance: Math.round((score / ruleset.maxWeight) * 100),
    };
});
exports.default = {
    getAllPrograms,
    getProgramById,
    createProgram,
    updateProgram,
    deleteProgram,
    evaluateProgramApplication
};

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
const ruleService_1 = __importDefault(require("./ruleService"));
const calculateMaxWeightForRules = (rule) => {
    var _a, _b, _c, _d;
    if (!rule)
        return 0;
    let maxWeight = 0;
    let currentWeight = 0;
    if (rule.action) {
        // Calculate weight for the current rule
        if (((_a = rule.action) === null || _a === void 0 ? void 0 : _a.operation) === 'add') {
            currentWeight += rule.action.points;
        }
        else if (((_b = rule.action) === null || _b === void 0 ? void 0 : _b.operation) === 'subtract') {
            currentWeight -= rule.action.points;
        }
        else if (((_c = rule.action) === null || _c === void 0 ? void 0 : _c.operation) === 'multiply') {
            currentWeight *= rule.action.points;
        }
        else if (((_d = rule.action) === null || _d === void 0 ? void 0 : _d.operation) === 'divide' && rule.action.points !== 0) {
            currentWeight /= rule.action.points;
        }
    }
    // Recursively calculate the weight for child rules
    if (rule.childRules && rule.childRules.length > 0) {
        const childWeights = rule.childRules.map(calculateMaxWeightForRules);
        if (rule.logicOperator === 'AND') {
            // For AND, sum up all child rule weights
            currentWeight += childWeights.reduce((sum, weight) => sum + weight, 0);
        }
        else if (rule.logicOperator === 'OR') {
            // For OR, take the maximum child rule weight
            currentWeight += Math.max(...childWeights);
        }
    }
    // Update the overall max weight
    maxWeight = Math.max(maxWeight, currentWeight);
    return maxWeight;
};
const createRuleset = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, baseWeight = 0, maxWeight = 100, rules, description, attributes, formOrder } = data;
    // Calculate maxWeight based on rules if needed
    const calculatedMaxWeight = calculateMaxWeightForRules(rules[0]) || maxWeight;
    // Step 1: Create the Ruleset
    const createdRuleset = yield database_1.default.ruleset.create({
        data: {
            name,
            description,
            baseWeight: baseWeight || 0,
            maxWeight: calculatedMaxWeight,
            attribute_ids: attributes.map((attr) => attr.attributeId), // Map attributes to attribute IDs
        },
    });
    // Step 2: Handle formOrder and create RulesetAttributeConfig
    if (formOrder && Array.isArray(formOrder)) {
        formOrder.forEach((position, index) => {
            database_1.default.rulesetAttributeConfig.create({
                data: {
                    rulesetId: createdRuleset.rulesetId,
                    attributeId: attributes[index].attributeId,
                    displayOrder: position,
                },
            });
        });
    }
    // Step 3: Create Rules (if any are provided)
    if (rules && rules.length > 0) {
        for (const rule of rules) {
            yield ruleService_1.default.createRulesetRule(createdRuleset.rulesetId, rule);
        }
    }
    // Step 4: Return the created ruleset with related data
    return database_1.default.ruleset.findUnique({
        where: { rulesetId: createdRuleset.rulesetId },
        include: { rules: true, rulesetAttributeConfig: true },
    });
});
const getAllRulesets = () => __awaiter(void 0, void 0, void 0, function* () {
    return database_1.default.ruleset.findMany({
        include: { rules: true }, // Include associated rules if needed
    });
});
const getRulesetById = (rulesetId) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the ruleset along with rules and attribute configuration
    const ruleset = yield database_1.default.ruleset.findUnique({
        where: { rulesetId },
        include: { rules: { include: { conditions: true } }, rulesetAttributeConfig: true },
    });
    if (!ruleset) {
        throw new Error(`Ruleset with ID ${rulesetId} not found`);
    }
    // Fetch attributes using attribute_ids
    const attributes = yield database_1.default.attribute.findMany({
        where: {
            attributeId: { in: ruleset.attribute_ids },
        },
    });
    // Fetch rules targeting attributes
    const attributeRules = yield database_1.default.rule.findMany({
        where: {
            targetAttributeId: {
                in: ruleset.attribute_ids,
            }, // Fetch only rules with a targetAttributeId
        },
        include: { conditions: true },
    });
    // Group rules by targetAttributeId
    const rulesByAttribute = {};
    attributeRules.forEach((rule) => {
        if (!rulesByAttribute[rule.targetAttributeId]) {
            rulesByAttribute[rule.targetAttributeId] = [];
        }
        rulesByAttribute[rule.targetAttributeId].push(rule);
    });
    // Derive formOrder: attributeId positions based on displayOrder, or use default ordering
    const formOrder = Array(attributes.length).fill(null);
    if (ruleset.rulesetAttributeConfig && ruleset.rulesetAttributeConfig.length > 0) {
        // Use displayOrder from rulesetAttributeConfig
        ruleset.rulesetAttributeConfig.forEach((config) => {
            const attributeIndex = attributes.findIndex((attr) => attr.attributeId === config.attributeId);
            if (attributeIndex !== -1) {
                formOrder[attributeIndex] = config.displayOrder;
            }
        });
    }
    else {
        // Use default order if config is not present
        attributes.forEach((attr, index) => {
            formOrder[index] = index; // Assign default positions starting from 1
        });
    }
    // Sort attributes by formOrder
    const sortedAttributes = attributes
        .map((attr) => (Object.assign(Object.assign({}, attr), { options: attr.options ? JSON.parse(attr.options) : null, validationRule: attr.validationRule ? JSON.parse(attr.validationRule) : null, rules: rulesByAttribute[attr.attributeId] || [] })))
        .sort((a, b) => {
        const orderA = formOrder[attributes.findIndex((attr) => attr.attributeId === a.attributeId)];
        const orderB = formOrder[attributes.findIndex((attr) => attr.attributeId === b.attributeId)];
        return (orderA || Infinity) - (orderB || Infinity);
    });
    // Return ruleset with attributes, their rules, and formOrder
    return Object.assign(Object.assign({}, ruleset), { attributes: sortedAttributes, formOrder });
});
const updateRuleset = (rulesetId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, baseWeight, maxWeight, rules, description, attributes, formOrder } = data;
    // Update the ruleset's main properties
    const updatedRuleset = yield database_1.default.ruleset.update({
        where: { rulesetId },
        data: {
            name,
            description,
            baseWeight: baseWeight || 0,
            maxWeight: calculateMaxWeightForRules(rules[0]),
            attribute_ids: attributes.map((attr) => attr.attributeId), // Update attributes
        },
    });
    // Handle formOrder updates
    if (formOrder && Array.isArray(formOrder)) {
        // Delete existing attribute configurations
        yield database_1.default.rulesetAttributeConfig.deleteMany({ where: { rulesetId } });
        // Recreate attribute configurations with new formOrder
        for (const [index, position] of formOrder.entries()) {
            yield database_1.default.rulesetAttributeConfig.create({
                data: {
                    rulesetId,
                    attributeId: attributes[index].attributeId,
                    displayOrder: position,
                },
            });
        }
    }
    // Handle rules updates
    if (rules && rules.length > 0) {
        // Delete existing rules for this ruleset
        yield database_1.default.rule.deleteMany({ where: { rulesetId } });
        // Recreate rules
        for (const rule of rules) {
            yield ruleService_1.default.createRulesetRule(rulesetId, rule);
        }
    }
    // Return the updated ruleset with related data
    return database_1.default.ruleset.findUnique({
        where: { rulesetId },
        include: { rules: true, rulesetAttributeConfig: true },
    });
});
const deleteRuleset = (rulesetId) => __awaiter(void 0, void 0, void 0, function* () {
    return database_1.default.ruleset.delete({
        where: { rulesetId },
    });
});
exports.default = {
    createRuleset,
    getAllRulesets,
    getRulesetById,
    updateRuleset,
    deleteRuleset,
};

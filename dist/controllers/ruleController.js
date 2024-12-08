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
const ruleService_1 = __importDefault(require("../services/ruleService"));
const createAttributeRule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { attributeId } = req.params;
        const rule = yield ruleService_1.default.createAttributeRule(Number(attributeId), req.body);
        res.status(201).json(rule);
    }
    catch (error) {
        next(error);
    }
});
const getAttributeRules = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { attributeId } = req.params;
        const rules = yield ruleService_1.default.getAttributeRules(Number(attributeId));
        res.status(200).json(rules);
    }
    catch (error) {
        next(error);
    }
});
const createRulesetRule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rulesetId } = req.params;
        const rule = yield ruleService_1.default.createRulesetRule(Number(rulesetId), req.body);
        res.status(201).json(rule);
    }
    catch (error) {
        next(error);
    }
});
const getRulesetRules = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rulesetId } = req.params;
        const rules = yield ruleService_1.default.getRulesetRules(Number(rulesetId));
        res.status(200).json(rules);
    }
    catch (error) {
        next(error);
    }
});
const updateRule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ruleId } = req.params;
        const updatedRule = yield ruleService_1.default.updateRule(Number(ruleId), req.body);
        res.status(200).json(updatedRule);
    }
    catch (error) {
        next(error);
    }
});
const deleteRule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ruleId } = req.params;
        yield ruleService_1.default.deleteRule(Number(ruleId));
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    createAttributeRule,
    getAttributeRules,
    createRulesetRule,
    getRulesetRules,
    updateRule,
    deleteRule,
};

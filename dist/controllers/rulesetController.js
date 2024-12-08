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
exports.deleteRuleset = exports.updateRuleset = exports.getRulesetById = exports.getAllRulesets = exports.createRuleset = void 0;
const rulesetService_1 = __importDefault(require("../services/rulesetService"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const createRuleset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ruleset = yield rulesetService_1.default.createRuleset(req.body);
        res.status(201).json(ruleset);
    }
    catch (error) {
        next(error); // Pass error to centralized handler
    }
});
exports.createRuleset = createRuleset;
const getAllRulesets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rulesets = yield rulesetService_1.default.getAllRulesets();
        res.status(200).json(rulesets);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllRulesets = getAllRulesets;
const getRulesetById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rulesetId } = req.params;
        const ruleset = yield rulesetService_1.default.getRulesetById(Number(rulesetId));
        if (!ruleset) {
            return next(new AppError_1.default('Ruleset not found', 404));
        }
        res.status(200).json(ruleset);
    }
    catch (error) {
        next(error);
    }
});
exports.getRulesetById = getRulesetById;
const updateRuleset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rulesetId } = req.params;
        const updatedRuleset = yield rulesetService_1.default.updateRuleset(Number(rulesetId), req.body);
        res.status(200).json(updatedRuleset);
    }
    catch (error) {
        next(error);
    }
});
exports.updateRuleset = updateRuleset;
const deleteRuleset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rulesetId } = req.params;
        yield rulesetService_1.default.deleteRuleset(Number(rulesetId));
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteRuleset = deleteRuleset;

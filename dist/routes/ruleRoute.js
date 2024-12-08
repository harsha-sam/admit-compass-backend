"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ruleController_1 = __importDefault(require("../controllers/ruleController"));
const validateRequest_1 = require("../middelware/validateRequest");
const ruleValidation_1 = require("../validations/ruleValidation");
const router = express_1.default.Router();
// Attribute-Level and Option-Level Rules
router.post('/attributes/:attributeId/rules', (0, validateRequest_1.validateRequest)(ruleValidation_1.createRuleSchema), ruleController_1.default.createAttributeRule);
router.get('/attributes/:attributeId/rules', ruleController_1.default.getAttributeRules);
// Ruleset Rules
router.post('/ruleset/:rulesetId/rules', (0, validateRequest_1.validateRequest)(ruleValidation_1.createRuleSchema), ruleController_1.default.createRulesetRule);
router.get('/ruleset/:rulesetId/rules', ruleController_1.default.getRulesetRules);
// Update and Delete Rules
router.patch('/:ruleId', (0, validateRequest_1.validateRequest)(ruleValidation_1.updateRuleSchema), ruleController_1.default.updateRule);
router.delete('/:ruleId', ruleController_1.default.deleteRule);
exports.default = router;

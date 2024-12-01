import express from 'express';
import ruleController from '../controllers/ruleController';
import { validateRequest } from '../middelware/validateRequest';
import { createRuleSchema, updateRuleSchema } from '../validations/ruleValidation';

const router = express.Router();

// Attribute-Level and Option-Level Rules
router.post('/attributes/:attributeId/rules', validateRequest(createRuleSchema), ruleController.createAttributeRule);
router.get('/attributes/:attributeId/rules', ruleController.getAttributeRules);

// Ruleset Rules
router.post('/ruleset/:rulesetId/rules', validateRequest(createRuleSchema), ruleController.createRulesetRule);
router.get('/ruleset/:rulesetId/rules', ruleController.getRulesetRules);

// Update and Delete Rules
router.patch('/:ruleId', validateRequest(updateRuleSchema), ruleController.updateRule);
router.delete('/:ruleId', ruleController.deleteRule);

export default router;

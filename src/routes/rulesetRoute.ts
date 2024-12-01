import express from 'express';
import * as rulesetController from '../controllers/rulesetController';

const router = express.Router();

router.post('/', rulesetController.createRuleset);
router.get('/', rulesetController.getAllRulesets);
router.get('/:rulesetId', rulesetController.getRulesetById);
router.patch('/:rulesetId', rulesetController.updateRuleset);
router.delete('/:rulesetId', rulesetController.deleteRuleset);

export default router;

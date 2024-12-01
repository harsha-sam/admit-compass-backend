import { Request, Response, NextFunction } from 'express';
import ruleService from '../services/ruleService';

const createAttributeRule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { attributeId } = req.params;
    const rule = await ruleService.createAttributeRule(Number(attributeId), req.body);
    res.status(201).json(rule);
  } catch (error) {
    next(error);
  }
};

const getAttributeRules = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { attributeId } = req.params;
    const rules = await ruleService.getAttributeRules(Number(attributeId));
    res.status(200).json(rules);
  } catch (error) {
    next(error);
  }
};

const createRulesetRule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rulesetId } = req.params;
    const rule = await ruleService.createRulesetRule(Number(rulesetId), req.body);
    res.status(201).json(rule);
  } catch (error) {
    next(error);
  }
};

const getRulesetRules = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rulesetId } = req.params;
    const rules = await ruleService.getRulesetRules(Number(rulesetId));
    res.status(200).json(rules);
  } catch (error) {
    next(error);
  }
};

const updateRule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ruleId } = req.params;
    const updatedRule = await ruleService.updateRule(Number(ruleId), req.body);
    res.status(200).json(updatedRule);
  } catch (error) {
    next(error);
  }
};

const deleteRule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ruleId } = req.params;
    await ruleService.deleteRule(Number(ruleId));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export default {
  createAttributeRule,
  getAttributeRules,
  createRulesetRule,
  getRulesetRules,
  updateRule,
  deleteRule,
};

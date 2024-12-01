import { Request, Response, NextFunction } from 'express';
import rulesetService from '../services/rulesetService';
import AppError from '../utils/AppError';

export const createRuleset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ruleset = await rulesetService.createRuleset(req.body);
    res.status(201).json(ruleset);
  } catch (error) {
    next(error); // Pass error to centralized handler
  }
};

export const getAllRulesets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rulesets = await rulesetService.getAllRulesets();
    res.status(200).json(rulesets);
  } catch (error) {
    next(error);
  }
};

export const getRulesetById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rulesetId } = req.params;
    const ruleset = await rulesetService.getRulesetById(Number(rulesetId));
    if (!ruleset) {
      return next(new AppError('Ruleset not found', 404));
    }
    res.status(200).json(ruleset);
  } catch (error) {
    next(error);
  }
};

export const updateRuleset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rulesetId } = req.params;
    const updatedRuleset = await rulesetService.updateRuleset(Number(rulesetId), req.body);
    res.status(200).json(updatedRuleset);
  } catch (error) {
    next(error);
  }
};

export const deleteRuleset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rulesetId } = req.params;
    await rulesetService.deleteRuleset(Number(rulesetId));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

import { Request, Response, NextFunction } from 'express';
import rubricService from '../services/rubricService'

const getAllRubrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rubrics = await rubricService.getAllRubrics();
    res.status(200).json(rubrics);
  } catch (error) {
    next(error);
  }
};

const getRubricById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const rubricId = Number(id);
    if (isNaN(rubricId)) {
      res.status(400).json({ error: 'Invalid rubric ID' });
      return;
    }

    const rubric = await rubricService.getRubricById(rubricId);
    if (!rubric) {
      res.status(404).json({ error: 'Rubric not found' });
      return;
    }

    res.status(200).json(rubric);
  } catch (error) {
    next(error);
  }
};

const createRubric = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, maxWeight, programIds } = req.body; // program_ids is an array of program IDs
    const rubric = await rubricService.createRubric({ name, maxWeight, programIds });
    res.status(201).json(rubric);
  } catch (error) {
    next(error);
  }
};

const updateRubric = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, maxWeight, programIds } = req.body; 
    const updatedRubric = await rubricService.updateRubric(Number(id), { name, maxWeight, programIds });
    res.status(200).json(updatedRubric);
  } catch (error) {
    next(error);
  }
};


const deleteRubric = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const rubricId = Number(id);
    if (isNaN(rubricId)) {
      res.status(400).json({ error: 'Invalid rubric ID' });
      return;
    }

    await rubricService.deleteRubric(rubricId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export default {
  getAllRubrics,
  getRubricById,
  createRubric,
  updateRubric,
  deleteRubric,
};

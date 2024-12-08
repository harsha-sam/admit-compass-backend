// src/controllers/programController.ts
import { Request, Response, NextFunction } from 'express';
import programService from '../services/programService';

const getAllPrograms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const programs = await programService.getAllPrograms();
    res.status(200).json(programs);
  } catch (error) {
    next(error);
  }
};

const getProgramById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const program = await programService.getProgramById(Number(id));
    if (!program) {
      res.status(404).json({ message: 'Program not found' });
    }
    else {
      res.status(200).json(program);
    }
  } catch (error) {
    next(error);
  }
};

const createProgram = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const program = await programService.createProgram(req.body);
    res.status(201).json(program);
  } catch (error) {
    next(error);
  }
};

const updateProgram = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedProgram = await programService.updateProgram(Number(id), req.body);
    res.status(200).json(updatedProgram);
  } catch (error) {
    next(error);
  }
};

const deleteProgram = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await programService.deleteProgram(Number(id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const evaluateProgram = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const submissionData = req.body; // Payload from the client

    const result = await programService.evaluateProgramApplication(Number(id), submissionData);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export default {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  evaluateProgram
};

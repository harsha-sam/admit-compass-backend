import { Request, Response } from 'express';
import prisma from '../utils/prismaClient';

export const getPrograms = async (req: Request, res: Response) => {
  try {
    const programs = await prisma.program.findMany();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createProgram = async (req: Request, res: Response) => {
  const { name, description, attachment_types, requirements } = req.body;

  try {
    const program = await prisma.program.create({
      data: { name, description, attachment_types, requirements },
    });
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

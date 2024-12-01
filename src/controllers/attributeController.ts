import { Request, Response, NextFunction } from 'express';
import attributeService from '../services/attributeService';

const getAllAttributes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const attributes = await attributeService.getAllAttributes();
    res.status(200).json(attributes);
  } catch (error) {
    next(error);
  }
};

const getAttributeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const attribute = await attributeService.getAttributeById(Number(id));
    if (!attribute) {
      res.status(404).json({ message: 'Attribute not found' });
      return;
    }
    res.status(200).json(attribute);
  } catch (error) {
    next(error);
  }
};

const createAttribute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const attribute = await attributeService.createAttribute(req.body);
    res.status(201).json(attribute);
  } catch (error) {
    next(error);
  }
};

const updateAttribute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedAttribute = await attributeService.updateAttribute(Number(id), req.body);
    res.status(200).json(updatedAttribute);
  } catch (error) {
    next(error);
  }
};

const deleteAttribute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await attributeService.deleteAttribute(Number(id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export default {
  getAllAttributes,
  getAttributeById,
  createAttribute,
  updateAttribute,
  deleteAttribute,
};

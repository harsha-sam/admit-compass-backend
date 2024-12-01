import { Request, Response, NextFunction } from 'express';
import attributeCategoryService from '../services/attributeCategoryService';
import prisma from '../config/database';

const getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await attributeCategoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await attributeCategoryService.getCategoryById(Number(id));
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await attributeCategoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedCategory = await attributeCategoryService.updateCategory(Number(id), req.body);
    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Check if the category has any associated attributes
  try {
    const { id } = req.params;
    const associatedAttributes = await prisma.attribute.count({
      where: { categoryId: parseInt(id) },
    });
    if (associatedAttributes > 0) {
      throw new Error('Cannot delete category. It has associated attributes.');
    }
    // Proceed with deletion if no attributes are associated
    await prisma.attributeCategory.delete({
      where: { categoryId: parseInt(id) },
    });
    res.status(204).send();
  }
 catch (error) {
    next(error);
  }

};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

import express from 'express';
import attributeCategoryController from '../controllers/attributeCategoryController';
import { validateRequest } from '../middelware/validateRequest';
import { createCategorySchema, updateCategorySchema } from '../validations/attributeCategoryValidation';

const router = express.Router();

router.get('/', attributeCategoryController.getAllCategories);
router.get('/:id', attributeCategoryController.getCategoryById);
router.post('/', validateRequest(createCategorySchema), attributeCategoryController.createCategory);
router.patch('/:id', validateRequest(updateCategorySchema), attributeCategoryController.updateCategory);
router.delete('/:id', attributeCategoryController.deleteCategory);

export default router;

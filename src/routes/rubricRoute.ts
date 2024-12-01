import express from 'express';
import rubricController from '../controllers/rubricController';
import { validateRequest } from '../middelware/validateRequest';
import { createRubricSchema, updateRubricSchema } from '../validations/rubricValidation';

const router = express.Router();

// Get all rubrics
router.get('/', rubricController.getAllRubrics);

// Get a single rubric by ID
router.get('/:id', rubricController.getRubricById);

// Create a new rubric
router.post('/', validateRequest(createRubricSchema), rubricController.createRubric);

// Update an existing rubric
router.patch('/:id', validateRequest(updateRubricSchema), rubricController.updateRubric);

// Delete a rubric
router.delete('/:id', rubricController.deleteRubric);

export default router;

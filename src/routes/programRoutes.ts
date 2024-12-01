import express from 'express';
import programController from '../controllers/programController';
import { validateRequest } from '../middelware/validateRequest';
import { createProgramSchema, updateProgramSchema } from '../validations/programValidation';

const router = express.Router();

router.get('/', programController.getAllPrograms);
router.get('/:id', programController.getProgramById);
router.post('/', validateRequest(createProgramSchema), programController.createProgram);
router.patch('/:id', validateRequest(updateProgramSchema), programController.updateProgram);
router.delete('/:id', programController.deleteProgram);

export default router;

import express from 'express';
import attributeController from '../controllers/attributeController';
import { validateRequest } from '../middelware/validateRequest';
import { createAttributeSchema, updateAttributeSchema } from '../validations/attributeValidation';

const router = express.Router();

router.get('/', attributeController.getAllAttributes);
router.get('/:id', attributeController.getAttributeById);
router.post('/', validateRequest(createAttributeSchema), attributeController.createAttribute);
router.patch('/:id', validateRequest(updateAttributeSchema), attributeController.updateAttribute);
router.delete('/:id', attributeController.deleteAttribute);

export default router;

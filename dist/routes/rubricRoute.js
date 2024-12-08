"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rubricController_1 = __importDefault(require("../controllers/rubricController"));
const validateRequest_1 = require("../middelware/validateRequest");
const rubricValidation_1 = require("../validations/rubricValidation");
const router = express_1.default.Router();
// Get all rubrics
router.get('/', rubricController_1.default.getAllRubrics);
// Get a single rubric by ID
router.get('/:id', rubricController_1.default.getRubricById);
// Create a new rubric
router.post('/', (0, validateRequest_1.validateRequest)(rubricValidation_1.createRubricSchema), rubricController_1.default.createRubric);
// Update an existing rubric
router.patch('/:id', (0, validateRequest_1.validateRequest)(rubricValidation_1.updateRubricSchema), rubricController_1.default.updateRubric);
// Delete a rubric
router.delete('/:id', rubricController_1.default.deleteRubric);
exports.default = router;

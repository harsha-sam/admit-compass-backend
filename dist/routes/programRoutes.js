"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const programController_1 = __importDefault(require("../controllers/programController"));
const validateRequest_1 = require("../middelware/validateRequest");
const programValidation_1 = require("../validations/programValidation");
const router = express_1.default.Router();
router.get('/', programController_1.default.getAllPrograms);
router.get('/:id', programController_1.default.getProgramById);
router.post('/', (0, validateRequest_1.validateRequest)(programValidation_1.createProgramSchema), programController_1.default.createProgram);
router.post('/:id/evaluate', programController_1.default.evaluateProgram);
router.patch('/:id', (0, validateRequest_1.validateRequest)(programValidation_1.updateProgramSchema), programController_1.default.updateProgram);
router.delete('/:id', programController_1.default.deleteProgram);
exports.default = router;

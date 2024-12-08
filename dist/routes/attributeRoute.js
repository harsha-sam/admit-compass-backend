"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attributeController_1 = __importDefault(require("../controllers/attributeController"));
const validateRequest_1 = require("../middelware/validateRequest");
const attributeValidation_1 = require("../validations/attributeValidation");
const router = express_1.default.Router();
router.get('/', attributeController_1.default.getAllAttributes);
router.get('/:id', attributeController_1.default.getAttributeById);
router.post('/', (0, validateRequest_1.validateRequest)(attributeValidation_1.createAttributeSchema), attributeController_1.default.createAttribute);
router.patch('/:id', (0, validateRequest_1.validateRequest)(attributeValidation_1.updateAttributeSchema), attributeController_1.default.updateAttribute);
router.delete('/:id', attributeController_1.default.deleteAttribute);
exports.default = router;

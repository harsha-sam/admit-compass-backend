"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attributeCategoryController_1 = __importDefault(require("../controllers/attributeCategoryController"));
const validateRequest_1 = require("../middelware/validateRequest");
const attributeCategoryValidation_1 = require("../validations/attributeCategoryValidation");
const router = express_1.default.Router();
router.get('/', attributeCategoryController_1.default.getAllCategories);
router.get('/:id', attributeCategoryController_1.default.getCategoryById);
router.post('/', (0, validateRequest_1.validateRequest)(attributeCategoryValidation_1.createCategorySchema), attributeCategoryController_1.default.createCategory);
router.patch('/:id', (0, validateRequest_1.validateRequest)(attributeCategoryValidation_1.updateCategorySchema), attributeCategoryController_1.default.updateCategory);
router.delete('/:id', attributeCategoryController_1.default.deleteCategory);
exports.default = router;

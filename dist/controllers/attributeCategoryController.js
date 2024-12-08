"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const attributeCategoryService_1 = __importDefault(require("../services/attributeCategoryService"));
const database_1 = __importDefault(require("../config/database"));
const getAllCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield attributeCategoryService_1.default.getAllCategories();
        res.status(200).json(categories);
    }
    catch (error) {
        next(error);
    }
});
const getCategoryById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield attributeCategoryService_1.default.getCategoryById(Number(id));
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        res.status(200).json(category);
    }
    catch (error) {
        next(error);
    }
});
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield attributeCategoryService_1.default.createCategory(req.body);
        res.status(201).json(category);
    }
    catch (error) {
        next(error);
    }
});
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedCategory = yield attributeCategoryService_1.default.updateCategory(Number(id), req.body);
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        next(error);
    }
});
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the category has any associated attributes
    try {
        const { id } = req.params;
        const associatedAttributes = yield database_1.default.attribute.count({
            where: { categoryId: parseInt(id) },
        });
        if (associatedAttributes > 0) {
            throw new Error('Cannot delete category. It has associated attributes.');
        }
        // Proceed with deletion if no attributes are associated
        yield database_1.default.attributeCategory.delete({
            where: { categoryId: parseInt(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};

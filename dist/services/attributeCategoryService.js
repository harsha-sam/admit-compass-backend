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
const database_1 = __importDefault(require("../config/database"));
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    return database_1.default.attributeCategory.findMany({});
});
const getCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return database_1.default.attributeCategory.findUnique({
        where: { categoryId: id },
        include: { attributes: true },
    });
});
const createCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return database_1.default.attributeCategory.create({
        data,
    });
});
const updateCategory = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return database_1.default.attributeCategory.update({
        where: { categoryId: id },
        data,
    });
});
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.default.attributeCategory.delete({
        where: { categoryId: id },
    });
});
exports.default = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};

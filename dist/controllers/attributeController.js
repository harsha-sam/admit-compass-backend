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
const attributeService_1 = __importDefault(require("../services/attributeService"));
const getAllAttributes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const attributes = yield attributeService_1.default.getAllAttributes();
        res.status(200).json(attributes);
    }
    catch (error) {
        next(error);
    }
});
const getAttributeById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const attribute = yield attributeService_1.default.getAttributeById(Number(id));
        if (!attribute) {
            res.status(404).json({ message: 'Attribute not found' });
            return;
        }
        res.status(200).json(attribute);
    }
    catch (error) {
        next(error);
    }
});
const createAttribute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const attribute = yield attributeService_1.default.createAttribute(req.body);
        res.status(201).json(attribute);
    }
    catch (error) {
        next(error);
    }
});
const updateAttribute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedAttribute = yield attributeService_1.default.updateAttribute(Number(id), req.body);
        res.status(200).json(updatedAttribute);
    }
    catch (error) {
        next(error);
    }
});
const deleteAttribute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield attributeService_1.default.deleteAttribute(Number(id));
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getAllAttributes,
    getAttributeById,
    createAttribute,
    updateAttribute,
    deleteAttribute,
};

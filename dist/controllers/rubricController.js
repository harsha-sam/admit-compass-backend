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
const rubricService_1 = __importDefault(require("../services/rubricService"));
const getAllRubrics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rubrics = yield rubricService_1.default.getAllRubrics();
        res.status(200).json(rubrics);
    }
    catch (error) {
        next(error);
    }
});
const getRubricById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const rubricId = Number(id);
        if (isNaN(rubricId)) {
            res.status(400).json({ error: 'Invalid rubric ID' });
            return;
        }
        const rubric = yield rubricService_1.default.getRubricById(rubricId);
        if (!rubric) {
            res.status(404).json({ error: 'Rubric not found' });
            return;
        }
        res.status(200).json(rubric);
    }
    catch (error) {
        next(error);
    }
});
const createRubric = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, maxWeight, programIds } = req.body; // program_ids is an array of program IDs
        const rubric = yield rubricService_1.default.createRubric({ name, maxWeight, programIds });
        res.status(201).json(rubric);
    }
    catch (error) {
        next(error);
    }
});
const updateRubric = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, maxWeight, programIds } = req.body;
        const updatedRubric = yield rubricService_1.default.updateRubric(Number(id), { name, maxWeight, programIds });
        res.status(200).json(updatedRubric);
    }
    catch (error) {
        next(error);
    }
});
const deleteRubric = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const rubricId = Number(id);
        if (isNaN(rubricId)) {
            res.status(400).json({ error: 'Invalid rubric ID' });
            return;
        }
        yield rubricService_1.default.deleteRubric(rubricId);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getAllRubrics,
    getRubricById,
    createRubric,
    updateRubric,
    deleteRubric,
};

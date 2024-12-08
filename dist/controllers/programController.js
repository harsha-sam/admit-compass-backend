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
const programService_1 = __importDefault(require("../services/programService"));
const getAllPrograms = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const programs = yield programService_1.default.getAllPrograms();
        res.status(200).json(programs);
    }
    catch (error) {
        next(error);
    }
});
const getProgramById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const program = yield programService_1.default.getProgramById(Number(id));
        if (!program) {
            res.status(404).json({ message: 'Program not found' });
        }
        else {
            res.status(200).json(program);
        }
    }
    catch (error) {
        next(error);
    }
});
const createProgram = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const program = yield programService_1.default.createProgram(req.body);
        res.status(201).json(program);
    }
    catch (error) {
        next(error);
    }
});
const updateProgram = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedProgram = yield programService_1.default.updateProgram(Number(id), req.body);
        res.status(200).json(updatedProgram);
    }
    catch (error) {
        next(error);
    }
});
const deleteProgram = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield programService_1.default.deleteProgram(Number(id));
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
const evaluateProgram = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const submissionData = req.body; // Payload from the client
        const result = yield programService_1.default.evaluateProgramApplication(Number(id), submissionData);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getAllPrograms,
    getProgramById,
    createProgram,
    updateProgram,
    deleteProgram,
    evaluateProgram
};

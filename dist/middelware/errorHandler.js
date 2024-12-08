"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError_1.default) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    else {
        console.error('Unexpected Error:', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong.',
        });
    }
};
exports.default = errorHandler;

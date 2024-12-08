"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body); // Validate the request body
        next(); // Call the next middleware/controller if validation passes
    }
    catch (err) {
        if (err.errors) {
            // Zod's validation errors
            const errorMessages = err.errors.map((e) => e.message);
            res.status(400).json({ errors: errorMessages });
        }
        else {
            next(err); // Pass unexpected errors to the error handler
        }
    }
};
exports.validateRequest = validateRequest;

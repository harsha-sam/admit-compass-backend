import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateRequest =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body); // Validate the request body
      next(); // Call the next middleware/controller if validation passes
    } catch (err: any) {
      if (err.errors) {
        // Zod's validation errors
        const errorMessages = err.errors.map((e: any) => e.message);
        res.status(400).json({ errors: errorMessages });
      } else {
        next(err); // Pass unexpected errors to the error handler
      }
    }
  };

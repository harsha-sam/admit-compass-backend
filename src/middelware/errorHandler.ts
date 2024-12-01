import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  } else {
    console.error('Unexpected Error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong.',
    });
  }
};

export default errorHandler;

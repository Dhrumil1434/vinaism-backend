import { ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.util';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      action: null,
      errorCode: 'VALIDATION_ERROR',
      message: 'Invalid input data',
      errors: err.issues, // Zod's detailed error array
      data: null,
    });
  }

  // Handle your custom ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode || 500).json({
      success: false,
      action: err.action || null,
      errorCode: err.errorCode || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Something went wrong',
      errors: err.errors || [],
      data: err.data || null,
    });
  }

  // Fallback: generic error
  return res.status(500).json({
    success: false,
    action: null,
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong',
    errors: [],
    data: null,
  });
}

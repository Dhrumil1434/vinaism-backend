import { ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.util';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    console.error(
      `[${new Date().toISOString()}] [${req.method} ${req.originalUrl}] ZodError:`,
      err.message
    );
    console.error('Zod issues:', JSON.stringify(err.issues, null, 2));
    if (err.stack) {
      console.error('Stack:', err.stack);
    }
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
    console.error(
      `[${new Date().toISOString()}] [${req.method} ${req.originalUrl}] ApiError:`,
      err.errorCode,
      err.message
    );
    if (err.errors && err.errors.length > 0) {
      console.error('ApiError details:', JSON.stringify(err.errors, null, 2));
    }
    if (err.stack) {
      console.error('Stack:', err.stack);
    }
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
  console.error(
    `[${new Date().toISOString()}] [${req.method} ${req.originalUrl}] Unhandled Error:`,
    err.message || err
  );
  if (err.stack) {
    console.error('Stack:', err.stack);
  }
  return res.status(500).json({
    success: false,
    action: null,
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong',
    errors: [],
    data: null,
  });
}

// src/middleware/validationMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod'; // Import z and ZodError
import { StatusCodes } from 'http-status-codes'; // Import StatusCodes
import { ApiError } from '@utils-core';

const handleValidation = <T>(
  schema: z.ZodSchema<T>, // Use z.ZodSchema to accept any Zod schema type
  data: unknown,
  label: string,
  next: NextFunction
): T | undefined => {
  // Return type T or undefined if an error is passed to next
  try {
    const value = schema.parse(data);
    return value;
  } catch (error) {
    if (error instanceof ZodError) {
      // Map Zod's 'issues' (validation errors) to a more structured format.
      const errors = error.issues.map((issue) => ({
        field: issue.path.join('.'), // Path to the field that failed validation
        message: issue.message, // Zod's error message for the issue
      }));

      // Create and pass an ApiError to the next middleware.
      next(
        new ApiError(
          'VALIDATION_ERROR',
          StatusCodes.BAD_REQUEST,
          `INVALID_REQUEST_${label.toUpperCase()}`, // User-friendly error code
          `Request ${label} validation failed`, // Internal message
          errors // Detailed validation errors
        )
      );
      return undefined; // Indicate that validation failed and error was passed
    }
    // If it's not a ZodError, it's an unexpected error.
    // Re-throw or pass a generic internal server error.
    next(
      new ApiError(
        'INTERNAL_SERVER_ERROR',
        StatusCodes.INTERNAL_SERVER_ERROR,
        'UNEXPECTED_ERROR',
        `An unexpected error occurred during ${label} validation.`
      )
    );
    return undefined;
  }
};

/**
 * Middleware to validate the request body using a Zod schema.
 * If validation is successful, req.body is updated with the validated data.
 *
 * @param schema The Zod schema for the request body.
 * @returns An Express middleware function.
 */
export const validateBody = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const validated = handleValidation(schema, req.body, 'body', next);
    // If handleValidation returned a value (meaning no error was passed to next),
    // update req.body with the validated and potentially transformed data.
    if (validated !== undefined) {
      req.body = validated;
      next(); // Proceed to the next middleware/route handler
    }
    // If validated is undefined, it means handleValidation already called next(error),
    // so we don't call next() again here.
  };
};

/**
 * Middleware to validate request parameters using a Zod schema.
 * If validation is successful, req.params is updated with the validated data.
 *
 * @param schema The Zod schema for the request parameters.
 * @returns An Express middleware function.
 */
export const validateParams = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    // req.params are typically strings, so the schema should handle type coercion if needed (e.g., z.string().transform(Number))
    const validated = handleValidation(schema, req.params, 'params', next);
    if (validated !== undefined) {
      req.params = validated as any; // Cast to any because req.params is typically string-indexed
      next();
    }
  };
};

/**
 * Middleware to validate request query parameters using a Zod schema.
 * If validation is successful, req.query is updated with the validated data.
 *
 * @param schema The Zod schema for the request query.
 * @returns An Express middleware function.
 */
export const validateQuery = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    // req.query are typically strings, so the schema should handle type coercion if needed.
    const validated = handleValidation(schema, req.query, 'query', next);
    if (validated !== undefined) {
      req.query = validated as any; // Cast to any because req.query is typically string-indexed
      next();
    }
  };
};

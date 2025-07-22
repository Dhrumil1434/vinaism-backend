// middlewares/validateResponse.ts
import { z, ZodSchema, ZodError } from 'zod';
import { Response, Request, NextFunction } from 'express';
// Assuming @utils-core provides ApiResponse and ApiError
import { ApiError } from '@utils-core'; // Your ApiError class (from previous discussion)
import { StatusCodes } from 'http-status-codes';
import chalk from 'chalk'; // Assuming chalk is installed for consistency in logging

// --- Zod Schemas for Response Validation ---
const ErrorDetailSchema = z.object({
  field: z.string(),
  message: z.string(),
});
const DataDetailSchema = z.object({
  expectedField: z.string(),
  description: z.string(),
});

const ApiErrorResponseSchema = z.object({
  action: z.string(),
  statusCode: z.number(),
  errorCode: z.string(),
  success: z.literal(false),
  errors: z.array(ErrorDetailSchema),
  data: z.array(DataDetailSchema),
  location: z.string().optional(),
  message: z.string(),
});

const ApiSuccessResponseSchema = z.object({
  statusCode: z.number(),
  data: z.unknown(), // Accept any data, but you can make this stricter if needed
  message: z.string(),
  success: z.literal(true),
});

// --- Middleware ---

// Extend the Express Response type to include the original json method if needed later
declare module 'express-serve-static-core' {
  interface Response {
    originalJson?: (body?: any) => Response;
  }
}

export function validateResponseStructure() {
  return function (_req: Request, res: Response, next: NextFunction) {
    const originalJson = res.json.bind(res);
    res.json = (data: any) => {
      try {
        // Determine which schema to use based on the 'success' property
        let schema: ZodSchema<any>;
        if (typeof data === 'object' && data !== null && 'success' in data) {
          schema =
            data.success === true
              ? ApiSuccessResponseSchema
              : ApiErrorResponseSchema;
        } else {
          throw new Error('Response object missing "success" property.');
        }
        schema.parse(data);
        return originalJson(data);
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          console.error(
            chalk.bgRed.white.bold('SERVER-SIDE ERROR:'),
            chalk.red('Response structure does NOT match expected schema.')
          );
          console.error(
            chalk.red('Validation Errors:'),
            JSON.stringify(error.issues, null, 2)
          );
          console.error(
            chalk.red('Original Response Data (before validation):'),
            JSON.stringify(data, null, 2)
          );
        } else {
          console.error(
            chalk.bgRed.white.bold('SERVER-SIDE ERROR:'),
            chalk.red('Unexpected error during response structure validation.')
          );
          console.error(error);
        }
        // Return a generic error response
        const apiError = new ApiError(
          'RESPONSE_STRUCTURE_INVALID',
          StatusCodes.INTERNAL_SERVER_ERROR,
          'INTERNAL_SERVER_ERROR',
          'An internal server error occurred: Response structure invalid.'
        );
        const errorResponseForClient = {
          action: apiError.action,
          statusCode: apiError.statusCode,
          errorCode: apiError.errorCode,
          success: false,
          errors: apiError.errors || [],
          data: apiError.data || [],
          location: apiError.location,
          message: apiError.message,
        };
        return originalJson(errorResponseForClient);
      }
    };
    next();
  };
}

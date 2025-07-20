import { Request, Response } from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export const handleValidationError = (error: z.ZodError, res: Response, context: string) => {
  return res.status(400).json({
    error: 'Validation failed',
    message: `Invalid ${context} data`,
    details: fromZodError(error).toString(),
  });
};

export const validateRequestBody = <T>(schema: z.ZodSchema<T>, req: Request, res: Response): T | null => {
  try {
    return schema.parse(req.body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      handleValidationError(error, res, 'request');
      return null;
    }
    throw error;
  }
};
import { Request, Response } from 'express';
import { DepartmentService } from './service';
import { insertDepartmentSchema } from '@shared/schema';
import { asyncHandler } from '../../shared/utils/async-handler';
import { validateRequestBody, handleValidationError } from '../../shared/utils/validation';
import { z } from 'zod';

export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  getAllDepartments = asyncHandler(async (req: Request, res: Response) => {
    const departments = await this.departmentService.getAllDepartments();
    res.json(departments);
  });

  createDepartment = asyncHandler(async (req: Request, res: Response) => {
    const departmentData = validateRequestBody(insertDepartmentSchema, req, res);
    if (!departmentData) return; // Response already sent by validateRequestBody

    try {
      const department = await this.departmentService.createDepartment(departmentData);
      res.status(201).json(department);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return handleValidationError(err, res, 'department');
      }
      throw err;
    }
  });
}
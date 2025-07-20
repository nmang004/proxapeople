import { storage } from '../../database/storage';
import { type Department, type InsertDepartment } from '@shared/schema';

export class DepartmentService {
  async getAllDepartments(): Promise<Department[]> {
    return await storage.getAllDepartments();
  }

  async createDepartment(departmentData: InsertDepartment): Promise<Department> {
    return await storage.createDepartment(departmentData);
  }
}
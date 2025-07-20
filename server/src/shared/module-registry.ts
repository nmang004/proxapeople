import express, { Router } from 'express';
import { BaseModule, ModuleConfig } from './types/module';

// Module imports
import authRoutes from '../modules/auth/auth';
import permissionRoutes from '../modules/permissions';
import userRoutes from '../modules/users';
import departmentRoutes from '../modules/departments';
import teamRoutes from '../modules/teams';
import performanceRoutes from '../modules/performance';
import goalRoutes from '../modules/goals';
import meetingRoutes from '../modules/meetings';
import surveyRoutes from '../modules/surveys';
import analyticsRoutes from '../modules/analytics';

interface ModuleRegistration {
  router: Router;
  config: ModuleConfig;
}

export class ModuleRegistry {
  private modules: Map<string, ModuleRegistration> = new Map();

  constructor() {
    this.registerModules();
  }

  private registerModules() {
    // Auth module (public routes with special rate limiting)
    this.register('auth', authRoutes, {
      prefix: '/auth',
      middleware: []
    });

    // Permission management (admin only)
    this.register('permissions', permissionRoutes, {
      prefix: '/permissions',
      middleware: []
    });

    // Protected modules (require authentication)
    this.register('users', userRoutes, {
      prefix: '/users',
      middleware: []
    });

    this.register('departments', departmentRoutes, {
      prefix: '/departments',
      middleware: []
    });

    this.register('teams', teamRoutes, {
      prefix: '/teams',
      middleware: []
    });

    this.register('performance', performanceRoutes, {
      prefix: '',
      middleware: []
    });

    this.register('goals', goalRoutes, {
      prefix: '/goals',
      middleware: []
    });

    this.register('meetings', meetingRoutes, {
      prefix: '/one-on-ones',
      middleware: []
    });

    this.register('surveys', surveyRoutes, {
      prefix: '/surveys',
      middleware: []
    });

    this.register('analytics', analyticsRoutes, {
      prefix: '/analytics',
      middleware: []
    });
  }

  private register(name: string, router: Router, config: ModuleConfig) {
    this.modules.set(name, { router, config });
  }

  public getModules(): Map<string, ModuleRegistration> {
    return this.modules;
  }

  public getModule(name: string): ModuleRegistration | undefined {
    return this.modules.get(name);
  }
}
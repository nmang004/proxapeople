import { Router } from 'express';

export interface BaseModule {
  name: string;
  router: Router;
  initialize?(): Promise<void>;
}

export interface ModuleConfig {
  prefix: string;
  middleware?: any[];
}
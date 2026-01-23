/**
 * Dependency Injection Tokens
 * 
 * Layer: Application
 * Purpose: DI tokens for Infrastructure abstractions
 * 
 * These tokens enable dependency injection of Infrastructure implementations
 * without creating hard dependencies on concrete classes.
 */

import { InjectionToken } from '@angular/core';
import { IWorkspaceRuntimeFactory } from '../interfaces/workspace-runtime-factory.interface';

/**
 * Workspace Runtime Factory Token
 * 
 * Use this token to inject the workspace runtime factory implementation
 */
export const WORKSPACE_RUNTIME_FACTORY = new InjectionToken<IWorkspaceRuntimeFactory>(
  'WORKSPACE_RUNTIME_FACTORY',
  {
    providedIn: 'root',
    factory: () => {
      throw new Error(
        'WORKSPACE_RUNTIME_FACTORY must be provided in app.config.ts'
      );
    }
  }
);

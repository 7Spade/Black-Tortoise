import { InjectionToken } from '@angular/core';
import { User } from '@account/index';
import { Observable } from 'rxjs';

/**
 * Auth Stream Interface
 * 
 * Layer: Application
 * Purpose: Provides a reactive stream of the current authentication state.
 * Rationale: Separated from Domain Repository to keep Domain rx-free.
 */
export interface AuthStream {
  readonly authState$: Observable<User | null>;
}

export const AUTH_STREAM = new InjectionToken<AuthStream>('AUTH_STREAM');

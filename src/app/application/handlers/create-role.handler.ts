/**
 * CreateRoleHandler
 * 
 * Layer: Application
 * Pattern: Use Case
 */

import { Injectable, inject } from '@angular/core';
import { CreateRoleCommand } from '../commands/create-role.command';
// import { PermissionRepository } from '@domain/repositories';

@Injectable({ providedIn: 'root' })
export class CreateRoleHandler {
  // private repo = inject(PermissionRepository);

  async execute(command: CreateRoleCommand): Promise<void> {
    // TODO: Implement Use Case logic
    // 1. Load Aggregate
    // 2. Invoke method
    // 3. Save
    // 4. Update Store (via return or event)
    console.log('Execute CreateRoleHandler', command);
  }
}

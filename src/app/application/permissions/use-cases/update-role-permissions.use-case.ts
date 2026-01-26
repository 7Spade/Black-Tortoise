/**
 * UpdateRolePermissionsUseCase
 * 
 * Layer: Application
 * Pattern: Use Case
 */

import { Injectable, inject } from '@angular/core';
import { UpdateRolePermissionsCommand } from '../commands/update-role-permissions.command';
// import { PermissionsRepository } from '@domain/modules/permissions/repositories';

@Injectable({ providedIn: 'root' })
export class UpdateRolePermissionsUseCase {
  // private repo = inject(PermissionsRepository);

  async execute(command: UpdateRolePermissionsCommand): Promise<void> {
    // TODO: Implement Use Case logic
    // 1. Load Aggregate
    // 2. Invoke method
    // 3. Save
    // 4. Update Store (via return or event)
    console.log('Execute UpdateRolePermissionsUseCase', command);
  }
}

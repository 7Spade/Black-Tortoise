/**
 * InviteMemberUseCase
 * 
 * Layer: Application
 * Pattern: Use Case
 */

import { Injectable, inject } from '@angular/core';
import { InviteMemberCommand } from '../commands/invite-member.command';
// import { MembersRepository } from '@domain/modules/members/repositories';

@Injectable({ providedIn: 'root' })
export class InviteMemberUseCase {
  // private repo = inject(MembersRepository);

  async execute(command: InviteMemberCommand): Promise<void> {
    // TODO: Implement Use Case logic
    // 1. Load Aggregate
    // 2. Invoke method
    // 3. Save
    // 4. Update Store (via return or event)
    console.log('Execute InviteMemberUseCase', command);
  }
}

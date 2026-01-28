/**
 * InviteMemberHandler
 * 
 * Layer: Application
 * Pattern: Use Case
 */

import { Injectable, inject } from '@angular/core';
import { InviteMemberCommand } from '@members/application/commands/invite-member.command';
// import { MemberRepository } from '@members/domain';

@Injectable({ providedIn: 'root' })
export class InviteMemberHandler {
  // private repo = inject(MemberRepository);

  async execute(command: InviteMemberCommand): Promise<void> {
    // TODO: Implement Use Case logic
    // 1. Load Aggregate
    // 2. Invoke method
    // 3. Save
    // 4. Update Store (via return or event)
    console.log('Execute InviteMemberHandler', command);
  }
}

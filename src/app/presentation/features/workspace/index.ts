/**
 * Workspace Feature Public API
 */

// Components
export { IdentitySwitcherComponent } from '../../layout/widgets/identity-switcher/identity-switcher.component';
export { WorkspaceCreateTriggerComponent } from '../../workspaces/create-trigger/workspace-create-trigger.component';
export { WorkspaceSwitcherComponent } from '../../workspaces/switcher/workspace-switcher.component';

// Dialogs
export {
  WorkspaceCreateDialogComponent,
  WorkspaceCreateDialogResult
} from '../../workspaces/dialogs/workspace-create-dialog.component';

// Re-export WorkspaceCreateResult from Application layer (backward compatibility)
export { WorkspaceCreateResult } from '@application/workspace/models/workspace-create-result.model';

// Facades
export { IdentityFacade, WorkspaceFacade } from '@application/workspace';


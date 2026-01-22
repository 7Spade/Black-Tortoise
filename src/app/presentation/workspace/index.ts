/**
 * Workspace Feature Public API
 */

// Components
export { IdentitySwitcherComponent } from './components/identity-switcher.component';
export { WorkspaceCreateTriggerComponent } from './components/workspace-create-trigger.component';
export { WorkspaceSwitcherComponent } from './components/workspace-switcher.component';

// Dialogs
export {
    WorkspaceCreateDialogComponent,
    WorkspaceCreateDialogResult
} from './dialogs/workspace-create-dialog.component';

// Models
export { WorkspaceCreateResult } from './models/workspace-create-result.model';

// Facades
export { IdentityFacade } from '@application/workspace/identity.facade';
export { WorkspaceFacade } from '@application/workspace/workspace.facade';


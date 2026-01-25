/**
 * Containers Public API
 * 
 * Smart container components that orchestrate features
 */

export { ModuleHostContainerComponent } from './host/module-host-container.component';
export { WorkspaceHostComponent } from './host/workspace-host.component';

/**
 * Workspace Feature Public API
 */

// Components
export { IdentitySwitcherComponent } from '../layout/widgets/identity-switcher/identity-switcher.component';
export { WorkspaceCreateTriggerComponent } from './create-trigger/workspace-create-trigger.component';
export { WorkspaceSwitcherComponent } from './switcher/workspace-switcher.component';

// Dialogs
export {
  WorkspaceCreateDialogComponent,
  WorkspaceCreateDialogResult
} from './dialogs/workspace-create-dialog.component';

// Re-export WorkspaceCreateResult from Application layer (backward compatibility)
export { WorkspaceCreateResult } from '@application/workspace/models/workspace-create-result.model';

// Facades
export { IdentityFacade, WorkspaceFacade } from '@application/workspace';

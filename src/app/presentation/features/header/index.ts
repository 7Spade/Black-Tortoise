/**
 * Header Feature Public API
 */

// Components
export { GlobalHeaderComponent } from './components/global-header.component';
export { WorkspaceHeaderControlsComponent } from './components/workspace-header-controls.component';
export { WorkspaceCreateTriggerComponent } from './components/workspace-create-trigger.component';

// Dialogs
export { 
  WorkspaceCreateDialogComponent,
  WorkspaceCreateDialogResult 
} from './dialogs/workspace-create-dialog.component';

// Models
export { WorkspaceCreateResult } from './models/workspace-create-result.model';

// Facade
export { HeaderFacade } from './facade/header.facade';

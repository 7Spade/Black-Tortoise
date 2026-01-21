import type { Observable } from 'rxjs';
import type { WorkspaceModule } from '../entities/workspace-module.entity';

/**
 * ModuleRepository defines the contract for module persistence.
 */
export interface ModuleRepository {
  getWorkspaceModules(workspaceId: string): Observable<WorkspaceModule[]>;
}

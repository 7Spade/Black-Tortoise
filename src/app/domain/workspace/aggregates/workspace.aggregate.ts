import type { WorkspaceId } from '../value-objects/workspace-id.value-object';
import type { WorkspaceOwner } from '../value-objects/workspace-owner.value-object';
import type { WorkspaceQuota } from '../value-objects/workspace-quota.value-object';
import { WorkspaceLifecycle } from '../enums/workspace-lifecycle.enum';
import { Workspace } from '../entities/workspace.entity';

/**
 * WorkspaceAggregate is the aggregate root enforcing workspace invariants.
 * It ensures consistency across workspace state and business rules.
 */
export class WorkspaceAggregate {
  private readonly workspace: Workspace;
  private lifecycle: WorkspaceLifecycle;
  private quota: WorkspaceQuota;

  private constructor(
    workspace: Workspace,
    lifecycle: WorkspaceLifecycle,
    quota: WorkspaceQuota,
  ) {
    this.workspace = workspace;
    this.lifecycle = lifecycle;
    this.quota = quota;
  }

  static create(props: {
    id: WorkspaceId;
    owner: WorkspaceOwner;
    lifecycle: WorkspaceLifecycle;
    quota: WorkspaceQuota;
    moduleIds?: ReadonlyArray<string>;
  }): WorkspaceAggregate {
    const workspace = Workspace.create({
      id: props.id,
      owner: props.owner,
      moduleIds: props.moduleIds ?? [],
    });
    return new WorkspaceAggregate(workspace, props.lifecycle, props.quota);
  }

  getId(): WorkspaceId {
    return this.workspace.id;
  }

  getOwner(): WorkspaceOwner {
    return this.workspace.owner;
  }

  getLifecycle(): WorkspaceLifecycle {
    return this.lifecycle;
  }

  getQuota(): WorkspaceQuota {
    return this.quota;
  }

  getModuleIds(): ReadonlyArray<string> {
    return this.workspace.moduleIds;
  }

  /**
   * Check if workspace is active.
   */
  isActive(): boolean {
    return this.lifecycle === WorkspaceLifecycle.Active;
  }

  /**
   * Archive the workspace (domain logic).
   */
  archive(): void {
    if (this.lifecycle === WorkspaceLifecycle.Deleted) {
      throw new Error('Cannot archive a deleted workspace');
    }
    this.lifecycle = WorkspaceLifecycle.Archived;
  }

  /**
   * Activate the workspace (domain logic).
   */
  activate(): void {
    if (this.lifecycle === WorkspaceLifecycle.Deleted) {
      throw new Error('Cannot activate a deleted workspace');
    }
    this.lifecycle = WorkspaceLifecycle.Active;
  }

  /**
   * Check if a module can be added based on quota.
   */
  canAddModule(): boolean {
    return this.quota.canAddProjects(this.workspace.moduleIds.length, 1);
  }
}

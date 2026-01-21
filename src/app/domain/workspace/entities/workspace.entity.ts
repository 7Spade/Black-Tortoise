import type { WorkspaceId } from '../value-objects/workspace-id.value-object';
import type { WorkspaceOwner } from '../value-objects/workspace-owner.value-object';

/**
 * Workspace represents a logical container owned by a user or organization only.
 * Minimal domain entity without UI-specific fields.
 */
export class Workspace {
  readonly id: WorkspaceId;
  readonly owner: WorkspaceOwner;
  readonly moduleIds: ReadonlyArray<string>;

  private constructor(props: {
    id: WorkspaceId;
    owner: WorkspaceOwner;
    moduleIds: ReadonlyArray<string>;
  }) {
    this.id = props.id;
    this.owner = props.owner;
    this.moduleIds = props.moduleIds;
  }

  static create(props: {
    id: WorkspaceId;
    owner: WorkspaceOwner;
    moduleIds?: ReadonlyArray<string>;
  }): Workspace {
    return new Workspace({
      id: props.id,
      owner: props.owner,
      moduleIds: props.moduleIds ?? [],
    });
  }
}

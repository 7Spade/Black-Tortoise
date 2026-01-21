import type { IdentityId } from '../value-objects/identity-id.value-object';

/**
 * Organization represents an organization identity with member references.
 * Minimal domain entity without UI-specific fields.
 */
export class Organization {
  readonly id: IdentityId;
  readonly type: 'organization' = 'organization';
  readonly memberIds: ReadonlyArray<string>;
  readonly teamIds: ReadonlyArray<string>;
  readonly partnerIds: ReadonlyArray<string>;
  readonly workspaceIds: ReadonlyArray<string>;

  private constructor(props: {
    id: IdentityId;
    memberIds: ReadonlyArray<string>;
    teamIds: ReadonlyArray<string>;
    partnerIds: ReadonlyArray<string>;
    workspaceIds: ReadonlyArray<string>;
  }) {
    this.id = props.id;
    this.memberIds = props.memberIds;
    this.teamIds = props.teamIds;
    this.partnerIds = props.partnerIds;
    this.workspaceIds = props.workspaceIds;
  }

  static create(props: {
    id: IdentityId;
    memberIds?: ReadonlyArray<string>;
    teamIds?: ReadonlyArray<string>;
    partnerIds?: ReadonlyArray<string>;
    workspaceIds?: ReadonlyArray<string>;
  }): Organization {
    return new Organization({
      id: props.id,
      memberIds: props.memberIds ?? [],
      teamIds: props.teamIds ?? [],
      partnerIds: props.partnerIds ?? [],
      workspaceIds: props.workspaceIds ?? [],
    });
  }
}

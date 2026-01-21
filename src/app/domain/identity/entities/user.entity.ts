import type { IdentityId } from '../value-objects/identity-id.value-object';

/**
 * User represents a personal identity that can own workspaces.
 * Minimal domain entity without UI-specific fields.
 */
export class User {
  readonly id: IdentityId;
  readonly type: 'user' = 'user';
  readonly organizationIds: ReadonlyArray<string>;
  readonly teamIds: ReadonlyArray<string>;
  readonly partnerIds: ReadonlyArray<string>;
  readonly workspaceIds: ReadonlyArray<string>;

  private constructor(props: {
    id: IdentityId;
    organizationIds: ReadonlyArray<string>;
    teamIds: ReadonlyArray<string>;
    partnerIds: ReadonlyArray<string>;
    workspaceIds: ReadonlyArray<string>;
  }) {
    this.id = props.id;
    this.organizationIds = props.organizationIds;
    this.teamIds = props.teamIds;
    this.partnerIds = props.partnerIds;
    this.workspaceIds = props.workspaceIds;
  }

  static create(props: {
    id: IdentityId;
    organizationIds?: ReadonlyArray<string>;
    teamIds?: ReadonlyArray<string>;
    partnerIds?: ReadonlyArray<string>;
    workspaceIds?: ReadonlyArray<string>;
  }): User {
    return new User({
      id: props.id,
      organizationIds: props.organizationIds ?? [],
      teamIds: props.teamIds ?? [],
      partnerIds: props.partnerIds ?? [],
      workspaceIds: props.workspaceIds ?? [],
    });
  }
}

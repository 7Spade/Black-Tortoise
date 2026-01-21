import type { MembershipId } from '../value-objects/membership-id.value-object';

/**
 * Team represents an internal organizational unit with member references.
 * Minimal domain entity enforcing team invariants.
 */
export class Team {
  readonly id: MembershipId;
  readonly type: 'team' = 'team';
  readonly organizationId: string;
  readonly memberIds: ReadonlyArray<string>;

  private constructor(props: {
    id: MembershipId;
    organizationId: string;
    memberIds: ReadonlyArray<string>;
  }) {
    if (!props.organizationId || props.organizationId.trim().length === 0) {
      throw new Error('Team must belong to an organization');
    }
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.memberIds = props.memberIds;
  }

  static create(props: {
    id: MembershipId;
    organizationId: string;
    memberIds?: ReadonlyArray<string>;
  }): Team {
    return new Team({
      id: props.id,
      organizationId: props.organizationId,
      memberIds: props.memberIds ?? [],
    });
  }
}

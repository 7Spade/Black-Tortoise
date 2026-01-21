import type { MembershipId } from '../value-objects/membership-id.value-object';

/**
 * Partner represents an external organizational unit with member references.
 * Minimal domain entity enforcing partner invariants.
 */
export class Partner {
  readonly id: MembershipId;
  readonly type: 'partner' = 'partner';
  readonly organizationId: string;
  readonly memberIds: ReadonlyArray<string>;

  private constructor(props: {
    id: MembershipId;
    organizationId: string;
    memberIds: ReadonlyArray<string>;
  }) {
    if (!props.organizationId || props.organizationId.trim().length === 0) {
      throw new Error('Partner must belong to an organization');
    }
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.memberIds = props.memberIds;
  }

  static create(props: {
    id: MembershipId;
    organizationId: string;
    memberIds?: ReadonlyArray<string>;
  }): Partner {
    return new Partner({
      id: props.id,
      organizationId: props.organizationId,
      memberIds: props.memberIds ?? [],
    });
  }
}

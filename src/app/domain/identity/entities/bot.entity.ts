import type { IdentityId } from '../value-objects/identity-id.value-object';

/**
 * Bot represents a service identity without membership lists.
 * Minimal domain entity without UI-specific fields.
 */
export class Bot {
  readonly id: IdentityId;
  readonly type: 'bot' = 'bot';

  private constructor(props: { id: IdentityId }) {
    this.id = props.id;
  }

  static create(props: { id: IdentityId }): Bot {
    return new Bot(props);
  }
}

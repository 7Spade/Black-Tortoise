/**
 * WorkspaceCreatedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a new workspace is created.
 * Contains all information needed to track workspace creation in the event store.
 */

export interface WorkspaceCreatedEvent {
  readonly eventId: string;
  readonly eventType: 'WorkspaceCreated';
  readonly aggregateId: string; // workspaceId
  readonly workspaceId: string;
  readonly timestamp: Date;
  readonly causalityId: string;
  
  // Payload
  readonly payload: {
    readonly name: string;
    readonly ownerId: string;
    readonly ownerType: 'user' | 'organization';
    readonly organizationId: string;
  };
  
  // Metadata for event sourcing
  readonly metadata: {
    readonly version: number;
    readonly userId?: string;
    readonly correlationId?: string;
  };
}

/**
 * Create a WorkspaceCreatedEvent
 */
export function createWorkspaceCreatedEvent(
  workspaceId: string,
  name: string,
  ownerId: string,
  ownerType: 'user' | 'organization',
  organizationId: string,
  userId?: string,
  causalityId?: string,
  correlationId?: string
): WorkspaceCreatedEvent {
  return {
    eventId: crypto.randomUUID(),
    eventType: 'WorkspaceCreated',
    aggregateId: workspaceId,
    workspaceId,
    timestamp: new Date(),
    causalityId: causalityId ?? crypto.randomUUID(),
    payload: {
      name,
      ownerId,
      ownerType,
      organizationId,
    },
    metadata: {
      version: 1,
      ...(userId !== undefined && { userId }),
      ...(correlationId !== undefined && { correlationId }),
    },
  };
}

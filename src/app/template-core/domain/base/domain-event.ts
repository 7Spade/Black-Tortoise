export interface TemplateEventMetadata {
  correlationId: string;
  causationId?: string | undefined;
  userId?: string | undefined;
  timestamp: number;
  version?: number;
}

export abstract class TemplateDomainEvent {
  public readonly eventId: string;
  public readonly occurredOn: Date;
  public readonly eventName: string;
  public readonly aggregateId: string;
  public readonly metadata: TemplateEventMetadata;

  constructor(
    aggregateId: string,
    eventName: string,
    metadata?: Partial<TemplateEventMetadata>
  ) {
    this.eventId = crypto.randomUUID();
    this.occurredOn = new Date();
    this.aggregateId = aggregateId;
    this.eventName = eventName;
    this.metadata = {
      correlationId: metadata?.correlationId || crypto.randomUUID(),
      causationId: metadata?.causationId,
      userId: metadata?.userId,
      timestamp: Date.now(),
      version: metadata?.version ?? 1,
    };
  }
}

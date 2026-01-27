export interface TemplateEventDto {
  eventId: string;
  eventName: string;
  aggregateId: string;
  occurredOn: string;
  description: string;
  metadata: {
    correlationId: string;
    causationId?: string | undefined;
    userId?: string | undefined;
    version?: number | undefined;
  };
}

/**
 * DailyEntry Aggregate Root
 * 
 * Layer: Domain
 * DDD Pattern: Aggregate Root
 * Purpose: Enforce consistency for daily work log entries
 * 
 * Factory Pattern:
 * - create(): Creates new entity and emits DailyEntryCreatedEvent
 * - reconstruct(): Rebuilds from persistence without events
 */

import { createDailyEntryCreatedEvent } from '@domain/events';

export interface DailyEntryProps {
  readonly id: string;
  readonly userId: string;
  readonly workspaceId: string;
  readonly date: string; // YYYY-MM-DD
  readonly tasksWorkedOn: ReadonlyArray<string>; // Task IDs
  readonly notes: string;
  readonly headcount: number;
  readonly submittedAt: number;
}

export class DailyEntryEntity {
  readonly id: string;
  readonly userId: string;
  readonly workspaceId: string;
  readonly date: string;
  readonly tasksWorkedOn: ReadonlyArray<string>;
  readonly notes: string;
  readonly headcount: number;
  readonly submittedAt: number;

  private constructor(props: DailyEntryProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.workspaceId = props.workspaceId;
    this.date = props.date;
    this.tasksWorkedOn = props.tasksWorkedOn;
    this.notes = props.notes;
    this.headcount = props.headcount;
    this.submittedAt = props.submittedAt;
  }

  /**
   * Factory method for creating new daily entry (emits event)
   */
  public static create(
    id: string,
    userId: string,
    workspaceId: string,
    date: string,
    tasksWorkedOn: ReadonlyArray<string>,
    headcount: number,
    notes: string = '',
    correlationId?: string,
    causationId?: string | null
  ): { entity: DailyEntryEntity; event: ReturnType<typeof createDailyEntryCreatedEvent> } {
    const submittedAt = Date.now();
    
    const entity = new DailyEntryEntity({
      id,
      userId,
      workspaceId,
      date,
      tasksWorkedOn,
      notes,
      headcount,
      submittedAt,
    });

    const event = createDailyEntryCreatedEvent(
      id,
      workspaceId,
      date,
      userId,
      [...tasksWorkedOn],
      headcount,
      notes,
      correlationId,
      causationId
    );

    return { entity, event };
  }

  /**
   * Reconstruct from persistence (no events)
   */
  public static reconstruct(props: DailyEntryProps): DailyEntryEntity {
    return new DailyEntryEntity(props);
  }
}

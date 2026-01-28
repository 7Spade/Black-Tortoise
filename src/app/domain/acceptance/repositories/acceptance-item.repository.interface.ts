
import { AcceptanceItemAggregate } from '@domain/acceptance/aggregates/acceptance-item.aggregate';
import { AcceptanceItemId } from '@domain/acceptance/value-objects/acceptance-item-id.vo';
import { InjectionToken } from '@angular/core';

export interface AcceptanceItemRepository {
    findById(id: AcceptanceItemId): Promise<AcceptanceItemAggregate | null>;
    save(acceptanceItem: AcceptanceItemAggregate): Promise<void>;
    findByTaskId(taskId: string): Promise<AcceptanceItemAggregate[]>;
}

export const ACCEPTANCE_ITEM_REPOSITORY = new InjectionToken<AcceptanceItemRepository>('ACCEPTANCE_ITEM_REPOSITORY');

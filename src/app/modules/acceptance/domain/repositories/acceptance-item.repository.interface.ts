
import { AcceptanceItemAggregate } from '@acceptance/domain/aggregates/acceptance-item.aggregate';
import { AcceptanceItemId } from '@acceptance/domain/value-objects/acceptance-item-id.vo';
import { InjectionToken } from '@angular/core';

export interface AcceptanceItemRepository {
    findById(id: AcceptanceItemId): Promise<AcceptanceItemAggregate | null>;
    save(acceptanceItem: AcceptanceItemAggregate): Promise<void>;
    findByTaskId(taskId: string): Promise<AcceptanceItemAggregate[]>;
}

export const ACCEPTANCE_ITEM_REPOSITORY = new InjectionToken<AcceptanceItemRepository>('ACCEPTANCE_ITEM_REPOSITORY');

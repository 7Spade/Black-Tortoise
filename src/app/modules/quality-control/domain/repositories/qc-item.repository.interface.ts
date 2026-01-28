
import { QcItemAggregate } from '@quality-control/domain/aggregates/qc-item.aggregate';
import { QcItemId } from '@quality-control/domain/value-objects/qc-item-id.vo';
import { InjectionToken } from '@angular/core';

export interface QcItemRepository {
    findById(id: QcItemId): Promise<QcItemAggregate | null>;
    save(qcItem: QcItemAggregate): Promise<void>;
    findByTaskId(taskId: string): Promise<QcItemAggregate[]>;
    // Other queries
}

export const QC_ITEM_REPOSITORY = new InjectionToken<QcItemRepository>('QC_ITEM_REPOSITORY');

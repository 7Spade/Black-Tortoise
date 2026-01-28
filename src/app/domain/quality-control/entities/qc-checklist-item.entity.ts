import { Entity } from '@domain/base/entity';

/**
 * QC Checklist Item Entity
 * 
 * Individual check item within a QC process.
 */
export class QcChecklistItem extends Entity<any> {
    private constructor(
        public readonly id: string, // Simple string ID
        public content: string,
        public isPassed: boolean
    ) {
        super({ value: id });
    }

    public static create(id: string, content: string): QcChecklistItem {
        return new QcChecklistItem(id, content, false);
    }

    public markPassed(): void {
        this.isPassed = true;
    }

    public markFailed(): void {
        this.isPassed = false;
    }
}

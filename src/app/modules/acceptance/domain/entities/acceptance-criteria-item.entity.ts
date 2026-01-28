import { Entity } from '@domain/base/entity';

/**
 * Acceptance Criteria Item Entity
 * 
 * Individual acceptance criteria check.
 */
export class AcceptanceCriteriaItem extends Entity<any> {
    private constructor(
        public readonly id: string,
        public description: string,
        public isMet: boolean
    ) {
        super({ value: id });
    }

    public static create(id: string, description: string): AcceptanceCriteriaItem {
        return new AcceptanceCriteriaItem(id, description, false);
    }
}

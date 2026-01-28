/**
 * TaskStatus Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export enum TaskStatusEnum {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    BLOCKED = 'BLOCKED',
    IN_REVIEW = 'IN_REVIEW'
}

export class TaskStatus {
    private readonly value: TaskStatusEnum;

    private constructor(value: TaskStatusEnum) {
        this.value = value;
    }

    public static create(value: string | TaskStatusEnum): TaskStatus {
        const validValues = Object.values(TaskStatusEnum) as string[];
        if (validValues.includes(value)) {
            return new TaskStatus(value as TaskStatusEnum);
        }
        throw new Error(`Invalid TaskStatus: ${value}`);
    }

    public getValue(): TaskStatusEnum {
        return this.value;
    }

    public isCompleted(): boolean {
        return this.value === TaskStatusEnum.COMPLETED;
    }

    public equals(other: TaskStatus): boolean {
        return this.value === other.value;
    }
}

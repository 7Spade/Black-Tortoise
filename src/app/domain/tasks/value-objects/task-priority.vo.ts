/**
 * TaskPriority Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export enum TaskPriorityEnum {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export class TaskPriority {
    private readonly value: TaskPriorityEnum;

    private constructor(value: TaskPriorityEnum) {
        this.value = value;
    }

    public static create(value: string | TaskPriorityEnum): TaskPriority {
        const validValues = Object.values(TaskPriorityEnum) as string[];
        if (validValues.includes(value)) {
            return new TaskPriority(value as TaskPriorityEnum);
        }
        throw new Error(`Invalid TaskPriority: ${value}`);
    }

    public getValue(): TaskPriorityEnum {
        return this.value;
    }

    public equals(other: TaskPriority): boolean {
        return this.value === other.value;
    }
}

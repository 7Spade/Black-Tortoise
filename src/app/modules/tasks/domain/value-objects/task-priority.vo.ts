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
    public readonly value: TaskPriorityEnum;
    private static readonly cache = new Map<string, TaskPriority>();

    private constructor(value: TaskPriorityEnum) {
        this.value = value;
    }

    public static create(value: string | TaskPriorityEnum): TaskPriority {
        const strValue = value as string;
        if (TaskPriority.cache.has(strValue)) {
            return TaskPriority.cache.get(strValue)!;
        }

        const validValues = Object.values(TaskPriorityEnum) as string[];
        if (validValues.includes(strValue)) {
            const instance = new TaskPriority(strValue as TaskPriorityEnum);
            TaskPriority.cache.set(strValue, instance);
            return instance;
        }
        throw new Error(`Invalid TaskPriority: ${value}`);
    }

    // Static Instances
    public static readonly LOW = TaskPriority.create(TaskPriorityEnum.LOW);
    public static readonly MEDIUM = TaskPriority.create(TaskPriorityEnum.MEDIUM);
    public static readonly HIGH = TaskPriority.create(TaskPriorityEnum.HIGH);
    public static readonly CRITICAL = TaskPriority.create(TaskPriorityEnum.CRITICAL);

    // Static Factory Methods
    public static low(): TaskPriority { return TaskPriority.LOW; }
    public static medium(): TaskPriority { return TaskPriority.MEDIUM; }
    public static high(): TaskPriority { return TaskPriority.HIGH; }
    public static critical(): TaskPriority { return TaskPriority.CRITICAL; }

    public getValue(): TaskPriorityEnum {
        return this.value;
    }

    public equals(other: TaskPriority): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return this.value;
    }
}

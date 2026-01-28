export enum TaskStatusEnum {
    DRAFT = 'DRAFT',
    READY = 'READY',
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    IN_REVIEW = 'IN_REVIEW',
    IN_QC = 'IN_QC',
    QC_FAILED = 'QC_FAILED',
    IN_ACCEPTANCE = 'IN_ACCEPTANCE',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED',
    BLOCKED = 'BLOCKED'
}

export class TaskStatus {
    public readonly value: TaskStatusEnum;
    private static readonly cache = new Map<string, TaskStatus>();

    private constructor(value: TaskStatusEnum) {
        this.value = value;
    }

    public static create(value: string | TaskStatusEnum): TaskStatus {
        const strValue = value as string;
        if (TaskStatus.cache.has(strValue)) {
            return TaskStatus.cache.get(strValue)!;
        }

        const validValues = Object.values(TaskStatusEnum) as string[];
        if (validValues.includes(strValue)) {
            const instance = new TaskStatus(strValue as TaskStatusEnum);
            TaskStatus.cache.set(strValue, instance);
            return instance;
        }
        throw new Error(`Invalid TaskStatus: ${value}`);
    }

    // Static Instances
    public static readonly DRAFT = TaskStatus.create(TaskStatusEnum.DRAFT);
    public static readonly READY = TaskStatus.create(TaskStatusEnum.READY);
    public static readonly TODO = TaskStatus.create(TaskStatusEnum.TODO);
    public static readonly IN_PROGRESS = TaskStatus.create(TaskStatusEnum.IN_PROGRESS);
    public static readonly IN_REVIEW = TaskStatus.create(TaskStatusEnum.IN_REVIEW);
    public static readonly IN_QC = TaskStatus.create(TaskStatusEnum.IN_QC);
    public static readonly QC_FAILED = TaskStatus.create(TaskStatusEnum.QC_FAILED);
    public static readonly IN_ACCEPTANCE = TaskStatus.create(TaskStatusEnum.IN_ACCEPTANCE);
    public static readonly ACCEPTED = TaskStatus.create(TaskStatusEnum.ACCEPTED);
    public static readonly REJECTED = TaskStatus.create(TaskStatusEnum.REJECTED);
    public static readonly COMPLETED = TaskStatus.create(TaskStatusEnum.COMPLETED);
    public static readonly BLOCKED = TaskStatus.create(TaskStatusEnum.BLOCKED);

    // Static Factory Methods
    public static draft(): TaskStatus { return TaskStatus.DRAFT; }
    public static ready(): TaskStatus { return TaskStatus.READY; }
    public static todo(): TaskStatus { return TaskStatus.TODO; }
    public static inProgress(): TaskStatus { return TaskStatus.IN_PROGRESS; }
    public static inReview(): TaskStatus { return TaskStatus.IN_REVIEW; }
    public static inQc(): TaskStatus { return TaskStatus.IN_QC; }
    public static qcFailed(): TaskStatus { return TaskStatus.QC_FAILED; }
    public static inAcceptance(): TaskStatus { return TaskStatus.IN_ACCEPTANCE; }
    public static accepted(): TaskStatus { return TaskStatus.ACCEPTED; }
    public static rejected(): TaskStatus { return TaskStatus.REJECTED; }
    public static completed(): TaskStatus { return TaskStatus.COMPLETED; }
    public static blocked(): TaskStatus { return TaskStatus.BLOCKED; }

    public getValue(): TaskStatusEnum {
        return this.value;
    }

    public isCompleted(): boolean {
        return this.value === TaskStatusEnum.COMPLETED;
    }

    public equals(other: TaskStatus): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return this.value;
    }
}

/**
 * WidgetType Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export enum WidgetTypeEnum {
    METRICS_CARDS = 'METRICS_CARDS',
    ACTIVITY_TIMELINE = 'ACTIVITY_TIMELINE',
    ASSIGNEE_VIEW = 'ASSIGNEE_VIEW',
    BURNDOWN_CHART = 'BURNDOWN_CHART',
    BURNUP_CHART = 'BURNUP_CHART',
    GANTT_SUMMARY = 'GANTT_SUMMARY',
    ISSUE_TRENDS = 'ISSUE_TRENDS',
    ISSUE_DISTRIBUTION = 'ISSUE_DISTRIBUTION',
    TEAM_WORKLOAD = 'TEAM_WORKLOAD',
    MEMBER_RADAR = 'MEMBER_RADAR'
}

export class WidgetType {
    private readonly value: WidgetTypeEnum;

    private constructor(value: WidgetTypeEnum) {
        this.value = value;
    }

    public static create(value: string | WidgetTypeEnum): WidgetType {
        // Check if the value is a valid enum value
        const validValues = Object.values(WidgetTypeEnum) as string[];
        if (validValues.includes(value)) {
            return new WidgetType(value as WidgetTypeEnum);
        }
        throw new Error(`Invalid WidgetType: ${value}`);
    }

    public getValue(): WidgetTypeEnum {
        return this.value;
    }

    public equals(other: WidgetType): boolean {
        return this.value === other.value;
    }
}

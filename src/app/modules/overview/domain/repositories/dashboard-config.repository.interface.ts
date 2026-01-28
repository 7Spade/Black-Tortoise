
import { DashboardConfigAggregate } from '@overview/domain/aggregates/dashboard-config.aggregate';
import { DashboardConfigId } from '@overview/domain/value-objects/dashboard-config-id.vo';
import { InjectionToken } from '@angular/core';

export interface DashboardConfigRepository {
    findByUserAndWorkspace(userId: string, workspaceId: string): Promise<DashboardConfigAggregate | null>;
    save(config: DashboardConfigAggregate): Promise<void>;
    delete(id: DashboardConfigId): Promise<void>;
}

export const DASHBOARD_CONFIG_REPOSITORY = new InjectionToken<DashboardConfigRepository>('DASHBOARD_CONFIG_REPOSITORY');

import { Provider } from '@angular/core';
import {
  ACCEPTANCE_REPOSITORY,
  AUDIT_LOG_REPOSITORY,
  DAILY_REPOSITORY,
  DOCUMENT_REPOSITORY,
  ISSUE_REPOSITORY,
  MEMBER_REPOSITORY,
  OVERVIEW_REPOSITORY,
  PERMISSION_REPOSITORY,
  QUALITY_CONTROL_REPOSITORY,
  SETTINGS_REPOSITORY,
  TASK_REPOSITORY,
} from '@application/interfaces';
import { ORGANIZATION_REPOSITORY, OrganizationRepositoryImpl } from '@account/index';
import {
  AcceptanceRepositoryImpl,
  AuditLogRepositoryImpl,
  DailyRepositoryImpl,
  DocumentRepositoryImpl,
  IssueRepositoryImpl,
  MemberRepositoryImpl,
  OverviewRepositoryImpl,
  PermissionRepositoryImpl,
  QualityControlRepositoryImpl,
  TaskRepositoryImpl,
} from '@infrastructure/repositories';
import { SettingsFirestoreRepository } from '@workspace/infrastructure';

export function provideModulesInfrastructure(): Provider[] {
  return [
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: OrganizationRepositoryImpl,
    },
    {
      provide: TASK_REPOSITORY,
      useClass: TaskRepositoryImpl,
    },
    {
      provide: ISSUE_REPOSITORY,
      useClass: IssueRepositoryImpl,
    },
    {
      provide: ACCEPTANCE_REPOSITORY,
      useClass: AcceptanceRepositoryImpl,
    },
    {
      provide: AUDIT_LOG_REPOSITORY,
      useClass: AuditLogRepositoryImpl,
    },
    {
      provide: DAILY_REPOSITORY,
      useClass: DailyRepositoryImpl,
    },
    {
      provide: DOCUMENT_REPOSITORY,
      useClass: DocumentRepositoryImpl,
    },
    {
      provide: MEMBER_REPOSITORY,
      useClass: MemberRepositoryImpl,
    },
    {
      provide: OVERVIEW_REPOSITORY,
      useClass: OverviewRepositoryImpl,
    },
    {
      provide: PERMISSION_REPOSITORY,
      useClass: PermissionRepositoryImpl,
    },
    {
      provide: QUALITY_CONTROL_REPOSITORY,
      useClass: QualityControlRepositoryImpl,
    },
    {
      provide: SETTINGS_REPOSITORY,
      useClass: SettingsFirestoreRepository,
    },
  ];
}

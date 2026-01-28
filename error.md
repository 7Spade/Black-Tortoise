PS D:\GitHub\7s\Black-Tortoise> pnpm start

> stackblitz-starters-vxcrzm@0.0.0 start D:\GitHub\7s\Black-Tortoise
> ng serve

Application bundle generation failed. [4.111 seconds]

✘ [ERROR] TS2305: Module '"@application/handlers"' has no exported member 'provideEventHandlers'. [plugin angular-compiler]

    src/app/app.config.ts:7:9:
      7 │ import { provideEventHandlers } from '@application/handlers';
        ╵          ~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@domain/events/organization-created.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/application/handlers/create-organization.handler.ts:12:47:
      12 │ ...onCreatedEvent } from '@domain/events/organization-created.event';
         ╵                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2724: '"@events"' has no exported member named 'createWorkspaceCreatedEvent'. Did you mean 'createIssueCreatedEvent'? [plugin angular-compiler]

    src/app/application/handlers/create-workspace.handler.ts:12:9:
      12 │ import { createWorkspaceCreatedEvent } from '@events';
         ╵          ~~~~~~~~~~~~~~~~~~~~~~~~~~~

  'createIssueCreatedEvent' is declared here.

    src/app/events/issues/issues.events.ts:37:16:
      37 │ export function createIssueCreatedEvent(payload: { issueId: string...
         ╵                 ~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@quality-control/application/handlers/submit-task-for-qc.handler' or its corresponding type declarations. [plugin angular-compiler]

    src/app/application/handlers/index.ts:24:14:
      24 │ ...rt * from '@quality-control/application/handlers/submit-task-fo...
         ╵              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@events"' has no exported member 'createWorkspaceSwitchedEvent'. [plugin angular-compiler]

    src/app/application/handlers/switch-workspace.handler.ts:9:9:
      9 │ import { createWorkspaceSwitchedEvent } from '@events';
        ╵          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'reset' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/application/stores/workspace.store.ts:231:22:
      231 │         settingsStore.reset();
          ╵                       ~~~~~


✘ [ERROR] TS2304: Cannot find name 'AuditLogged'. [plugin angular-compiler]

    src/app/events/audit/audit.events.ts:37:151:
      37 │ ...correlationId: string, causationId?: string | null): AuditLogged {
         ╵                                                         ~~~~~~~~~~~


✘ [ERROR] TS2304: Cannot find name 'AuditLogged'. [plugin angular-compiler]

    src/app/events/audit/audit.events.ts:38:15:
      38 │     return new AuditLogged(payload, correlationId, causationId ?? ...
         ╵                ~~~~~~~~~~~


✘ [ERROR] TS2345: Argument of type '{ eventId: string; title: string; startTime: number; endTime: number; }' is not assignable to parameter of type '{ eventId: string; title: string; start: Date; end: Date; ownerId: string; }'.
  Type '{ eventId: string; title: string; startTime: number; endTime: number; }' is missing the following properties from type '{ eventId: string; title: string; start: Date; end: Date; ownerId: string; }': start, end, ownerId [plugin angular-compiler]

    src/app/events/calendar/calendar.events.ts:22:36:
      22 │ ...rn new CalendarEventCreated(payload, correlationId, causationId...
         ╵                                ~~~~~~~


✘ [ERROR] TS2345: Argument of type '{ entryId: string; userId: string; content: string; }' is not assignable to parameter of type '{ entryId: string; taskId: string; content: string; date: string; }'.
  Type '{ entryId: string; userId: string; content: string; }' is missing the following properties from type '{ entryId: string; taskId: string; content: string; date: string; }': taskId, date [plugin angular-compiler]

    src/app/events/daily/daily.events.ts:22:33:
      22 │ ...eturn new DailyEntryCreated(payload, correlationId, causationId...
         ╵                                ~~~~~~~


✘ [ERROR] TS2304: Cannot find name 'MemberAdded'. [plugin angular-compiler]

    src/app/events/members/members.events.ts:21:156:
      21 │ ...correlationId: string, causationId?: string | null): MemberAdded {
         ╵                                                         ~~~~~~~~~~~


✘ [ERROR] TS2304: Cannot find name 'MemberAdded'. [plugin angular-compiler]

    src/app/events/members/members.events.ts:22:15:
      22 │     return new MemberAdded(payload, correlationId, causationId ?? ...
         ╵                ~~~~~~~~~~~


✘ [ERROR] TS2308: Module '@audit/infrastructure/repositories/audit-log.repository.impl' has already exported a member named 'AuditLogRepositoryImpl'. Consider explicitly re-exporting to resolve the ambiguity. [plugin angular-compiler]

    src/app/infrastructure/repositories/index.ts:8:0:
      8 │ export * from '@audit/infrastructure/repositories/audit-log.reposit...
        ╵ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@acceptance/domain"' has no exported member 'AcceptanceCheckEntity'. [plugin angular-compiler]

    src/app/modules/acceptance/application/handlers/acceptance.event-handlers.ts:9:9:
      9 │ import { AcceptanceCheckEntity, AcceptanceStatus } from '@acceptanc...
        ╵          ~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2724: '"@events"' has no exported member named 'AcceptanceApprovedEvent'. Did you mean 'AcceptanceApproved'? [plugin angular-compiler]

    src/app/modules/acceptance/application/handlers/acceptance.event-handlers.ts:10:9:
      10 │ import { AcceptanceApprovedEvent, AcceptanceRejectedEvent, QCPasse...
         ╵          ~~~~~~~~~~~~~~~~~~~~~~~

  'AcceptanceApproved' is declared here.

    src/app/events/acceptance/acceptance.events.ts:21:13:
      21 │ export class AcceptanceApproved implements DomainEvent<{ taskId: s...
         ╵              ~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2724: '"@events"' has no exported member named 'AcceptanceRejectedEvent'. Did you mean 'AcceptanceRejected'? [plugin angular-compiler]

    src/app/modules/acceptance/application/handlers/acceptance.event-handlers.ts:10:34:
      10 │ ...tanceApprovedEvent, AcceptanceRejectedEvent, QCPassedEvent } fr...
         ╵                        ~~~~~~~~~~~~~~~~~~~~~~~

  'AcceptanceRejected' is declared here.

    src/app/events/acceptance/acceptance.events.ts:37:13:
      37 │ export class AcceptanceRejected implements DomainEvent<{ taskId: s...
         ╵              ~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@events"' has no exported member 'QCPassedEvent'. [plugin angular-compiler]

    src/app/modules/acceptance/application/handlers/acceptance.event-handlers.ts:10:59:
      10 │ ...vedEvent, AcceptanceRejectedEvent, QCPassedEvent } from '@events';
         ╵                                       ~~~~~~~~~~~~~


✘ [ERROR] TS2551: Property 'PENDING' does not exist on type 'typeof AcceptanceStatus'. Did you mean 'pending'? [plugin angular-compiler]

    src/app/modules/acceptance/application/handlers/acceptance.event-handlers.ts:26:33:
      26 │         status: AcceptanceStatus.PENDING,
         ╵                                  ~~~~~~~

  'pending' is declared here.

    src/app/modules/acceptance/domain/value-objects/acceptance-status.vo.ts:17:18:
      17 │     public static pending(): AcceptanceStatus {
         ╵                   ~~~~~~~


✘ [ERROR] TS2339: Property 'APPROVED' does not exist on type 'typeof AcceptanceStatus'. [plugin angular-compiler]

    src/app/modules/acceptance/application/handlers/acceptance.event-handlers.ts:45:39:
      45 │               status: AcceptanceStatus.APPROVED,
         ╵                                        ~~~~~~~~


✘ [ERROR] TS2339: Property 'REJECTED' does not exist on type 'typeof AcceptanceStatus'. [plugin angular-compiler]

    src/app/modules/acceptance/application/handlers/acceptance.event-handlers.ts:62:39:
      62 │               status: AcceptanceStatus.REJECTED,
         ╵                                        ~~~~~~~~


✘ [ERROR] TS2724: '"@acceptance/domain"' has no exported member named 'AcceptanceRepository'. Did you mean 'AcceptanceItemRepository'? [plugin angular-compiler]

    src/app/modules/acceptance/application/interfaces/acceptance-repository.token.ts:2:9:
      2 │ import { AcceptanceRepository } from '@acceptance/domain';
        ╵          ~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@acceptance/domain"' has no exported member 'AcceptanceCheckEntity'. [plugin angular-compiler]

    src/app/modules/acceptance/application/stores/acceptance.store.ts:19:9:
      19 │ import { AcceptanceCheckEntity, AcceptanceStatus } from '@acceptan...
         ╵          ~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2551: Property 'PENDING' does not exist on type 'typeof AcceptanceStatus'. Did you mean 'pending'? [plugin angular-compiler]

    src/app/modules/acceptance/application/stores/acceptance.store.ts:54:63:
      54 │ ... state.checks().filter(c => c.status === AcceptanceStatus.PENDING)
         ╵                                                              ~~~~~~~

  'pending' is declared here.

    src/app/modules/acceptance/domain/value-objects/acceptance-status.vo.ts:17:18:
      17 │     public static pending(): AcceptanceStatus {
         ╵                   ~~~~~~~


✘ [ERROR] TS2339: Property 'APPROVED' does not exist on type 'typeof AcceptanceStatus'. [plugin angular-compiler]

    src/app/modules/acceptance/application/stores/acceptance.store.ts:61:63:
      61 │ ...state.checks().filter(c => c.status === AcceptanceStatus.APPROVED)
         ╵                                                             ~~~~~~~~


✘ [ERROR] TS2339: Property 'REJECTED' does not exist on type 'typeof AcceptanceStatus'. [plugin angular-compiler]

    src/app/modules/acceptance/application/stores/acceptance.store.ts:68:63:
      68 │ ...state.checks().filter(c => c.status === AcceptanceStatus.REJECTED)
         ╵                                                             ~~~~~~~~


✘ [ERROR] TS2551: Property 'PENDING' does not exist on type 'typeof AcceptanceStatus'. Did you mean 'pending'? [plugin angular-compiler]

    src/app/modules/acceptance/application/stores/acceptance.store.ts:82:92:
      82 │ ... state.checks().some(c => c.status === AcceptanceStatus.PENDING)),
         ╵                                                            ~~~~~~~

  'pending' is declared here.

    src/app/modules/acceptance/domain/value-objects/acceptance-status.vo.ts:17:18:
      17 │     public static pending(): AcceptanceStatus {
         ╵                   ~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@domain/value-objects/task-id.vo' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/acceptance/domain/aggregates/acceptance-item.aggregate.ts:6:23:
      6 │ import { TaskId } from '@domain/value-objects/task-id.vo';
        ╵                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS4115: This parameter property must have an 'override' modifier because it overrides a member in base class 'Entity<any>'. [plugin angular-compiler]

    src/app/modules/acceptance/domain/entities/acceptance-criteria-item.entity.ts:10:8:
      10 │         public readonly id: string,
         ╵         ~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] Could not resolve "./events/acceptance-approved.event"

    src/app/modules/acceptance/domain/index.ts:3:14:
      3 │ export * from './events/acceptance-approved.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/acceptance-approved.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/acceptance/domain/index.ts:3:14:
      3 │ export * from './events/acceptance-approved.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] Could not resolve "./events/acceptance-rejected.event"

    src/app/modules/acceptance/domain/index.ts:4:14:
      4 │ export * from './events/acceptance-rejected.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/acceptance-rejected.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/acceptance/domain/index.ts:4:14:
      4 │ export * from './events/acceptance-rejected.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@acceptance/domain/aggregates' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/acceptance/domain/policies/acceptance-validation.policy.ts:8:33:
      8 │ import { AcceptanceStatus } from '@acceptance/domain/aggregates';
        ╵                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@acceptance/domain"' has no exported member 'AcceptanceCheckEntity'. [plugin angular-compiler]

    src/app/modules/acceptance/infrastructure/repositories/acceptance.repository.impl.ts:11:9:
      11 │ import { AcceptanceCheckEntity, AcceptanceRepository } from '@acce...
         ╵          ~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2724: '"@acceptance/domain"' has no exported member named 'AcceptanceRepository'. Did you mean 'AcceptanceItemRepository'? [plugin angular-compiler]

    src/app/modules/acceptance/infrastructure/repositories/acceptance.repository.impl.ts:11:32:
      11 │ ...cceptanceCheckEntity, AcceptanceRepository } from '@acceptance/...
         ╵                          ~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@application/handlers/approve-task.handler' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/acceptance/presentation/pages/acceptance.component.ts:25:35:
      25 │ ...veTaskHandler } from '@application/handlers/approve-task.handler';
         ╵                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@application/handlers/reject-task.handler' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/acceptance/presentation/pages/acceptance.component.ts:26:34:
      26 │ ...ectTaskHandler } from '@application/handlers/reject-task.handler';
         ╵                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2571: Object is of type 'unknown'. [plugin angular-compiler]

    src/app/modules/acceptance/presentation/pages/acceptance.component.ts:188:37:
      188 │ ...equest: Parameters<typeof this.approveTaskHandler.execute>[0] = {
          ╵                              ~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2571: Object is of type 'unknown'. [plugin angular-compiler]

    src/app/modules/acceptance/presentation/pages/acceptance.component.ts:196:4:
      196 │     this.approveTaskHandler.execute(request).then((result) => {
          ╵     ~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS7006: Parameter 'result' implicitly has an 'any' type. [plugin angular-compiler]

    src/app/modules/acceptance/presentation/pages/acceptance.component.ts:196:51:
      196 │     this.approveTaskHandler.execute(request).then((result) => {
          ╵                                                    ~~~~~~


✘ [ERROR] TS2571: Object is of type 'unknown'. [plugin angular-compiler]

    src/app/modules/acceptance/presentation/pages/acceptance.component.ts:212:4:
      212 │     this.rejectTaskHandler
          ╵     ~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS7006: Parameter 'result' implicitly has an 'any' type. [plugin angular-compiler]

    src/app/modules/acceptance/presentation/pages/acceptance.component.ts:220:13:
      220 │       .then((result) => {
          ╵              ~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/audit-log-created.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/audit/domain/index.ts:2:14:
      2 │ export * from './events/audit-log-created.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@domain/aggregates/audit-log.aggregate' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/audit/infrastructure/mappers/audit-log.mapper.ts:1:31:
      1 │ ...t { AuditLogEntity } from '@domain/aggregates/audit-log.aggregate';
        ╵                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS5097: An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled. [plugin angular-compiler]

    src/app/modules/audit/infrastructure/mappers/audit-log.mapper.ts:2:28:
      2 │ ...AuditLogDto } from '@audit/infrastructure/models/audit-log.dto.ts';
        ╵                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@audit/domain"' has no exported member 'AuditLogEntity'. [plugin angular-compiler]

    src/app/modules/audit/infrastructure/repositories/audit-log.repository.impl.ts:12:9:
      12 │ import { AuditLogEntity, AuditLogRepository } from '@audit/domain';
         ╵          ~~~~~~~~~~~~~~


✘ [ERROR] TS2416: Property 'findById' in type 'AuditLogRepositoryImpl' is not assignable to the same property in base type 'AuditLogRepository'.
  Type '(id: string) => Promise<any>' is not assignable to type '(id: AuditLogId) => Promise<AuditLogAggregate | null>'.
    Types of parameters 'id' and 'id' are incompatible.
      Type 'AuditLogId' is not assignable to type 'string'. [plugin angular-compiler]

    src/app/modules/audit/infrastructure/repositories/audit-log.repository.impl.ts:19:8:
      19 │   async findById(id: string): Promise<AuditLogEntity | null> {
         ╵         ~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@domain/aggregates/audit-log.aggregate' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/audit/infrastructure/repositories/audit-log.repository.ts:12:31:
      12 │ ... { AuditLogEntity } from '@domain/aggregates/audit-log.aggregate';
         ╵                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@domain/repositories/audit-log.repository' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/audit/infrastructure/repositories/audit-log.repository.ts:13:35:
      13 │ ...tLogRepository } from '@domain/repositories/audit-log.repository';
         ╵                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2412: Type 'string | undefined' is not assignable to type 'string' with 'exactOptionalPropertyTypes: true'. Consider adding 'undefined' to the type of the target.
  Type 'undefined' is not assignable to type 'string'. [plugin angular-compiler]

    src/app/modules/calendar/domain/aggregates/calendar-event.aggregate.ts:38:8:
      38 │         this.description = props.description;
         ╵         ~~~~~~~~~~~~~~~~


✘ [ERROR] TS2304: Cannot find name 'EventPeriod'. [plugin angular-compiler]

    src/app/modules/calendar/domain/aggregates/calendar-event.aggregate.ts:55:33:
      55 │     public reschedule(newPeriod: EventPeriod): void {
         ╵                                  ~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@domain/value-objects/action-date.vo' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/calendar/infrastructure/mappers/calendar-event.mapper.ts:1:27:
      1 │ import { ActionDate } from '@domain/value-objects/action-date.vo';
        ╵                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'reconstitute' does not exist on type 'typeof CalendarEventAggregate'. [plugin angular-compiler]

    src/app/modules/calendar/infrastructure/mappers/calendar-event.mapper.ts:16:38:
      16 │         return CalendarEventAggregate.reconstitute(
         ╵                                       ~~~~~~~~~~~~


✘ [ERROR] TS2322: Type 'CalendarEventId' is not assignable to type 'string'. [plugin angular-compiler]

    src/app/modules/calendar/infrastructure/mappers/calendar-event.mapper.ts:33:12:
      33 │             id: domain.id,
         ╵             ~~

  The expected type comes from property 'id' which is declared here on type 'CalendarEventDto'

    src/app/modules/calendar/infrastructure/models/calendar-event.dto.ts:9:4:
      9 │     id: string;
        ╵     ~~


✘ [ERROR] TS2322: Type 'WorkspaceId' is not assignable to type 'string'. [plugin angular-compiler]

    src/app/modules/calendar/infrastructure/mappers/calendar-event.mapper.ts:34:12:
      34 │             workspaceId: domain.workspaceId,
         ╵             ~~~~~~~~~~~

  The expected type comes from property 'workspaceId' which is declared here on type 'CalendarEventDto'

    src/app/modules/calendar/infrastructure/models/calendar-event.dto.ts:10:4:
      10 │     workspaceId: string;
         ╵     ~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'createdAt' does not exist on type 'CalendarEventAggregate'. [plugin angular-compiler]

    src/app/modules/calendar/infrastructure/mappers/calendar-event.mapper.ts:40:49:
      40 │             createdAt: Timestamp.fromDate(domain.createdAt),
         ╵                                                  ~~~~~~~~~


✘ [ERROR] TS2339: Property 'updatedAt' does not exist on type 'CalendarEventAggregate'. [plugin angular-compiler]

    src/app/modules/calendar/infrastructure/mappers/calendar-event.mapper.ts:41:49:
      41 │             updatedAt: Timestamp.fromDate(domain.updatedAt)
         ╵                                                  ~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@domain/repositories/calendar.repository' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/calendar/infrastructure/repositories/calendar-event.repository.ts:3:35:
      3 │ ...lendarRepository } from '@domain/repositories/calendar.repository';
        ╵                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] NG5002: Unexpected closing tag "div". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags [plugin angular-compiler]

    src/app/modules/calendar/presentation/pages/calendar.component.ts:49:6:
      49 │       </div>
         ╵       ~~~~~~


✘ [ERROR] TS2322: Type 'TaskId' is not assignable to type 'string'. [plugin angular-compiler]

    src/app/modules/calendar/presentation/pages/calendar.component.ts:261:10:
      261 │           id: tasks[dayIndex].id,
          ╵           ~~

  The expected type comes from property 'id' which is declared here on type '{ id: string; title: string; status: string; }'

    src/app/modules/calendar/presentation/pages/calendar.component.ts:253:13:
      253 │   ): Array<{ id: string; title: string; status: string }> {
          ╵              ~~


✘ [ERROR] TS2322: Type 'TaskStatus' is not assignable to type 'string'. [plugin angular-compiler]

    src/app/modules/calendar/presentation/pages/calendar.component.ts:263:10:
      263 │           status: tasks[dayIndex].status,
          ╵           ~~~~~~

  The expected type comes from property 'status' which is declared here on type '{ id: string; title: string; status: string; }'

    src/app/modules/calendar/presentation/pages/calendar.component.ts:253:40:
      253 │   ): Array<{ id: string; title: string; status: string }> {
          ╵                                         ~~~~~~


✘ [ERROR] TS2554: Expected 2-3 arguments, but got 1. [plugin angular-compiler]

    src/app/modules/daily/application/handlers/create-daily-entry.handler.ts:40:20:
      40 │       const event = createDailyEntryCreatedEvent({
         ╵                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  An argument for 'correlationId' was not provided.

    src/app/events/daily/daily.events.ts:21:108:
      21 │ ...; content: string }, correlationId: string, causationId?: strin...
         ╵                         ~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2724: '"@events"' has no exported member named 'DailyEntryCreatedEvent'. Did you mean 'DailyEntryCreated'? [plugin angular-compiler]

    src/app/modules/daily/application/handlers/daily.event-handlers.ts:14:9:
      14 │ import { DailyEntryCreatedEvent } from '@events';
         ╵          ~~~~~~~~~~~~~~~~~~~~~~

  'DailyEntryCreated' is declared here.

    src/app/events/daily/daily.events.ts:5:13:
      5 │ export class DailyEntryCreated implements DomainEvent<{ entryId: st...
        ╵              ~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2724: '"@daily/domain"' has no exported member named 'DailyRepository'. Did you mean 'DailyEntryRepository'? [plugin angular-compiler]

    src/app/modules/daily/application/interfaces/daily-repository.token.ts:2:9:
      2 │ import { DailyRepository } from '@daily/domain';
        ╵          ~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/daily-entry-created.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/daily/domain/index.ts:2:14:
      2 │ export * from './events/daily-entry-created.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2724: '"@daily/domain"' has no exported member named 'DailyEntryEntity'. Did you mean 'DailyEntryId'? [plugin angular-compiler]

    src/app/modules/daily/infrastructure/repositories/daily.repository.impl.ts:12:9:
      12 │ import { DailyEntryEntity, DailyRepository } from '@daily/domain';
         ╵          ~~~~~~~~~~~~~~~~

  'DailyEntryId' is declared here.

    src/app/modules/daily/domain/value-objects/daily-entry-id.vo.ts:2:13:
      2 │ export class DailyEntryId {
        ╵              ~~~~~~~~~~~~


✘ [ERROR] TS2724: '"@daily/domain"' has no exported member named 'DailyRepository'. Did you mean 'DailyEntryRepository'? [plugin angular-compiler]

    src/app/modules/daily/infrastructure/repositories/daily.repository.impl.ts:12:27:
      12 │ import { DailyEntryEntity, DailyRepository } from '@daily/domain';
         ╵                            ~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@application/handlers/create-daily-entry.handler' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/daily/presentation/pages/daily.component.ts:19:40:
      19 │ ...Handler } from '@application/handlers/create-daily-entry.handler';
         ╵                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2571: Object is of type 'unknown'. [plugin angular-compiler]

    src/app/modules/daily/presentation/pages/daily.component.ts:190:37:
      190 │ ...est: Parameters<typeof this.createDailyEntryHandler.execute>[0] =
          ╵                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2571: Object is of type 'unknown'. [plugin angular-compiler]

    src/app/modules/daily/presentation/pages/daily.component.ts:201:10:
      201 │     await this.createDailyEntryHandler.execute(request);
          ╵           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@domain/value-objects"' has no exported member 'DocumentId'. [plugin angular-compiler]

    src/app/modules/documents/application/commands/change-document-status.command.ts:9:9:
      9 │ import { DocumentId } from '@domain/value-objects';
        ╵          ~~~~~~~~~~


✘ [ERROR] TS2724: '"@documents/domain"' has no exported member named 'DocumentType'. Did you mean 'Document'? [plugin angular-compiler]

    src/app/modules/documents/application/commands/create-document.command.ts:9:9:
      9 │ import { DocumentType } from '@documents/domain';
        ╵          ~~~~~~~~~~~~

  'Document' is declared here.

    src/app/modules/documents/domain/entities/document.entity.ts:11:13:
      11 │ export class Document extends Entity<DocumentId> {
         ╵              ~~~~~~~~


✘ [ERROR] TS2305: Module '"@domain/value-objects"' has no exported member 'DocumentId'. [plugin angular-compiler]

    src/app/modules/documents/application/commands/create-document.command.ts:10:9:
      10 │ import { DocumentId } from '@domain/value-objects';
         ╵          ~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@domain/value-objects"' has no exported member 'DocumentId'. [plugin angular-compiler]

    src/app/modules/documents/application/commands/rename-document.command.ts:8:9:
      8 │ import { DocumentId } from '@domain/value-objects';
        ╵          ~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@documents/domain"' has no exported member 'DocumentRepository'. [plugin angular-compiler]

    src/app/modules/documents/application/interfaces/document-repository.token.ts:2:9:
      2 │ import { DocumentRepository } from '@documents/domain';
        ╵          ~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/document-uploaded.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/documents/domain/index.ts:4:14:
      4 │ export * from './events/document-uploaded.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@documents/domain"' has no exported member 'DocumentAggregate'. [plugin angular-compiler]

    src/app/modules/documents/infrastructure/repositories/document.repository.impl.ts:14:9:
      14 │ import { DocumentAggregate, DocumentRepository, DocumentId } from ...
         ╵          ~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@documents/domain"' has no exported member 'DocumentRepository'. [plugin angular-compiler]

    src/app/modules/documents/infrastructure/repositories/document.repository.impl.ts:14:28:
      14 │ ...t { DocumentAggregate, DocumentRepository, DocumentId } from '@...
         ╵                           ~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2554: Expected 2-3 arguments, but got 1. [plugin angular-compiler]

    src/app/modules/issues/application/handlers/create-issue.handler.ts:39:20:
      39 │       const event = createIssueCreatedEvent({
         ╵                     ~~~~~~~~~~~~~~~~~~~~~~~

  An argument for 'correlationId' was not provided.

    src/app/events/issues/issues.events.ts:37:105:
      37 │ ...eporterId: string }, correlationId: string, causationId?: strin...
         ╵                         ~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@issues/domain"' has no exported member 'createIssue'. [plugin angular-compiler]

    src/app/modules/issues/application/handlers/issues.event-handlers.ts:9:9:
      9 │ import { createIssue, IssuePriority, IssueStatus, IssueType } from ...
        ╵          ~~~~~~~~~~~


✘ [ERROR] TS2724: '"@events"' has no exported member named 'IssueCreatedEvent'. Did you mean 'IssueCreated'? [plugin angular-compiler]

    src/app/modules/issues/application/handlers/issues.event-handlers.ts:10:9:
      10 │ import { IssueCreatedEvent, IssueResolvedEvent } from '@events';
         ╵          ~~~~~~~~~~~~~~~~~

  'IssueCreated' is declared here.

    src/app/events/issues/issues.events.ts:5:13:
      5 │ export class IssueCreated implements DomainEvent<{ issueId: string;...
        ╵              ~~~~~~~~~~~~


✘ [ERROR] TS2724: '"@events"' has no exported member named 'IssueResolvedEvent'. Did you mean 'IssueResolved'? [plugin angular-compiler]

    src/app/modules/issues/application/handlers/issues.event-handlers.ts:10:28:
      10 │ import { IssueCreatedEvent, IssueResolvedEvent } from '@events';
         ╵                             ~~~~~~~~~~~~~~~~~~

  'IssueResolved' is declared here.

    src/app/events/issues/issues.events.ts:21:13:
      21 │ export class IssueResolved implements DomainEvent<{ issueId: strin...
         ╵              ~~~~~~~~~~~~~


✘ [ERROR] TS2551: Property 'BUG' does not exist on type 'typeof IssueType'. Did you mean 'bug'? [plugin angular-compiler]

    src/app/modules/issues/application/handlers/issues.event-handlers.ts:28:18:
      28 │         IssueType.BUG, // Defaulting to BUG as type isn't in event...
         ╵                   ~~~

  'bug' is declared here.

    src/app/modules/issues/domain/value-objects/issue-type.vo.ts:17:18:
      17 │     public static bug(): IssueType {
         ╵                   ~~~


✘ [ERROR] TS2551: Property 'HIGH' does not exist on type 'typeof IssuePriority'. Did you mean 'high'? [plugin angular-compiler]

    src/app/modules/issues/application/handlers/issues.event-handlers.ts:29:22:
      29 │         IssuePriority.HIGH,
         ╵                       ~~~~

  'high' is declared here.

    src/app/modules/issues/domain/value-objects/issue-priority.vo.ts:25:18:
      25 │     public static high(): IssuePriority {
         ╵                   ~~~~


✘ [ERROR] TS2339: Property 'RESOLVED' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/application/handlers/issues.event-handlers.ts:45:28:
      45 │         status: IssueStatus.RESOLVED,
         ╵                             ~~~~~~~~


✘ [ERROR] TS2353: Object literal may only specify known properties, and 'resolvedAt' does not exist in type 'Partial<IssueAggregate>'. [plugin angular-compiler]

    src/app/modules/issues/application/handlers/issues.event-handlers.ts:46:8:
      46 │         resolvedAt: event.timestamp
         ╵         ~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@domain/aggregates/issue.aggregate' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/issues/application/handlers/resolve-issue.handler.ts:4:29:
      4 │ import { resolveIssue } from '@domain/aggregates/issue.aggregate';
        ╵                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2345: Argument of type 'string' is not assignable to parameter of type 'IssueId'. [plugin angular-compiler]

    src/app/modules/issues/application/handlers/resolve-issue.handler.ts:30:45:
      30 │       const issue = await this.repo.findById(request.issueId);
         ╵                                              ~~~~~~~~~~~~~~~


✘ [ERROR] TS2554: Expected 2-3 arguments, but got 7. [plugin angular-compiler]

    src/app/modules/issues/application/handlers/resolve-issue.handler.ts:48:8:
      48 │         request.resolvedBy,
         ╵         ~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2551: Property 'OPEN' does not exist on type 'typeof IssueStatus'. Did you mean 'open'? [plugin angular-compiler]

    src/app/modules/issues/application/stores/issues.store.ts:55:58:
      55 │ ...i => i.status === IssueStatus.OPEN || i.status === IssueStatus....
         ╵                                  ~~~~

  'open' is declared here.

    src/app/modules/issues/domain/value-objects/issue-status.vo.ts:18:18:
      18 │     public static open(): IssueStatus {
         ╵                   ~~~~


✘ [ERROR] TS2339: Property 'IN_PROGRESS' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/application/stores/issues.store.ts:55:91:
      55 │ ...atus === IssueStatus.OPEN || i.status === IssueStatus.IN_PROGRESS)
         ╵                                                          ~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'RESOLVED' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/application/stores/issues.store.ts:62:58:
      62 │ ...=> i.status === IssueStatus.RESOLVED || i.status === IssueStatu...
         ╵                                ~~~~~~~~


✘ [ERROR] TS2339: Property 'CLOSED' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/application/stores/issues.store.ts:62:95:
      62 │ ...tatus === IssueStatus.RESOLVED || i.status === IssueStatus.CLOSED)
         ╵                                                               ~~~~~~


✘ [ERROR] TS2339: Property 'taskId' does not exist on type 'IssueAggregate'. [plugin angular-compiler]

    src/app/modules/issues/application/stores/issues.store.ts:69:35:
      69 │       state.issues().filter(i => i.taskId === taskId)
         ╵                                    ~~~~~~


✘ [ERROR] TS2367: This comparison appears to be unintentional because the types 'IssueId' and 'string' have no overlap. [plugin angular-compiler]

    src/app/modules/issues/application/stores/issues.store.ts:77:43:
      77 │ ... return id ? state.issues().find(i => i.id === id) || null : null;
         ╵                                          ~~~~~~~~~~~


✘ [ERROR] TS2551: Property 'OPEN' does not exist on type 'typeof IssueStatus'. Did you mean 'open'? [plugin angular-compiler]

    src/app/modules/issues/application/stores/issues.store.ts:83:84:
      83 │ ...i => i.status === IssueStatus.OPEN || i.status === IssueStatus....
         ╵                                  ~~~~

  'open' is declared here.

    src/app/modules/issues/domain/value-objects/issue-status.vo.ts:18:18:
      18 │     public static open(): IssueStatus {
         ╵                   ~~~~


✘ [ERROR] TS2339: Property 'IN_PROGRESS' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/application/stores/issues.store.ts:83:117:
      83 │ ...us === IssueStatus.OPEN || i.status === IssueStatus.IN_PROGRESS)),
         ╵                                                        ~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'findByWorkspaceId' does not exist on type 'IssueRepository'. [plugin angular-compiler]

    src/app/modules/issues/application/stores/issues.store.ts:95:27:
      95 │           return from(repo.findByWorkspaceId(workspaceId)).pipe(
         ╵                            ~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2367: This comparison appears to be unintentional because the types 'IssueId' and 'string' have no overlap. [plugin angular-compiler]

    src/app/modules/issues/application/stores/issues.store.ts:126:47:
      126 │         const issue = store.issues().find(i => i.id === issueId);
          ╵                                                ~~~~~~~~~~~~~~~~


✘ [ERROR] TS2367: This comparison appears to be unintentional because the types 'IssueId' and 'string' have no overlap. [plugin angular-compiler]

    src/app/modules/issues/application/stores/issues.store.ts:138:48:
      138 │ ...tore.issues().map(i => i.id === issueId ? (updatedIssue as Iss...
          ╵                           ~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@domain/value-objects/task-id.vo' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/issues/domain/aggregates/issue.aggregate.ts:6:23:
      6 │ import { TaskId } from '@domain/value-objects/task-id.vo';
        ╵                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] Could not resolve "./events/issue-created.event"

    src/app/modules/issues/domain/index.ts:2:14:
      2 │ export * from './events/issue-created.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/issue-created.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/issues/domain/index.ts:2:14:
      2 │ export * from './events/issue-created.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] Could not resolve "./events/issue-resolved.event"

    src/app/modules/issues/domain/index.ts:3:14:
      3 │ export * from './events/issue-resolved.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/issue-resolved.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/issues/domain/index.ts:3:14:
      3 │ export * from './events/issue-resolved.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2344: Type 'IssueStatus' does not satisfy the constraint 'string | number | symbol'. [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:22:28:
      22 │   const transitions: Record<IssueStatus, IssueStatus[]> = {
         ╵                             ~~~~~~~~~~~


✘ [ERROR] TS2551: Property 'OPEN' does not exist on type 'typeof IssueStatus'. Did you mean 'open'? [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:23:17:
      23 │     [IssueStatus.OPEN]: [IssueStatus.IN_PROGRESS, IssueStatus.RESO...
         ╵                  ~~~~

  'open' is declared here.

    src/app/modules/issues/domain/value-objects/issue-status.vo.ts:18:18:
      18 │     public static open(): IssueStatus {
         ╵                   ~~~~


✘ [ERROR] TS2339: Property 'IN_PROGRESS' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:23:37:
      23 │ ...tatus.OPEN]: [IssueStatus.IN_PROGRESS, IssueStatus.RESOLVED, Is...
         ╵                              ~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'RESOLVED' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:23:62:
      23 │ ...us.IN_PROGRESS, IssueStatus.RESOLVED, IssueStatus.CLOSED, Issue...
         ╵                                ~~~~~~~~


✘ [ERROR] TS2339: Property 'CLOSED' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:23:84:
      23 │ ..., IssueStatus.RESOLVED, IssueStatus.CLOSED, IssueStatus.WONT_FIX],
         ╵                                        ~~~~~~


✘ [ERROR] TS2339: Property 'WONT_FIX' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:23:104:
      23 │ ..., IssueStatus.RESOLVED, IssueStatus.CLOSED, IssueStatus.WONT_FIX],
         ╵                                                            ~~~~~~~~


✘ [ERROR] TS2339: Property 'IN_PROGRESS' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:24:17:
      24 │     [IssueStatus.IN_PROGRESS]: [IssueStatus.RESOLVED, IssueStatus....
         ╵                  ~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'RESOLVED' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:24:44:
      24 │ ....IN_PROGRESS]: [IssueStatus.RESOLVED, IssueStatus.CLOSED, Issue...
         ╵                                ~~~~~~~~


✘ [ERROR] TS2339: Property 'CLOSED' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:24:66:
      24 │ ...Status.RESOLVED, IssueStatus.CLOSED, IssueStatus.WONT_FIX, Issu...
         ╵                                 ~~~~~~


✘ [ERROR] TS2339: Property 'WONT_FIX' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:24:86:
      24 │ ...eStatus.CLOSED, IssueStatus.WONT_FIX, IssueStatus.OPEN], // Can...
         ╵                                ~~~~~~~~


✘ [ERROR] TS2551: Property 'OPEN' does not exist on type 'typeof IssueStatus'. Did you mean 'open'? [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:24:108:
      24 │ ...ueStatus.WONT_FIX, IssueStatus.OPEN], // Can go back to open? Yes.
         ╵                                   ~~~~

  'open' is declared here.

    src/app/modules/issues/domain/value-objects/issue-status.vo.ts:18:18:
      18 │     public static open(): IssueStatus {
         ╵                   ~~~~


✘ [ERROR] TS2339: Property 'RESOLVED' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:25:17:
      25 │     [IssueStatus.RESOLVED]: [IssueStatus.CLOSED, IssueStatus.OPEN]...
         ╵                  ~~~~~~~~


✘ [ERROR] TS2339: Property 'CLOSED' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:25:41:
      25 │ ...atus.RESOLVED]: [IssueStatus.CLOSED, IssueStatus.OPEN], // Reop...
         ╵                                 ~~~~~~


✘ [ERROR] TS2551: Property 'OPEN' does not exist on type 'typeof IssueStatus'. Did you mean 'open'? [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:25:61:
      25 │ ...OLVED]: [IssueStatus.CLOSED, IssueStatus.OPEN], // Reopen or Close
         ╵                                             ~~~~

  'open' is declared here.

    src/app/modules/issues/domain/value-objects/issue-status.vo.ts:18:18:
      18 │     public static open(): IssueStatus {
         ╵                   ~~~~


✘ [ERROR] TS2339: Property 'CLOSED' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:26:17:
      26 │     [IssueStatus.CLOSED]: [IssueStatus.OPEN], // Only Reopen
         ╵                  ~~~~~~


✘ [ERROR] TS2551: Property 'OPEN' does not exist on type 'typeof IssueStatus'. Did you mean 'open'? [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:26:39:
      26 │     [IssueStatus.CLOSED]: [IssueStatus.OPEN], // Only Reopen
         ╵                                        ~~~~

  'open' is declared here.

    src/app/modules/issues/domain/value-objects/issue-status.vo.ts:18:18:
      18 │     public static open(): IssueStatus {
         ╵                   ~~~~


✘ [ERROR] TS2339: Property 'WONT_FIX' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:27:17:
      27 │     [IssueStatus.WONT_FIX]: [IssueStatus.OPEN, IssueStatus.CLOSED]...
         ╵                  ~~~~~~~~


✘ [ERROR] TS2551: Property 'OPEN' does not exist on type 'typeof IssueStatus'. Did you mean 'open'? [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:27:41:
      27 │ ...tatus.WONT_FIX]: [IssueStatus.OPEN, IssueStatus.CLOSED] // Reop...
         ╵                                  ~~~~

  'open' is declared here.

    src/app/modules/issues/domain/value-objects/issue-status.vo.ts:18:18:
      18 │     public static open(): IssueStatus {
         ╵                   ~~~~


✘ [ERROR] TS2339: Property 'CLOSED' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:27:59:
      27 │ ...[IssueStatus.OPEN, IssueStatus.CLOSED] // Reopen or explicit Close
         ╵                                   ~~~~~~


✘ [ERROR] TS2538: Type 'IssueStatus' cannot be used as an index type. [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:30:19:
      30 │   if (!transitions[currentStatus].includes(newStatus)) {
         ╵                    ~~~~~~~~~~~~~


✘ [ERROR] TS2551: Property 'OPEN' does not exist on type 'typeof IssueStatus'. Did you mean 'open'? [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:38:32:
      38 │   return status === IssueStatus.OPEN;
         ╵                                 ~~~~

  'open' is declared here.

    src/app/modules/issues/domain/value-objects/issue-status.vo.ts:18:18:
      18 │     public static open(): IssueStatus {
         ╵                   ~~~~


✘ [ERROR] TS2339: Property 'RESOLVED' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:42:32:
      42 │ ...turn status !== IssueStatus.RESOLVED && status !== IssueStatus....
         ╵                                ~~~~~~~~


✘ [ERROR] TS2339: Property 'CLOSED' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:42:67:
      42 │ ... status !== IssueStatus.RESOLVED && status !== IssueStatus.CLOSED;
         ╵                                                               ~~~~~~


✘ [ERROR] TS2339: Property 'CLOSED' does not exist on type 'typeof IssueStatus'. [plugin angular-compiler]

    src/app/modules/issues/domain/policies/issue-workflow.policy.ts:46:32:
      46 │   return status !== IssueStatus.CLOSED;
         ╵                                 ~~~~~~


✘ [ERROR] TS2416: Property 'findById' in type 'IssueRepositoryImpl' is not assignable to the same property in base type 'IssueRepository'.
  Type '(id: string) => Promise<IssueAggregate | null>' is not assignable to type '(id: IssueId) => Promise<IssueAggregate | null>'.
    Types of parameters 'id' and 'id' are incompatible.
      Type 'IssueId' is not assignable to type 'string'. [plugin angular-compiler]

    src/app/modules/issues/infrastructure/repositories/issue.repository.impl.ts:30:8:
      30 │   async findById(id: string): Promise<IssueAggregate | null> {
         ╵         ~~~~~~~~


✘ [ERROR] TS2345: Argument of type 'IssueId' is not assignable to parameter of type 'string'. [plugin angular-compiler]

    src/app/modules/issues/infrastructure/repositories/issue.repository.impl.ts:48:32:
      48 │     await setDoc(this.getDocRef(issue.id), issue);
         ╵                                 ~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@application/handlers/create-issue.handler' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/issues/presentation/pages/issues.component.ts:17:35:
      17 │ ...eIssueHandler } from '@application/handlers/create-issue.handler';
         ╵                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@application/handlers/resolve-issue.handler' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/issues/presentation/pages/issues.component.ts:18:36:
      18 │ ...IssueHandler } from '@application/handlers/resolve-issue.handler';
         ╵                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'createdAt' does not exist on type 'IssueAggregate'. [plugin angular-compiler]

    src/app/modules/issues/presentation/pages/issues.component.ts:52:38:
      52 │ ...      <span>Created: {{ issue.createdAt.toLocaleString() }}</span>
         ╵                                  ~~~~~~~~~


✘ [ERROR] TS2345: Argument of type 'IssueId' is not assignable to parameter of type 'string'. [plugin angular-compiler]

    src/app/modules/issues/presentation/pages/issues.component.ts:62:50:
      62 │ ...     <button (click)="resolveIssue(issue.id)" class="btn-success">
         ╵                                             ~~


✘ [ERROR] TS2339: Property 'resolvedAt' does not exist on type 'IssueAggregate'. [plugin angular-compiler]

    src/app/modules/issues/presentation/pages/issues.component.ts:75:37:
      75 │ ...   <span>Resolved: {{ issue.resolvedAt?.toLocaleString() }}</span>
         ╵                                ~~~~~~~~~~


✘ [ERROR] TS2571: Object is of type 'unknown'. [plugin angular-compiler]

    src/app/modules/issues/presentation/pages/issues.component.ts:109:14:
      109 │         await this.createIssueHandler.execute({
          ╵               ~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2367: This comparison appears to be unintentional because the types 'IssueId' and 'string' have no overlap. [plugin angular-compiler]

    src/app/modules/issues/presentation/pages/issues.component.ts:135:56:
      135 │ ... issue = this.issuesStore.issues().find((i) => i.id === issueId);
          ╵                                                   ~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'taskId' does not exist on type 'IssueAggregate'. [plugin angular-compiler]

    src/app/modules/issues/presentation/pages/issues.component.ts:136:25:
      136 │     if (!issue || !issue.taskId) return;
          ╵                          ~~~~~~


✘ [ERROR] TS2571: Object is of type 'unknown'. [plugin angular-compiler]

    src/app/modules/issues/presentation/pages/issues.component.ts:138:10:
      138 │     await this.resolveIssueHandler.execute({
          ╵           ~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'taskId' does not exist on type 'IssueAggregate'. [plugin angular-compiler]

    src/app/modules/issues/presentation/pages/issues.component.ts:140:20:
      140 │       taskId: issue.taskId,
          ╵                     ~~~~~~


✘ [ERROR] TS2551: Property 'inactive' does not exist on type 'typeof MemberStatus'. Did you mean 'active'? [plugin angular-compiler]

    src/app/modules/members/domain/aggregates/member.aggregate.ts:63:35:
      63 │         this.status = MemberStatus.inactive();
         ╵                                    ~~~~~~~~

  'active' is declared here.

    src/app/modules/members/domain/value-objects/member-status.vo.ts:17:18:
      17 │     public static active(): MemberStatus {
         ╵                   ~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/member-invited.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/members/domain/index.ts:2:14:
      2 │ export * from './events/member-invited.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/member-removed.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/members/domain/index.ts:3:14:
      3 │ export * from './events/member-removed.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2367: This comparison appears to be unintentional because the types 'MemberStatus' and 'string' have no overlap. [plugin angular-compiler]

    src/app/modules/members/domain/policies/member-role.policy.ts:20:6:
      20 │   if (member.status !== 'active') {
         ╵       ~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2367: This comparison appears to be unintentional because the types 'MemberRole' and 'string' have no overlap. [plugin angular-compiler]

    src/app/modules/members/domain/policies/member-role.policy.ts:24:6:
      24 │   if (member.role === 'owner') {
         ╵       ~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2367: This comparison appears to be unintentional because the types 'MemberRole' and 'string' have no overlap. [plugin angular-compiler]

    src/app/modules/members/domain/policies/member-role.policy.ts:28:6:
      28 │   if (targetRole === 'owner') {
         ╵       ~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2367: This comparison appears to be unintentional because the types 'MemberRole' and 'string' have no overlap. [plugin angular-compiler]

    src/app/modules/members/domain/policies/member-role.policy.ts:39:6:
      39 │   if (member.role === 'owner') {
         ╵       ~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2367: This comparison appears to be unintentional because the types 'MemberStatus' and 'string' have no overlap. [plugin angular-compiler]

    src/app/modules/members/domain/policies/member-role.policy.ts:43:6:
      43 │   if (member.status === 'suspended') {
         ╵       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2367: This comparison appears to be unintentional because the types 'MemberStatus' and 'string' have no overlap. [plugin angular-compiler]

    src/app/modules/members/domain/policies/member-role.policy.ts:47:6:
      47 │   if (member.status === 'removed') {
         ╵       ~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2367: This comparison appears to be unintentional because the types 'MemberStatus' and 'string' have no overlap. [plugin angular-compiler]

    src/app/modules/members/domain/policies/member-role.policy.ts:58:6:
      58 │   if (member.status === 'active') {
         ╵       ~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2367: This comparison appears to be unintentional because the types 'MemberStatus' and 'string' have no overlap. [plugin angular-compiler]

    src/app/modules/members/domain/policies/member-role.policy.ts:62:6:
      62 │   if (member.status === 'removed') {
         ╵       ~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2367: This comparison appears to be unintentional because the types 'MemberRole' and 'string' have no overlap. [plugin angular-compiler]

    src/app/modules/members/domain/policies/member-role.policy.ts:82:6:
      82 │   if (role === 'owner') {
         ╵       ~~~~~~~~~~~~~~~~


✘ [ERROR] TS2416: Property 'findById' in type 'MemberRepositoryImpl' is not assignable to the same property in base type 'MemberRepository'.
  Type '(id: string) => Promise<MemberAggregate | null>' is not assignable to type '(id: MemberId) => Promise<MemberAggregate | null>'.
    Types of parameters 'id' and 'id' are incompatible.
      Type 'MemberId' is not assignable to type 'string'. [plugin angular-compiler]

    src/app/modules/members/infrastructure/repositories/member.repository.impl.ts:20:8:
      20 │   async findById(id: string): Promise<MemberAggregate | null> {
         ╵         ~~~~~~~~


✘ [ERROR] TS2416: Property 'delete' in type 'MemberRepositoryImpl' is not assignable to the same property in base type 'MemberRepository'.
  Type '(id: string) => Promise<void>' is not assignable to type '(id: MemberId) => Promise<void>'.
    Types of parameters 'id' and 'id' are incompatible.
      Type 'MemberId' is not assignable to type 'string'. [plugin angular-compiler]

    src/app/modules/members/infrastructure/repositories/member.repository.impl.ts:44:8:
      44 │   async delete(id: string): Promise<void> {
         ╵         ~~~~~~


✘ [ERROR] TS2305: Module '"@overview/domain"' has no exported member 'OverviewRepository'. [plugin angular-compiler]

    src/app/modules/overview/application/interfaces/overview-repository.token.ts:2:9:
      2 │ import { OverviewRepository } from '@overview/domain';
        ╵          ~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2341: Property 'value' is private and only accessible within class 'WidgetId'. [plugin angular-compiler]

    src/app/modules/overview/domain/aggregates/dashboard-config.aggregate.ts:30:35:
      30 │         this._widgets.set(widgetId.value, { type, position });
         ╵                                    ~~~~~


✘ [ERROR] TS2341: Property 'value' is private and only accessible within class 'WidgetId'. [plugin angular-compiler]

    src/app/modules/overview/domain/aggregates/dashboard-config.aggregate.ts:34:38:
      34 │         this._widgets.delete(widgetId.value);
         ╵                                       ~~~~~


✘ [ERROR] TS2307: Cannot find module './events/dashboard-refreshed.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/overview/domain/index.ts:2:14:
      2 │ export * from './events/dashboard-refreshed.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@overview/domain"' has no exported member 'OverviewDashboard'. [plugin angular-compiler]

    src/app/modules/overview/infrastructure/repositories/overview.repository.impl.ts:3:9:
      3 │ import { OverviewDashboard, OverviewRepository } from '@overview/do...
        ╵          ~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@overview/domain"' has no exported member 'OverviewRepository'. [plugin angular-compiler]

    src/app/modules/overview/infrastructure/repositories/overview.repository.impl.ts:3:28:
      3 │ ...t { OverviewDashboard, OverviewRepository } from '@overview/doma...
        ╵                           ~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@permissions/domain"' has no exported member 'MemberRole'. [plugin angular-compiler]

    src/app/modules/permissions/application/commands/update-member-role.command.ts:8:9:
      8 │ import { MemberRole } from '@permissions/domain';
        ╵          ~~~~~~~~~~


✘ [ERROR] TS2724: '"@permissions/domain"' has no exported member named 'PermissionRepository'. Did you mean 'PermissionMatrixRepository'? [plugin angular-compiler]

    src/app/modules/permissions/application/interfaces/permission-repository.token.ts:2:9:
      2 │ import { PermissionRepository } from '@permissions/domain';
        ╵          ~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2341: Property 'value' is private and only accessible within class 'RoleId'. [plugin angular-compiler]

    src/app/modules/permissions/domain/aggregates/permission-matrix.aggregate.ts:40:36:
      40 │         if (this._roles.has(role.id.value)) {
         ╵                                     ~~~~~


✘ [ERROR] TS2341: Property 'value' is private and only accessible within class 'RoleId'. [plugin angular-compiler]

    src/app/modules/permissions/domain/aggregates/permission-matrix.aggregate.ts:43:32:
      43 │         this._roles.set(role.id.value, role);
         ╵                                 ~~~~~


✘ [ERROR] TS2341: Property 'value' is private and only accessible within class 'PermissionId'. [plugin angular-compiler]

    src/app/modules/permissions/domain/entities/role.entity.ts:29:45:
      29 │         this._permissionIds.add(permissionId.value);
         ╵                                              ~~~~~


✘ [ERROR] TS2341: Property 'value' is private and only accessible within class 'PermissionId'. [plugin angular-compiler]

    src/app/modules/permissions/domain/entities/role.entity.ts:33:48:
      33 │         this._permissionIds.delete(permissionId.value);
         ╵                                                 ~~~~~


✘ [ERROR] TS2307: Cannot find module './events/permission-changed.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/permissions/domain/index.ts:4:14:
      4 │ export * from './events/permission-changed.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/permission-granted.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/permissions/domain/index.ts:5:14:
      5 │ export * from './events/permission-granted.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/permission-revoked.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/permissions/domain/index.ts:6:14:
      6 │ export * from './events/permission-revoked.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/role-created.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/permissions/domain/index.ts:7:14:
      7 │ export * from './events/role-created.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/role-deleted.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/permissions/domain/index.ts:8:14:
      8 │ export * from './events/role-deleted.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/role-updated.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/permissions/domain/index.ts:9:14:
      9 │ export * from './events/role-updated.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@permissions/domain/aggregates/permission-matrix.aggregate"' has no exported member 'PermissionMatrix'. [plugin angular-compiler]

    src/app/modules/permissions/domain/repositories/permission-matrix.repository.interface.ts:3:9:
      3 │ import { PermissionMatrix } from '@permissions/domain/aggregates/pe...
        ╵          ~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@permissions/domain"' has no exported member 'RoleEntity'. [plugin angular-compiler]

    src/app/modules/permissions/infrastructure/repositories/permission.repository.impl.ts:13:9:
      13 │ import { RoleEntity, PermissionRepository } from '@permissions/dom...
         ╵          ~~~~~~~~~~


✘ [ERROR] TS2724: '"@permissions/domain"' has no exported member named 'PermissionRepository'. Did you mean 'PermissionMatrixRepository'? [plugin angular-compiler]

    src/app/modules/permissions/infrastructure/repositories/permission.repository.impl.ts:13:21:
      13 │ import { RoleEntity, PermissionRepository } from '@permissions/dom...
         ╵                      ~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2724: '"@quality-control/domain"' has no exported member named 'QCStatus'. Did you mean 'QcStatus'? [plugin angular-compiler]

    src/app/modules/quality-control/application/commands/submit-qc-check.command.ts:8:9:
      8 │ import { QCStatus } from '@quality-control/domain';
        ╵          ~~~~~~~~

  'QcStatus' is declared here.

    src/app/modules/quality-control/domain/value-objects/qc-status.vo.ts:14:13:
      14 │ export class QcStatus {
         ╵              ~~~~~~~~


✘ [ERROR] TS2305: Module '"@quality-control/domain"' has no exported member 'TaskStatus'. [plugin angular-compiler]

    src/app/modules/quality-control/application/handlers/fail-qc.handler.ts:4:9:
      4 │ import { TaskStatus, updateTaskStatus } from '@quality-control/doma...
        ╵          ~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@quality-control/domain"' has no exported member 'updateTaskStatus'. [plugin angular-compiler]

    src/app/modules/quality-control/application/handlers/fail-qc.handler.ts:4:21:
      4 │ import { TaskStatus, updateTaskStatus } from '@quality-control/doma...
        ╵                      ~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@events"' has no exported member 'createQCFailedEvent'. [plugin angular-compiler]

    src/app/modules/quality-control/application/handlers/fail-qc.handler.ts:5:9:
      5 │ import { createQCFailedEvent } from '@events';
        ╵          ~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@domain/value-objects"' has no exported member 'TaskId'. [plugin angular-compiler]

    src/app/modules/quality-control/application/handlers/fail-qc.handler.ts:6:9:
      6 │ import { TaskId } from '@domain/value-objects';
        ╵          ~~~~~~


✘ [ERROR] TS2305: Module '"@events"' has no exported member 'createQCPassedEvent'. [plugin angular-compiler]

    src/app/modules/quality-control/application/handlers/pass-qc.handler.ts:15:9:
      15 │ import { createQCPassedEvent } from '@events';
         ╵          ~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@application/handlers/create-issue.handler' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/quality-control/application/handlers/quality-control.event-handlers.ts:20:35:
      20 │ ...eIssueHandler } from '@application/handlers/create-issue.handler';
         ╵                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@events"' has no exported member 'QCFailedEvent'. [plugin angular-compiler]

    src/app/modules/quality-control/application/handlers/quality-control.event-handlers.ts:21:9:
      21 │ import { QCFailedEvent } from '@events';
         ╵          ~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@events"' has no exported member 'QCPassedEvent'. [plugin angular-compiler]

    src/app/modules/quality-control/application/handlers/quality-control.event-handlers.ts:22:9:
      22 │ import { QCPassedEvent } from '@events';
         ╵          ~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@events"' has no exported member 'TaskSubmittedForQCEvent'. [plugin angular-compiler]

    src/app/modules/quality-control/application/handlers/quality-control.event-handlers.ts:23:9:
      23 │ import { TaskSubmittedForQCEvent } from '@events';
         ╵          ~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS18046: 'createIssueHandler' is of type 'unknown'. [plugin angular-compiler]

    src/app/modules/quality-control/application/handlers/quality-control.event-handlers.ts:72:12:
      72 │       await createIssueHandler.execute({
         ╵             ~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@quality-control/domain"' has no exported member 'QualityControlRepository'. [plugin angular-compiler]

    src/app/modules/quality-control/application/interfaces/quality-control-repository.token.ts:2:9:
      2 │ import { QualityControlRepository } from '@quality-control/domain';
        ╵          ~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS4115: This parameter property must have an 'override' modifier because it overrides a member in base class 'Entity<any>'. [plugin angular-compiler]

    src/app/modules/quality-control/domain/entities/qc-checklist-item.entity.ts:10:8:
      10 │         public readonly id: string, // Simple string ID
         ╵         ~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] Could not resolve "./events/qc-failed.event"

    src/app/modules/quality-control/domain/index.ts:3:14:
      3 │ export * from './events/qc-failed.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/qc-failed.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/quality-control/domain/index.ts:3:14:
      3 │ export * from './events/qc-failed.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] Could not resolve "./events/qc-passed.event"

    src/app/modules/quality-control/domain/index.ts:4:14:
      4 │ export * from './events/qc-passed.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/qc-passed.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/quality-control/domain/index.ts:4:14:
      4 │ export * from './events/qc-passed.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@quality-control/domain/aggregates' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/quality-control/domain/policies/qc-validation.policy.ts:8:25:
      8 │ import { QCStatus } from '@quality-control/domain/aggregates';
        ╵                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@quality-control/domain"' has no exported member 'QCCheckEntity'. [plugin angular-compiler]

    src/app/modules/quality-control/infrastructure/repositories/quality-control.repository.impl.ts:11:9:
      11 │ import { QCCheckEntity, QualityControlRepository } from '@quality-...
         ╵          ~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@quality-control/domain"' has no exported member 'QualityControlRepository'. [plugin angular-compiler]

    src/app/modules/quality-control/infrastructure/repositories/quality-control.repository.impl.ts:11:24:
      11 │ ...rt { QCCheckEntity, QualityControlRepository } from '@quality-c...
         ╵                        ~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@application/handlers/fail-qc.handler' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/quality-control/presentation/pages/quality-control.component.ts:28:30:
      28 │ ...rt { FailQCHandler } from '@application/handlers/fail-qc.handler';
         ╵                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@application/handlers/pass-qc.handler' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/quality-control/presentation/pages/quality-control.component.ts:29:30:
      29 │ ...rt { PassQCUseCase } from '@application/handlers/pass-qc.handler';
         ╵                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2571: Object is of type 'unknown'. [plugin angular-compiler]

    src/app/modules/quality-control/presentation/pages/quality-control.component.ts:158:10:
      158 │     await this.passQCUseCase.execute({
          ╵           ~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2571: Object is of type 'unknown'. [plugin angular-compiler]

    src/app/modules/quality-control/presentation/pages/quality-control.component.ts:179:10:
      179 │     await this.failQCHandler.execute({
          ╵           ~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'currentTheme' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/application/facades/settings.facade.ts:11:30:
      11 │   readonly theme = this.store.currentTheme;
         ╵                               ~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'updateUserPreferences' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/application/facades/settings.facade.ts:24:15:
      24 │     this.store.updateUserPreferences({ theme: newTheme });
         ╵                ~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@domain/repositories/settings.repository' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/settings/application/handlers/update-settings.handler.ts:10:35:
      10 │ ...tingsRepository } from '@domain/repositories/settings.repository';
         ╵                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@settings/domain/value-objects/setting-key.vo' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/settings/application/handlers/update-settings.handler.ts:14:27:
      14 │ ...SettingKey } from '@settings/domain/value-objects/setting-key.vo';
         ╵                      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@settings/domain/value-objects/setting-value.vo' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/settings/application/handlers/update-settings.handler.ts:15:29:
      15 │ ...ingValue } from '@settings/domain/value-objects/setting-value.vo';
         ╵                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2571: Object is of type 'unknown'. [plugin angular-compiler]

    src/app/modules/settings/application/handlers/update-settings.handler.ts:24:26:
      24 │     let aggregate = await this.repo.getSettings(command.workspaceId);
         ╵                           ~~~~~~~~~


✘ [ERROR] TS2673: Constructor of class 'WorkspaceId' is private and only accessible within the class declaration. [plugin angular-compiler]

    src/app/modules/settings/application/handlers/update-settings.handler.ts:27:73:
      27 │ ...create(command.workspaceId, new WorkspaceId(command.workspaceId));
         ╵                                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@domain/repositories/settings.repository' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/settings/application/stores/settings.store.ts:3:35:
      3 │ ...ttingsRepository } from '@domain/repositories/settings.repository';
        ╵                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS18046: 'repo' is of type 'unknown'. [plugin angular-compiler]

    src/app/modules/settings/application/stores/settings.store.ts:31:20:
      31 │                     repo.getSettings(workspaceId).then((entity: Wo...
         ╵                     ~~~~


✘ [ERROR] TS2341: Property 'value' is private and only accessible within class 'WorkspaceId'. [plugin angular-compiler]

    src/app/modules/settings/application/stores/settings.store.ts:36:60:
      36 │                             workspaceId: entity.workspaceId.value,
         ╵                                                             ~~~~~


✘ [ERROR] TS2322: Type 'unknown' is not assignable to type 'WorkspaceSettingsViewModel | null | undefined'. [plugin angular-compiler]

    src/app/modules/settings/application/stores/settings.store.ts:51:60:
      51 │ ...xt: (settings) => patchState(store, { settings, loading: false }),
         ╵                                          ~~~~~~~~


✘ [ERROR] TS2345: Argument of type '{ value: string; }' is not assignable to parameter of type 'SettingsId'.
  Property 'equals' is missing in type '{ value: string; }' but required in type 'SettingsId'. [plugin angular-compiler]

    src/app/modules/settings/domain/aggregates/workspace-settings.aggregate.ts:24:46:
      24 │ ...return new WorkspaceSettingsAggregate({ value: id }, workspaceId);
         ╵                                          ~~~~~~~~~~~~~

  'equals' is declared here.

    src/app/modules/settings/domain/value-objects/settings-id.vo.ts:26:11:
      26 │     public equals(other: SettingsId): boolean {
         ╵            ~~~~~~


✘ [ERROR] TS2345: Argument of type '{ value: string; }' is not assignable to parameter of type 'SettingsId'.
  Property 'equals' is missing in type '{ value: string; }' but required in type 'SettingsId'. [plugin angular-compiler]

    src/app/modules/settings/domain/aggregates/workspace-settings.aggregate.ts:34:12:
      34 │             { value: id },
         ╵             ~~~~~~~~~~~~~

  'equals' is declared here.

    src/app/modules/settings/domain/value-objects/settings-id.vo.ts:26:11:
      26 │     public equals(other: SettingsId): boolean {
         ╵            ~~~~~~


✘ [ERROR] TS2673: Constructor of class 'WorkspaceId' is private and only accessible within the class declaration. [plugin angular-compiler]

    src/app/modules/settings/domain/aggregates/workspace-settings.aggregate.ts:35:12:
      35 │             new WorkspaceId(workspaceId)
         ╵             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@settings/domain/value-objects/setting-key.vo' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/settings/domain/entities/module-config.entity.ts:2:27:
      2 │ ... SettingKey } from '@settings/domain/value-objects/setting-key.vo';
        ╵                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@settings/domain/value-objects/setting-value.vo' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/settings/domain/entities/module-config.entity.ts:3:29:
      3 │ ...tingValue } from '@settings/domain/value-objects/setting-value.vo';
        ╵                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] Could not resolve "./events/settings-updated.event"

    src/app/modules/settings/domain/index.ts:4:14:
      4 │ export * from './events/settings-updated.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/settings-updated.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/settings/domain/index.ts:4:14:
      4 │ export * from './events/settings-updated.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2341: Property 'value' is private and only accessible within class 'WorkspaceId'. [plugin angular-compiler]

    src/app/modules/settings/infrastructure/mappers/workspace-settings.mapper.ts:48:44:
      48 │             workspaceId: domain.workspaceId.value,
         ╵                                             ~~~~~


✘ [ERROR] TS2341: Property 'value' is private and only accessible within class 'WorkspaceId'. [plugin angular-compiler]

    src/app/modules/settings/infrastructure/repositories/settings.repository.ts:26:79:
      26 │ ...irestore, `${this.collectionName}/${settings.workspaceId.value}`),
         ╵                                                             ~~~~~


✘ [ERROR] TS2305: Module '"@settings/application/stores/settings.store"' has no exported member 'TaskPriority'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:25:2:
      25 │   TaskPriority,
         ╵   ~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'hasWorkspaceSettings' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:71:29:
      71 │           @if (settingsStore.hasWorkspaceSettings()) {
         ╵                              ~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'workspaceSettings' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:79:34:
      79 │ ...         settingsStore.workspaceSettings()?.workingHours?.start ??
         ╵                           ~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'workspaceSettings' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:91:34:
      91 │ ...           settingsStore.workspaceSettings()?.workingHours?.end ??
         ╵                             ~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'workspaceSettings' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:105:41:
      105 │ ...            [value]="settingsStore.workspaceSettings()?.timezone"
          ╵                                       ~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'workspaceSettings' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:120:34:
      120 │ ...           settingsStore.workspaceSettings()?.defaultTaskPriority
          ╵                             ~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'workspaceSettings' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:140:34:
      140 │ ...           settingsStore.workspaceSettings()?.enableNotifications
          ╵                             ~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'workspaceSettings' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:151:34:
      151 │ ...          settingsStore.workspaceSettings()?.enableAutoAssignment
          ╵                            ~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'hasUserPreferences' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:169:29:
      169 │           @if (settingsStore.hasUserPreferences()) {
          ╵                              ~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'userPreferences' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:188:43:
      188 │ ...         [checked]="settingsStore.userPreferences()?.compactMode"
          ╵                                      ~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'userPreferences' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:200:41:
      200 │ ...              [value]="settingsStore.userPreferences()?.language"
          ╵                                         ~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'userPreferences' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:216:34:
      216 │ ...              settingsStore.userPreferences()?.showCompletedTasks
          ╵                                ~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'setWorkspaceSettings' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:294:23:
      294 │     this.settingsStore.setWorkspaceSettings({
          ╵                        ~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2551: Property 'clearSettings' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. Did you mean 'loadSettings'? [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:304:27:
      304 │         this.settingsStore.clearSettings();
          ╵                            ~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'workspaceSettings' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:311:39:
      311 │     const current = this.settingsStore.workspaceSettings();
          ╵                                        ~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'updateWorkspaceSettings' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:314:23:
      314 │     this.settingsStore.updateWorkspaceSettings({
          ╵                        ~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'updateWorkspaceSettings' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:324:23:
      324 │     this.settingsStore.updateWorkspaceSettings({ timezone: value });
          ╵                        ~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'updateWorkspaceSettings' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:329:23:
      329 │     this.settingsStore.updateWorkspaceSettings({ defaultTaskPrior...
          ╵                        ~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'updateWorkspaceSettings' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:334:23:
      334 │     this.settingsStore.updateWorkspaceSettings({
          ╵                        ~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'updateWorkspaceSettings' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:341:23:
      341 │     this.settingsStore.updateWorkspaceSettings({
          ╵                        ~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'setUserPreferences' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:347:23:
      347 │     this.settingsStore.setUserPreferences({
          ╵                        ~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'updateUserPreferences' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:356:23:
      356 │     this.settingsStore.updateUserPreferences({ theme: this.theme ...
          ╵                        ~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'updateUserPreferences' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:361:23:
      361 │     this.settingsStore.updateUserPreferences({ language: value });
          ╵                        ~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'updateUserPreferences' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:366:23:
      366 │     this.settingsStore.updateUserPreferences({ compactMode: check...
          ╵                        ~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'updateUserPreferences' does not exist on type '{ settings: Signal<WorkspaceSettingsViewModel | null>; loading: Signal<boolean>; error: Signal<string | null>; loadSettings: RxMethod<...>; } & StateSource<...>'. [plugin angular-compiler]

    src/app/modules/settings/presentation/pages/settings.component.ts:371:23:
      371 │     this.settingsStore.updateUserPreferences({ showCompletedTasks...
          ╵                        ~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@quality-control/application/handlers/submit-task-for-qc.handler' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/tasks/application/facades/tasks.facade.ts:11:39:
      11 │ ...er } from '@quality-control/application/handlers/submit-task-fo...
         ╵              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2554: Expected 3 arguments, but got 1. [plugin angular-compiler]

    src/app/modules/tasks/application/facades/tasks.facade.ts:68:17:
      68 │     const task = createTask({
         ╵                  ~~~~~~~~~~

  An argument for 'workspaceId' was not provided.

    src/app/modules/tasks/domain/aggregates/task.aggregate.ts:118:4:
      118 │     workspaceId: WorkspaceId,
          ╵     ~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2322: Type 'WorkspaceId' is not assignable to type 'string'. [plugin angular-compiler]

    src/app/modules/tasks/application/facades/tasks.facade.ts:78:6:
      78 │       workspaceId: task.workspaceId,
         ╵       ~~~~~~~~~~~

  The expected type comes from property 'workspaceId' which is declared here on type 'CreateTaskCommand'

    src/app/modules/tasks/application/commands/create-task.command.ts:6:2:
      6 │   workspaceId: string;
        ╵   ~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'createdById' does not exist on type 'TaskAggregate'. [plugin angular-compiler]

    src/app/modules/tasks/application/facades/tasks.facade.ts:82:24:
      82 │       createdById: task.createdById,
         ╵                         ~~~~~~~~~~~


✘ [ERROR] TS2339: Property 'success' does not exist on type 'TaskAggregate'. [plugin angular-compiler]

    src/app/modules/tasks/application/facades/tasks.facade.ts:85:18:
      85 │     return result.success;
         ╵                   ~~~~~~~


✘ [ERROR] TS2571: Object is of type 'unknown'. [plugin angular-compiler]

    src/app/modules/tasks/application/facades/tasks.facade.ts:92:10:
      92 │     await this.submitTaskForQCHandler.execute({
         ╵           ~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2322: Type 'TaskId' is not assignable to type 'string'. [plugin angular-compiler]

    src/app/modules/tasks/application/facades/tasks.facade.ts:105:6:
      105 │       taskId: task.id,
          ╵       ~~~~~~

  The expected type comes from property 'taskId' which is declared here on type 'FailQCRequest'

    src/app/modules/quality-control/application/handlers/fail-qc.handler.ts:9:11:
      9 │   readonly taskId: string;
        ╵            ~~~~~~


✘ [ERROR] TS2322: Type 'TaskId' is not assignable to type 'string'. [plugin angular-compiler]

    src/app/modules/tasks/application/facades/tasks.facade.ts:122:6:
      122 │       taskId: task.id,
          ╵       ~~~~~~

  The expected type comes from property 'taskId' which is declared here on type 'ResolveIssueRequest'

    src/app/modules/issues/application/handlers/resolve-issue.handler.ts:9:11:
      9 │   readonly taskId: string;
        ╵            ~~~~~~


✘ [ERROR] TS2554: Expected 2-3 arguments, but got 1. [plugin angular-compiler]

    src/app/modules/tasks/application/handlers/approve-task.handler.ts:45:20:
      45 │       const event = createAcceptanceApprovedEvent({
         ╵                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  An argument for 'correlationId' was not provided.

    src/app/events/acceptance/acceptance.events.ts:58:116:
      58 │ ...feedback?: string }, correlationId: string, causationId?: strin...
         ╵                         ~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2554: Expected 2-3 arguments, but got 1. [plugin angular-compiler]

    src/app/modules/tasks/application/handlers/reject-task.handler.ts:45:20:
      45 │       const event = createAcceptanceRejectedEvent({
         ╵                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  An argument for 'correlationId' was not provided.

    src/app/events/acceptance/acceptance.events.ts:62:116:
      62 │ ...reasons: string[] }, correlationId: string, causationId?: strin...
         ╵                         ~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@tasks/domain"' has no exported member 'updateTaskStatus'. [plugin angular-compiler]

    src/app/modules/tasks/application/handlers/tasks.event-handlers.ts:2:33:
      2 │ ... { createTask, TaskStatus, updateTaskStatus } from '@tasks/domain';
        ╵                               ~~~~~~~~~~~~~~~~


✘ [ERROR] TS2724: '"@events"' has no exported member named 'IssueResolvedEvent'. Did you mean 'IssueResolved'? [plugin angular-compiler]

    src/app/modules/tasks/application/handlers/tasks.event-handlers.ts:4:2:
      4 │   IssueResolvedEvent,
        ╵   ~~~~~~~~~~~~~~~~~~

  'IssueResolved' is declared here.

    src/app/events/issues/issues.events.ts:21:13:
      21 │ export class IssueResolved implements DomainEvent<{ issueId: strin...
         ╵              ~~~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@events"' has no exported member 'QCFailedEvent'. [plugin angular-compiler]

    src/app/modules/tasks/application/handlers/tasks.event-handlers.ts:5:2:
      5 │   QCFailedEvent,
        ╵   ~~~~~~~~~~~~~


✘ [ERROR] TS2724: '"@events"' has no exported member named 'TaskCreatedEvent'. Did you mean 'TaskCreated'? [plugin angular-compiler]

    src/app/modules/tasks/application/handlers/tasks.event-handlers.ts:6:2:
      6 │   TaskCreatedEvent,
        ╵   ~~~~~~~~~~~~~~~~

  'TaskCreated' is declared here.

    src/app/events/tasks/tasks.events.ts:5:13:
      5 │ export class TaskCreated implements DomainEvent<{ taskId: string; t...
        ╵              ~~~~~~~~~~~


✘ [ERROR] TS2305: Module '"@events"' has no exported member 'TaskSubmittedForQCEvent'. [plugin angular-compiler]

    src/app/modules/tasks/application/handlers/tasks.event-handlers.ts:7:2:
      7 │   TaskSubmittedForQCEvent,
        ╵   ~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2554: Expected 3 arguments, but got 1. [plugin angular-compiler]

    src/app/modules/tasks/application/handlers/tasks.event-handlers.ts:17:17:
      17 │     const task = createTask({
         ╵                  ~~~~~~~~~~

  An argument for 'workspaceId' was not provided.

    src/app/modules/tasks/domain/aggregates/task.aggregate.ts:118:4:
      118 │     workspaceId: WorkspaceId,
          ╵     ~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2367: This comparison appears to be unintentional because the types 'TaskId' and 'string' have no overlap. [plugin angular-compiler]

    src/app/modules/tasks/application/handlers/tasks.event-handlers.ts:34:21:
      34 │         .find((t) => t.id === event.aggregateId);
         ╵                      ~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2367: This comparison appears to be unintentional because the types 'TaskId' and 'string' have no overlap. [plugin angular-compiler]

    src/app/modules/tasks/application/handlers/tasks.event-handlers.ts:46:19:
      46 │       .find((t) => t.id === event.aggregateId);
         ╵                    ~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2345: Argument of type 'TaskId' is not assignable to parameter of type 'string'. [plugin angular-compiler]

    src/app/modules/tasks/application/handlers/tasks.event-handlers.ts:71:30:
      71 │         tasksStore.updateTask(updatedTask.id, updatedTask);
         ╵                               ~~~~~~~~~~~~~~


✘ [ERROR] TS4115: This parameter property must have an 'override' modifier because it overrides a member in base class 'Entity<any>'. [plugin angular-compiler]

    src/app/modules/tasks/domain/entities/subtask.entity.ts:13:8:
      13 │         public readonly id: string,
         ╵         ~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '../../value-objects/task-id.vo' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/tasks/domain/entities/task-dependency.entity.ts:2:23:
      2 │ import { TaskId } from '../../value-objects/task-id.vo';
        ╵                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] Could not resolve "./events/task-completed.event"

    src/app/modules/tasks/domain/index.ts:4:14:
      4 │ export * from './events/task-completed.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/task-completed.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/tasks/domain/index.ts:4:14:
      4 │ export * from './events/task-completed.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] Could not resolve "./events/task-created.event"

    src/app/modules/tasks/domain/index.ts:5:14:
      5 │ export * from './events/task-created.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/task-created.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/tasks/domain/index.ts:5:14:
      5 │ export * from './events/task-created.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] Could not resolve "./events/task-deleted.event"

    src/app/modules/tasks/domain/index.ts:6:14:
      6 │ export * from './events/task-deleted.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/task-deleted.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/tasks/domain/index.ts:6:14:
      6 │ export * from './events/task-deleted.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] Could not resolve "./events/task-submitted-for-qc.event"

    src/app/modules/tasks/domain/index.ts:7:14:
      7 │ export * from './events/task-submitted-for-qc.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/task-submitted-for-qc.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/tasks/domain/index.ts:7:14:
      7 │ export * from './events/task-submitted-for-qc.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] Could not resolve "./events/task-updated.event"

    src/app/modules/tasks/domain/index.ts:8:14:
      8 │ export * from './events/task-updated.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module './events/task-updated.event' or its corresponding type declarations. [plugin angular-compiler]

    src/app/modules/tasks/domain/index.ts:8:14:
      8 │ export * from './events/task-updated.event';
        ╵               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2365: Operator '<' cannot be applied to types 'Date' and 'number'. [plugin angular-compiler]

    src/app/modules/tasks/domain/policies/task.policy.ts:144:9:
      144 │   return task.dueDate < now.getTime();
          ╵          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2416: Property 'findById' in type 'TaskRepositoryImpl' is not assignable to the same property in base type 'TaskRepository'.
  Type '(id: TaskId) => Promise<TaskAggregate | undefined>' is not assignable to type '(id: TaskId) => Promise<TaskAggregate | null>'.
    Type 'Promise<TaskAggregate | undefined>' is not assignable to type 'Promise<TaskAggregate | null>'.
      Type 'TaskAggregate | undefined' is not assignable to type 'TaskAggregate | null'.
        Type 'undefined' is not assignable to type 'TaskAggregate | null'. [plugin angular-compiler]

    src/app/modules/tasks/infrastructure/repositories/task.repository.impl.ts:32:8:
      32 │   async findById(id: TaskId): Promise<TaskAggregate | undefined> {
         ╵         ~~~~~~~~


✘ [ERROR] TS2345: Argument of type 'TaskId' is not assignable to parameter of type 'string'. [plugin angular-compiler]

    src/app/modules/tasks/infrastructure/repositories/task.repository.impl.ts:125:32:
      125 │     await setDoc(this.getDocRef(task.id), task);
          ╵                                 ~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@presentation/pages/settings' or its corresponding type declarations. [plugin angular-compiler]

    src/app/presentation/app.routes.ts:66:13:
      66 │       import('@presentation/pages/settings').then((m) => m.Setting...
         ╵              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@application/events/module-events' or its corresponding type declarations. [plugin angular-compiler]

    src/app/presentation/components/module-event-helper.ts:28:7:
      28 │ } from '@application/events/module-events';
         ╵        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2307: Cannot find module '@application/facades/settings.facade' or its corresponding type declarations. [plugin angular-compiler]

    src/app/presentation/components/theme-toggle.component.ts:8:31:
      8 │ import { SettingsFacade } from '@application/facades/settings.facade';
        ╵                                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


✘ [ERROR] TS2571: Object is of type 'unknown'. [plugin angular-compiler]

    src/app/presentation/components/theme-toggle.component.ts:27:22:
      27 │       (click)="facade.toggleTheme()"
         ╵                       ~~~~~~~~~~~


✘ [ERROR] TS2571: Object is of type 'unknown'. [plugin angular-compiler]

    src/app/presentation/components/theme-toggle.component.ts:30:20:
      30 │         @if (facade.isDark()) {
         ╵                     ~~~~~~


✘ [ERROR] TS2571: Object is of type 'unknown'. [plugin angular-compiler]

    src/app/presentation/components/theme-toggle.component.ts:47:21:
      47 │       const isDark = this.facade.isDark();
         ╵                      ~~~~~~~~~~~


✘ [ERROR] NG5002: Unexpected closing tag "div". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags [plugin angular-compiler]

    src/app/template-core/presentation/pages/template-list-page/template-list-page.component.ts:76:10:
      76 │           </div>
         ╵           ~~~~~~


Watch mode enabled. Watching for file changes...
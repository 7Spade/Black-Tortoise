# 基於 Workspace + Modules 的 Event-Driven DDD 架構調整

## 一、調整後的交互順序

### **多租戶 Workspace 環境下的事件流**

```
用戶請求 (帶 workspaceId)
    ↓
【Presentation Layer - Feature Module】
    ↓
DocumentsModule Component
    ↓
    inject(DocumentService) ← 注入應用服務
    ↓
【Application Layer】
    ↓
Command: CreateDocument
    payload: { workspaceId, title, content }
    ↓
Command Bus (路由到對應 Handler)
    ↓
CreateDocumentHandler
    ↓
    1. 驗證權限 (透過 PermissionsModule)
    2. 驗證 Workspace 存在
    3. 載入 Document Aggregate
    4. 執行業務邏輯
    ↓
【Domain Layer】
    ↓
Document Aggregate
    ↓
    產生事件: DocumentCreated
        metadata: {
            workspaceId: "ws-123",  ← 加入 workspace 上下文
            moduleType: "documents",
            correlationId: "...",
            causationId: "..."
        }
    ↓
【Infrastructure Layer】
    ↓
Repository.save()
    ↓
    ├→ Event Store.append() ← 按 workspaceId 分區
    └→ Event Bus.publish()
         ↓
    Event 分發到多個模塊
         ↓
    ┌────────┼────────┐
    ↓        ↓        ↓
Audit    Daily    Overview
Module   Module   Module
Handler  Handler  Handler
    ↓        ↓        ↓
記錄日誌  更新統計  刷新總覽
```

### **跨模塊事件通訊範例**

```
TasksModule: 任務完成
    ↓
Event: TaskCompleted
    metadata: {
        workspaceId: "ws-123",
        moduleType: "tasks"
    }
    ↓
Event Bus 分發
    ↓
    ┌─────────┼─────────┬─────────┐
    ↓         ↓         ↓         ↓
DailyModule  QCModule  AuditModule OverviewModule
    ↓         ↓         ↓         ↓
記錄日報    觸發質檢   記錄審計   更新儀表板
```

## 二、調整後的資料夾架構

```
src/
├── app/
│   │
│   ├── domain/                                 # 領域層 (Domain Layer)
│   │   │
│   │   ├── shared/                            # 跨模塊共享領域概念
│   │   │   ├── aggregates/
│   │   │   │   └── workspace/
│   │   │   │       ├── workspace.aggregate.ts
│   │   │   │       ├── workspace-member.entity.ts
│   │   │   │       └── workspace-settings.value-object.ts
│   │   │   │
│   │   │   ├── entities/
│   │   │   │   └── base/
│   │   │   │       ├── aggregate-root.base.ts
│   │   │   │       ├── entity.base.ts
│   │   │   │       └── auditable.entity.ts
│   │   │   │
│   │   │   ├── value-objects/
│   │   │   │   ├── workspace-id.value-object.ts
│   │   │   │   ├── module-type.value-object.ts
│   │   │   │   ├── permission.value-object.ts
│   │   │   │   ├── money.value-object.ts
│   │   │   │   └── date-range.value-object.ts
│   │   │   │
│   │   │   ├── events/                        # 共享事件基礎 ★
│   │   │   │   ├── base/
│   │   │   │   │   ├── domain-event.base.ts
│   │   │   │   │   ├── workspace-event.base.ts
│   │   │   │   │   ├── integration-event.base.ts
│   │   │   │   │   ├── event-metadata.interface.ts
│   │   │   │   │   ├── event-payload.interface.ts
│   │   │   │   │   └── event-lifecycle.interface.ts
│   │   │   │   │
│   │   │   │   └── workspace/                 # Workspace 相關事件
│   │   │   │       ├── workspace-created.event.ts
│   │   │   │       ├── workspace-archived.event.ts
│   │   │   │       └── member-added.event.ts
│   │   │   │
│   │   │   ├── event-sourcing/                # Event Sourcing 基礎 ★
│   │   │   │   ├── event-sourced-aggregate.base.ts
│   │   │   │   ├── snapshot.interface.ts
│   │   │   │   └── causality-tracker.ts
│   │   │   │
│   │   │   ├── repositories/                  # 倉儲接口
│   │   │   │   └── workspace.repository.interface.ts
│   │   │   │
│   │   │   ├── services/                      # 共享領域服務
│   │   │   │   └── permission-checker.service.ts
│   │   │   │
│   │   │   └── specifications/                # 規格模式
│   │   │       └── workspace-accessible.spec.ts
│   │   │
│   │   └── modules/                           # 各業務模塊的領域層 ★
│   │       │
│   │       ├── overview/
│   │       │   ├── aggregates/
│   │       │   │   └── dashboard.aggregate.ts
│   │       │   ├── value-objects/
│   │       │   │   └── statistic.value-object.ts
│   │       │   ├── events/
│   │       │   │   └── dashboard-refreshed.event.ts
│   │       │   └── repositories/
│   │       │       └── dashboard.repository.interface.ts
│   │       │
│   │       ├── documents/
│   │       │   ├── aggregates/
│   │       │   │   ├── document.aggregate.ts
│   │       │   │   └── document-version.entity.ts
│   │       │   ├── value-objects/
│   │       │   │   ├── document-status.value-object.ts
│   │       │   │   └── document-content.value-object.ts
│   │       │   ├── events/
│   │       │   │   ├── document-created.event.ts
│   │       │   │   ├── document-updated.event.ts
│   │       │   │   ├── document-deleted.event.ts
│   │       │   │   └── document-shared.event.ts
│   │       │   ├── repositories/
│   │       │   │   └── document.repository.interface.ts
│   │       │   ├── services/
│   │       │   │   └── document-version-manager.service.ts
│   │       │   └── specifications/
│   │       │       └── document-editable.spec.ts
│   │       │
│   │       ├── tasks/
│   │       │   ├── aggregates/
│   │       │   │   ├── task.aggregate.ts
│   │       │   │   └── task-comment.entity.ts
│   │       │   ├── value-objects/
│   │       │   │   ├── task-status.value-object.ts
│   │       │   │   ├── task-priority.value-object.ts
│   │       │   │   └── task-assignee.value-object.ts
│   │       │   ├── events/
│   │       │   │   ├── task-created.event.ts
│   │       │   │   ├── task-assigned.event.ts
│   │       │   │   ├── task-status-changed.event.ts
│   │       │   │   ├── task-completed.event.ts
│   │       │   │   └── task-comment-added.event.ts
│   │       │   ├── repositories/
│   │       │   │   └── task.repository.interface.ts
│   │       │   └── specifications/
│   │       │       ├── task-can-be-completed.spec.ts
│   │       │       └── task-can-be-assigned.spec.ts
│   │       │
│   │       ├── daily/
│   │       │   ├── aggregates/
│   │       │   │   └── daily-record.aggregate.ts
│   │       │   ├── value-objects/
│   │       │   │   └── record-date.value-object.ts
│   │       │   ├── events/
│   │       │   │   ├── daily-record-created.event.ts
│   │       │   │   └── daily-record-submitted.event.ts
│   │       │   └── repositories/
│   │       │       └── daily-record.repository.interface.ts
│   │       │
│   │       ├── quality-control/
│   │       │   ├── aggregates/
│   │       │   │   ├── inspection.aggregate.ts
│   │       │   │   └── inspection-item.entity.ts
│   │       │   ├── value-objects/
│   │       │   │   ├── inspection-status.value-object.ts
│   │       │   │   └── inspection-result.value-object.ts
│   │       │   ├── events/
│   │       │   │   ├── inspection-started.event.ts
│   │       │   │   ├── inspection-completed.event.ts
│   │       │   │   └── inspection-failed.event.ts
│   │       │   ├── repositories/
│   │       │   │   └── inspection.repository.interface.ts
│   │       │   └── services/
│   │       │       └── quality-checker.service.ts
│   │       │
│   │       ├── acceptance/
│   │       │   ├── aggregates/
│   │       │   │   └── acceptance.aggregate.ts
│   │       │   ├── value-objects/
│   │       │   │   └── acceptance-status.value-object.ts
│   │       │   ├── events/
│   │       │   │   ├── acceptance-requested.event.ts
│   │       │   │   ├── acceptance-approved.event.ts
│   │       │   │   └── acceptance-rejected.event.ts
│   │       │   └── repositories/
│   │       │       └── acceptance.repository.interface.ts
│   │       │
│   │       ├── issues/
│   │       │   ├── aggregates/
│   │       │   │   └── issue.aggregate.ts
│   │       │   ├── value-objects/
│   │       │   │   ├── issue-severity.value-object.ts
│   │       │   │   └── issue-status.value-object.ts
│   │       │   ├── events/
│   │       │   │   ├── issue-created.event.ts
│   │       │   │   ├── issue-assigned.event.ts
│   │       │   │   ├── issue-resolved.event.ts
│   │       │   │   └── issue-closed.event.ts
│   │       │   └── repositories/
│   │       │       └── issue.repository.interface.ts
│   │       │
│   │       ├── members/
│   │       │   ├── aggregates/
│   │       │   │   └── member.aggregate.ts
│   │       │   ├── value-objects/
│   │       │   │   └── member-role.value-object.ts
│   │       │   ├── events/
│   │       │   │   ├── member-invited.event.ts
│   │       │   │   ├── member-joined.event.ts
│   │       │   │   ├── member-role-changed.event.ts
│   │       │   │   └── member-removed.event.ts
│   │       │   └── repositories/
│   │       │       └── member.repository.interface.ts
│   │       │
│   │       ├── permissions/
│   │       │   ├── aggregates/
│   │       │   │   └── permission-policy.aggregate.ts
│   │       │   ├── value-objects/
│   │       │   │   ├── resource.value-object.ts
│   │       │   │   └── action.value-object.ts
│   │       │   ├── events/
│   │       │   │   ├── permission-granted.event.ts
│   │       │   │   └── permission-revoked.event.ts
│   │       │   ├── repositories/
│   │       │   │   └── permission-policy.repository.interface.ts
│   │       │   └── services/
│   │       │       └── authorization.service.ts
│   │       │
│   │       ├── audit/
│   │       │   ├── aggregates/
│   │       │   │   └── audit-log.aggregate.ts
│   │       │   ├── value-objects/
│   │       │   │   └── audit-action.value-object.ts
│   │       │   ├── events/
│   │       │   │   └── action-audited.event.ts
│   │       │   └── repositories/
│   │       │       └── audit-log.repository.interface.ts
│   │       │
│   │       └── settings/
│   │           ├── aggregates/
│   │           │   └── workspace-settings.aggregate.ts
│   │           ├── value-objects/
│   │           │   └── notification-preference.value-object.ts
│   │           ├── events/
│   │           │   ├── settings-updated.event.ts
│   │           │   └── notification-preference-changed.event.ts
│   │           └── repositories/
│   │               └── settings.repository.interface.ts
│   │
│   ├── application/                           # 應用層 (Application Layer)
│   │   │
│   │   ├── shared/                           # 共享應用邏輯
│   │   │   ├── commands/
│   │   │   │   └── workspace/
│   │   │   │       ├── create-workspace.command.ts
│   │   │   │       └── archive-workspace.command.ts
│   │   │   │
│   │   │   ├── command-handlers/
│   │   │   │   └── workspace/
│   │   │   │       ├── create-workspace.handler.ts
│   │   │   │       └── archive-workspace.handler.ts
│   │   │   │
│   │   │   ├── queries/
│   │   │   │   └── workspace/
│   │   │   │       ├── get-workspace.query.ts
│   │   │   │       └── list-workspaces.query.ts
│   │   │   │
│   │   │   ├── query-handlers/
│   │   │   │   └── workspace/
│   │   │   │       ├── get-workspace.handler.ts
│   │   │   │       └── list-workspaces.handler.ts
│   │   │   │
│   │   │   ├── event-handlers/               # 跨模塊事件處理 ★
│   │   │   │   └── workspace/
│   │   │   │       └── workspace-created.handler.ts
│   │   │   │
│   │   │   ├── dtos/
│   │   │   │   └── workspace.dto.ts
│   │   │   │
│   │   │   └── services/
│   │   │       └── workspace.service.ts
│   │   │
│   │   └── modules/                          # 各模塊的應用層 ★
│   │       │
│   │       ├── overview/
│   │       │   ├── queries/
│   │       │   │   ├── get-dashboard.query.ts
│   │       │   │   └── get-statistics.query.ts
│   │       │   ├── query-handlers/
│   │       │   │   ├── get-dashboard.handler.ts
│   │       │   │   └── get-statistics.handler.ts
│   │       │   ├── event-handlers/           # 監聽其他模塊事件 ★
│   │       │   │   └── integration/
│   │       │   │       ├── task-completed.handler.ts
│   │       │   │       ├── document-created.handler.ts
│   │       │   │       ├── issue-created.handler.ts
│   │       │   │       └── any-domain-event.handler.ts
│   │       │   ├── dtos/
│   │       │   │   ├── dashboard.dto.ts
│   │       │   │   └── statistics.dto.ts
│   │       │   └── services/
│   │       │       └── overview.service.ts
│   │       │
│   │       ├── documents/
│   │       │   ├── commands/
│   │       │   │   ├── create-document.command.ts
│   │       │   │   ├── update-document.command.ts
│   │       │   │   ├── delete-document.command.ts
│   │       │   │   └── share-document.command.ts
│   │       │   ├── command-handlers/
│   │       │   │   ├── create-document.handler.ts
│   │       │   │   ├── update-document.handler.ts
│   │       │   │   ├── delete-document.handler.ts
│   │       │   │   └── share-document.handler.ts
│   │       │   ├── queries/
│   │       │   │   ├── get-document.query.ts
│   │       │   │   ├── list-documents.query.ts
│   │       │   │   └── get-document-versions.query.ts
│   │       │   ├── query-handlers/
│   │       │   │   ├── get-document.handler.ts
│   │       │   │   ├── list-documents.handler.ts
│   │       │   │   └── get-document-versions.handler.ts
│   │       │   ├── event-handlers/
│   │       │   │   ├── domain/              # 處理本模塊事件
│   │       │   │   │   ├── document-created.handler.ts
│   │       │   │   │   └── document-updated.handler.ts
│   │       │   │   └── integration/         # 處理其他模塊事件
│   │       │   │       └── task-completed.handler.ts
│   │       │   ├── dtos/
│   │       │   │   ├── document.dto.ts
│   │       │   │   └── document-version.dto.ts
│   │       │   └── services/
│   │       │       └── documents.service.ts
│   │       │
│   │       ├── tasks/
│   │       │   ├── commands/
│   │       │   │   ├── create-task.command.ts
│   │       │   │   ├── assign-task.command.ts
│   │       │   │   ├── update-task-status.command.ts
│   │       │   │   ├── complete-task.command.ts
│   │       │   │   └── add-task-comment.command.ts
│   │       │   ├── command-handlers/
│   │       │   │   ├── create-task.handler.ts
│   │       │   │   ├── assign-task.handler.ts
│   │       │   │   ├── update-task-status.handler.ts
│   │       │   │   ├── complete-task.handler.ts
│   │       │   │   └── add-task-comment.handler.ts
│   │       │   ├── queries/
│   │       │   │   ├── get-task.query.ts
│   │       │   │   ├── list-tasks.query.ts
│   │       │   │   └── get-my-tasks.query.ts
│   │       │   ├── query-handlers/
│   │       │   │   ├── get-task.handler.ts
│   │       │   │   ├── list-tasks.handler.ts
│   │       │   │   └── get-my-tasks.handler.ts
│   │       │   ├── event-handlers/
│   │       │   │   ├── domain/
│   │       │   │   │   ├── task-created.handler.ts
│   │       │   │   │   └── task-completed.handler.ts
│   │       │   │   └── integration/
│   │       │   │       └── document-shared.handler.ts
│   │       │   ├── dtos/
│   │       │   │   └── task.dto.ts
│   │       │   └── services/
│   │       │       └── tasks.service.ts
│   │       │
│   │       ├── daily/
│   │       │   ├── commands/
│   │       │   │   ├── create-daily-record.command.ts
│   │       │   │   └── submit-daily-record.command.ts
│   │       │   ├── command-handlers/
│   │       │   │   ├── create-daily-record.handler.ts
│   │       │   │   └── submit-daily-record.handler.ts
│   │       │   ├── queries/
│   │       │   │   ├── get-daily-record.query.ts
│   │       │   │   └── list-daily-records.query.ts
│   │       │   ├── query-handlers/
│   │       │   │   ├── get-daily-record.handler.ts
│   │       │   │   └── list-daily-records.handler.ts
│   │       │   ├── event-handlers/
│   │       │   │   └── integration/         # 主要監聽其他模塊 ★
│   │       │   │       ├── task-completed.handler.ts
│   │       │   │       ├── document-created.handler.ts
│   │       │   │       ├── issue-created.handler.ts
│   │       │   │       └── inspection-completed.handler.ts
│   │       │   ├── dtos/
│   │       │   │   └── daily-record.dto.ts
│   │       │   └── services/
│   │       │       └── daily.service.ts
│   │       │
│   │       ├── quality-control/
│   │       │   ├── commands/
│   │       │   │   ├── start-inspection.command.ts
│   │       │   │   ├── complete-inspection.command.ts
│   │       │   │   └── fail-inspection.command.ts
│   │       │   ├── command-handlers/
│   │       │   │   ├── start-inspection.handler.ts
│   │       │   │   ├── complete-inspection.handler.ts
│   │       │   │   └── fail-inspection.handler.ts
│   │       │   ├── queries/
│   │       │   │   ├── get-inspection.query.ts
│   │       │   │   └── list-inspections.query.ts
│   │       │   ├── query-handlers/
│   │       │   │   ├── get-inspection.handler.ts
│   │       │   │   └── list-inspections.handler.ts
│   │       │   ├── event-handlers/
│   │       │   │   ├── domain/
│   │       │   │   │   └── inspection-completed.handler.ts
│   │       │   │   └── integration/
│   │       │   │       └── task-completed.handler.ts  ← 任務完成觸發質檢
│   │       │   ├── dtos/
│   │       │   │   └── inspection.dto.ts
│   │       │   └── services/
│   │       │       └── quality-control.service.ts
│   │       │
│   │       ├── acceptance/
│   │       │   ├── commands/
│   │       │   ├── command-handlers/
│   │       │   ├── queries/
│   │       │   ├── query-handlers/
│   │       │   ├── event-handlers/
│   │       │   ├── dtos/
│   │       │   └── services/
│   │       │
│   │       ├── issues/
│   │       │   ├── commands/
│   │       │   ├── command-handlers/
│   │       │   ├── queries/
│   │       │   ├── query-handlers/
│   │       │   ├── event-handlers/
│   │       │   ├── dtos/
│   │       │   └── services/
│   │       │
│   │       ├── members/
│   │       │   ├── commands/
│   │       │   ├── command-handlers/
│   │       │   ├── queries/
│   │       │   ├── query-handlers/
│   │       │   ├── event-handlers/
│   │       │   ├── dtos/
│   │       │   └── services/
│   │       │
│   │       ├── permissions/
│   │       │   ├── commands/
│   │       │   ├── command-handlers/
│   │       │   ├── queries/
│   │       │   ├── query-handlers/
│   │       │   ├── event-handlers/
│   │       │   ├── dtos/
│   │       │   └── services/
│   │       │
│   │       ├── audit/
│   │       │   ├── commands/
│   │       │   ├── command-handlers/
│   │       │   ├── queries/
│   │       │   │   ├── get-audit-logs.query.ts
│   │       │   │   └── search-audit-logs.query.ts
│   │       │   ├── query-handlers/
│   │       │   │   ├── get-audit-logs.handler.ts
│   │       │   │   └── search-audit-logs.handler.ts
│   │       │   ├── event-handlers/
│   │       │   │   └── integration/         # 監聽所有模塊事件 ★
│   │       │   │       └── any-domain-event.handler.ts
│   │       │   ├── dtos/
│   │       │   │   └── audit-log.dto.ts
│   │       │   └── services/
│   │       │       ├── audit.service.ts
│   │       │       └── audit-logger.service.ts
│   │       │
│   │       └── settings/
│   │           ├── commands/
│   │           ├── command-handlers/
│   │           ├── queries/
│   │           ├── query-handlers/
│   │           ├── event-handlers/
│   │           ├── dtos/
│   │           └── services/
│   │
│   ├── infrastructure/                        # 基礎設施層 (Infrastructure Layer)
│   │   │
│   │   ├── persistence/
│   │   │   │
│   │   │   ├── firestore/                    # Firestore 相關 ★
│   │   │   │   ├── config/
│   │   │   │   │   ├── firestore.config.ts
│   │   │   │   │   └── collections.const.ts
│   │   │   │   │
│   │   │   │   ├── base/
│   │   │   │   │   ├── firestore-repository.base.ts
│   │   │   │   │   └── workspace-scoped-repository.base.ts  ★
│   │   │   │   │
│   │   │   │   ├── converters/              # Firestore 數據轉換器
│   │   │   │   │   ├── document.converter.ts
│   │   │   │   │   ├── task.converter.ts
│   │   │   │   │   └── workspace.converter.ts
│   │   │   │   │
│   │   │   │   └── repositories/            # 各模塊倉儲實現
│   │   │   │       ├── workspace/
│   │   │   │       │   └── firestore-workspace.repository.ts
│   │   │   │       ├── documents/
│   │   │   │       │   └── firestore-document.repository.ts
│   │   │   │       ├── tasks/
│   │   │   │       │   └── firestore-task.repository.ts
│   │   │   │       ├── daily/
│   │   │   │       │   └── firestore-daily-record.repository.ts
│   │   │   │       ├── quality-control/
│   │   │   │       │   └── firestore-inspection.repository.ts
│   │   │   │       ├── acceptance/
│   │   │   │       ├── issues/
│   │   │   │       ├── members/
│   │   │   │       ├── permissions/
│   │   │   │       ├── audit/
│   │   │   │       └── settings/
│   │   │   │
│   │   │   ├── event-store/                 # Event Store 實現 ★
│   │   │   │   ├── event-store.interface.ts
│   │   │   │   ├── firestore-event-store.ts
│   │   │   │   ├── workspace-event-store.ts  ← Workspace 隔離
│   │   │   │   ├── event-serializer.service.ts
│   │   │   │   ├── event-deserializer.service.ts
│   │   │   │   ├── snapshot-store.service.ts
│   │   │   │   └── event-upcaster.service.ts  ← 事件版本升級
│   │   │   │
│   │   │   └── read-models/                 # CQRS 讀模型 ★
│   │   │       ├── base/
│   │   │       │   └── read-model.base.ts
│   │   │       ├── overview/
│   │   │       │   └── dashboard-read-model.service.ts
│   │   │       ├── documents/
│   │   │       │   └── document-read-model.service.ts
│   │   │       ├── tasks/
│   │   │       │   └── task-read-model.service.ts
│   │   │       └── audit/
│   │   │           └── audit-log-read-model.service.ts
│   │   │
│   │   ├── messaging/                        # 消息機制
│   │   │   │
│   │   │   ├── event-bus/                   # Event Bus 實現 ★
│   │   │   │   ├── event-bus.interface.ts
│   │   │   │   ├── in-memory-event-bus.service.ts
│   │   │   │   ├── workspace-event-bus.service.ts  ← Workspace 隔離
│   │   │   │   ├── event-dispatcher.service.ts
│   │   │   │   ├── event-registry.service.ts
│   │   │   │   ├── module-event-router.service.ts  ← 模塊路由
│   │   │   │   ├── subscription.ts
│   │   │   │   └── event-publisher.service.ts
│   │   │   │
│   │   │   ├── command-bus/
│   │   │   │   ├── command-bus.interface.ts
│   │   │   │   ├── in-memory-command-bus.service.ts
│   │   │   │   ├── command-dispatcher.service.ts
│   │   │   │   └── command-registry.service.ts
│   │   │   │
│   │   │   └── query-bus/
│   │   │       ├── query-bus.interface.ts
│   │   │       ├── in-memory-query-bus.service.ts
│   │   │       ├── query-dispatcher.service.ts
│   │   │       └── query-registry.service.ts
│   │   │
│   │   ├── context/                          # Context 管理 ★
│   │   │   ├── workspace-context.service.ts
│   │   │   ├── module-context.service.ts
│   │   │   ├── execution-context.service.ts
│   │   │   └── request-context.interceptor.ts
│   │   │
│   │   ├── causality/                        # 因果追蹤 ★
│   │   │   ├── correlation-context.service.ts
│   │   │   ├── causation-tracker.service.ts
│   │   │   ├── workspace-trace-logger.service.ts
│   │   │   └── trace-id-generator.service.ts
│   │   │
│   │   ├── integration/                      # 外部整合
│   │   │   ├── notification/
│   │   │   │   ├── email.adapter.ts
│   │   │   │   └── push-notification.adapter.ts
│   │   │   └── storage/
│   │   │       └── file-storage.adapter.ts
│   │   │
│   │   └── guards/                           # 守衛
│   │       ├── workspace-access.guard.ts
│   │       └── permission.guard.ts
│   │
│   └── presentation/                          # 表現層 (Presentation Layer)
│       │
│       ├── layout/                           # 佈局組件
│       │   ├── main-layout/
│       │   │   ├── main-layout.component.ts
│       │   │   └── main-layout.component.html
│       │   ├── workspace-layout/
│       │   │   ├── workspace-layout.component.ts
│       │   │   ├── workspace-layout.component.html
│       │   │   └── workspace-layout.signal-store.ts  ★
│       │   ├── header/
│       │   │   └── header.component.ts
│       │   ├── sidebar/
│       │   │   ├── sidebar.component.ts
│       │   │   └── sidebar.component.html
│       │   └── footer/
│       │       └── footer.component.ts
│       │
│       ├── modules/                          # 業務模塊 UI ★
│       │   │
│       │   ├── workspace/                    # Workspace 管理
│       │   │   ├── pages/
│       │   │   │   ├── workspace-list/
│       │   │   │   │   ├── workspace-list.component.ts
│       │   │   │   │   ├── workspace-list.component.html
│       │   │   │   │   └── workspace-list.signal-store.ts  ★
│       │   │   │   └── workspace-settings/
│       │   │   │       ├── workspace-settings.component.ts
│       │   │   │       └── workspace-settings.signal-store.ts  ★
│       │   │   ├── components/
│       │   │   │   ├── workspace-card/
│       │   │   │   └── create-workspace-dialog/
│       │   │   └── workspace.routes.ts
│       │   │
│       │   ├── overview/                     # 總覽模塊
│       │   │   ├── pages/
│       │   │   │   └── dashboard/
│       │   │   │       ├── dashboard.component.ts
│       │   │   │       ├── dashboard.component.html
│       │   │   │       └── dashboard.signal-store.ts  ★
│       │   │   ├── components/
│       │   │   │   ├── stat-card/
│       │   │   │   │   ├── stat-card.component.ts
│       │   │   │   │   └── stat-card.component.html
│       │   │   │   ├── activity-timeline/
│       │   │   │   │   ├── activity-timeline.component.ts
│       │   │   │   │   └── activity-timeline.component.html
│       │   │   │   ├── task-summary/
│       │   │   │   └── recent-documents/
│       │   │   └── overview.routes.ts
│       │   │
│       │   ├── documents/                    # 文件模塊
│       │   │   ├── pages/
│       │   │   │   ├── document-list/
│       │   │   │   │   ├── document-list.component.ts
│       │   │   │   │   ├── document-list.component.html
│       │   │   │   │   └── document-list.signal-store.ts  ★
│       │   │   │   └── document-detail/
│       │   │   │       ├── document-detail.component.ts
│       │   │   │       ├── document-detail.component.html
│       │   │   │       └── document-detail.signal-store.ts  ★
│       │   │   ├── components/
│       │   │   │   ├── document-card/
│       │   │   │   │   ├── document-card.component.ts
│       │   │   │   │   └── document-card.component.html
│       │   │   │   ├── document-editor/
│       │   │   │   │   ├── document-editor.component.ts
│       │   │   │   │   └── document-editor.component.html
│       │   │   │   ├── document-version-history/
│       │   │   │   └── document-share-dialog/
│       │   │   └── documents.routes.ts
│       │   │
│       │   ├── tasks/                        # 任務模塊
│       │   │   ├── pages/
│       │   │   │   ├── task-board/
│       │   │   │   │   ├── task-board.component.ts
│       │   │   │   │   ├── task-board.component.html
│       │   │   │   │   └── task-board.signal-store.ts  ★
│       │   │   │   ├── task-list/
│       │   │   │   │   ├── task-list.component.ts
│       │   │   │   │   └── task-list.signal-store.ts  ★
│       │   │   │   └── task-detail/
│       │   │   │       ├── task-detail.component.ts
│       │   │   │       └── task-detail.signal-store.ts  ★
│       │   │   ├── components/
│       │   │   │   ├── task-card/
│       │   │   │   │   ├── task-card.component.ts
│       │   │   │   │   └── task-card.component.html
│       │   │   │   ├── task-status-badge/
│       │   │   │   ├── task-priority-indicator/
│       │   │   │   ├── task-assignee-selector/
│       │   │   │   ├── task-comment-list/
│       │   │   │   └── create-task-dialog/
│       │   │   └── tasks.routes.ts
│       │   │
│       │   ├── daily/                        # 每日紀錄模塊
│       │   │   ├── pages/
│       │   │   │   └── daily-records/
│       │   │   │       ├── daily-records.component.ts
│       │   │   │       ├── daily-records.component.html
│       │   │   │       └── daily-records.signal-store.ts  ★
│       │   │   ├── components/
│       │   │   │   ├── daily-record-card/
│       │   │   │   ├── daily-record-form/
│       │   │   │   └── activity-summary/
│       │   │   └── daily.routes.ts
│       │   │
│       │   ├── quality-control/              # 質檢模塊
│       │   │   ├── pages/
│       │   │   │   ├── inspection-list/
│       │   │   │   │   ├── inspection-list.component.ts
│       │   │   │   │   └── inspection-list.signal-store.ts  ★
│       │   │   │   └── inspection-detail/
│       │   │   │       ├── inspection-detail.component.ts
│       │   │   │       └── inspection-detail.signal-store.ts  ★
│       │   │   ├── components/
│       │   │   │   ├── inspection-card/
│       │   │   │   ├── inspection-checklist/
│       │   │   │   └── quality-metrics/
│       │   │   └── quality-control.routes.ts
│       │   │
│       │   ├── acceptance/                   # 驗收模塊
│       │   │   ├── pages/
│       │   │   ├── components/
│       │   │   └── acceptance.routes.ts
│       │   │
│       │   ├── issues/                       # 問題單模塊
│       │   │   ├── pages/
│       │   │   │   ├── issue-list/
│       │   │   │   │   ├── issue-list.component.ts
│       │   │   │   │   └── issue-list.signal-store.ts  ★
│       │   │   │   └── issue-detail/
│       │   │   │       ├── issue-detail.component.ts
│       │   │   │       └── issue-detail.signal-store.ts  ★
│       │   │   ├── components/
│       │   │   │   ├── issue-card/
│       │   │   │   ├── severity-badge/
│       │   │   │   └── create-issue-dialog/
│       │   │   └── issues.routes.ts
│       │   │
│       │   ├── members/                      # 成員模塊
│       │   │   ├── pages/
│       │   │   │   └── member-list/
│       │   │   │       ├── member-list.component.ts
│       │   │   │       └── member-list.signal-store.ts  ★
│       │   │   ├── components/
│       │   │   │   ├── member-card/
│       │   │   │   ├── invite-member-dialog/
│       │   │   │   └── role-badge/
│       │   │   └── members.routes.ts
│       │   │
│       │   ├── permissions/                  # 權限模塊
│       │   │   ├── pages/
│       │   │   │   └── permission-management/
│       │   │   │       ├── permission-management.component.ts
│       │   │   │       └── permission-management.signal-store.ts  ★
│       │   │   ├── components/
│       │   │   │   ├── permission-matrix/
│       │   │   │   └── role-editor/
│       │   │   └── permissions.routes.ts
│       │   │
│       │   ├── audit/                        # 審計模塊
│       │   │   ├── pages/
│       │   │   │   └── audit-logs/
│       │   │   │       ├── audit-logs.component.ts
│       │   │   │       ├── audit-logs.component.html
│       │   │   │       └── audit-logs.signal-store.ts  ★
│       │   │   ├── components/
│       │   │   │   ├── audit-log-entry/
│       │   │   │   ├── audit-filter/
│       │   │   │   └── audit-timeline/
│       │   │   └── audit.routes.ts
│       │   │
│       │   └── settings/                     # 設置模塊
│       │       ├── pages/
│       │       │   └── workspace-settings/
│       │       │       ├── workspace-settings.component.ts
│       │       │       └── workspace-settings.signal-store.ts  ★
│       │       ├── components/
│       │       │   ├── general-settings/
│       │       │   ├── notification-settings/
│       │       │   └── integration-settings/
│       │       └── settings.routes.ts
│       │
│       ├── shared/                           # 共享 UI 組件
│       │   ├── components/
│       │   │   ├── ui/                       # Material Design 包裝
│       │   │   │   ├── button/
│       │   │   │   │   ├── button.component.ts
│       │   │   │   │   └── button.component.html
│       │   │   │   ├── card/
│       │   │   │   ├── dialog/
│       │   │   │   ├── table/
│       │   │   │   ├── form-field/
│       │   │   │   └── snackbar/
│       │   │   ├── common/
│       │   │   │   ├── loading-spinner/
│       │   │   │   │   ├── loading-spinner.component.ts
│       │   │   │   │   └── loading-spinner.component.html
│       │   │   │   ├── error-message/
│       │   │   │   ├── empty-state/
│       │   │   │   ├── confirmation-dialog/
│       │   │   │   └── breadcrumb/
│       │   │   └── domain/                   # 領域特定組件
│       │   │       ├── user-avatar/
│       │   │       ├── date-range-picker/
│       │   │       └── file-uploader/
│       │   ├── directives/
│       │   │   ├── permission.directive.ts
│       │   │   ├── loading.directive.ts
│       │   │   └── auto-focus.directive.ts
│       │   ├── pipes/
│       │   │   ├── relative-time.pipe.ts
│       │   │   ├── file-size.pipe.ts
│       │   │   └── highlight.pipe.ts
│       │   └── signals/                      # 共享 Signal Stores ★
│       │       ├── workspace.signal-store.ts
│       │       ├── auth.signal-store.ts
│       │       └── notification.signal-store.ts
│       │
│       └── app.routes.ts                     # 根路由
│
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

## 三、關鍵調整說明

### **1. Workspace Context 管理**

```
每個請求都帶有 Workspace 上下文

Request
    ↓
WorkspaceContextService (提取 workspaceId)
    ↓
所有 Domain Event 自動注入 workspaceId
    metadata: {
        workspaceId: "ws-123",
        moduleType: "documents",
        ...
    }
    ↓
Event Store 按 workspace 分區存儲
    /events/ws-123/documents/...
    ↓
Event Bus 按 workspace 隔離分發
```

### **2. 模塊間事件通訊**

```
TasksModule
    ↓
Event: TaskCompleted
    ↓
Event Bus (廣播到所有訂閱者)
    ↓
    ├→ DailyModule.IntegrationHandlers
    │   └→ TaskCompletedHandler (自動記錄到日報)
    │
    ├→ QualityControlModule.IntegrationHandlers
    │   └→ TaskCompletedHandler (觸發質檢流程)
    │
    ├→ AuditModule.IntegrationHandlers
    │   └→ AnyDomainEventHandler (記錄審計日誌)
    │
    └→ OverviewModule.ReadModel
        └→ 更新儀表板統計
```

### **3. ngrx/signals 純響應式狀態管理**

```
Component (純響應式)
    ↓
inject(DocumentListStore)  ← Signal Store
    ↓
Store Methods (產生 Commands)
    ↓
    store.loadDocuments(workspaceId)
    store.createDocument(data)
    store.updateDocument(id, data)
    ↓
Command Bus
    ↓
Command Handlers
    ↓
Domain Events
    ↓
Event Handlers 更新 Read Model
    ↓
Signal Store 自動反應 (computed signals)
    ↓
Component 自動重新渲染 (@if, @for)
```

### **4. 現代化控制流範例**

```typescript
<!-- document-list.component.html -->
<div class="document-list">
  <!-- 載入狀態 -->
  @if (store.loading()) {
    <app-loading-spinner />
  }

  <!-- 錯誤狀態 -->
  @if (store.error(); as error) {
    <app-error-message [error]="error" />
  }

  <!-- 文件列表 -->
  @if (store.documents(); as documents) {
    @if (documents.length > 0) {
      @for (document of documents; track document.id) {
        <app-document-card 
          [document]="document"
          (click)="store.selectDocument(document.id)"
        />
      } @empty {
        <app-empty-state message="尚無文件" />
      }
    }
  }

  <!-- 延遲載入詳情 -->
  @defer (when store.selectedDocument()) {
    <app-document-detail [document]="store.selectedDocument()!" />
  } @placeholder {
    <div>載入中...</div>
  }
</div>
```

## 四、核心架構特點總結

### **層級關係**

```
Workspace (邏輯容器)
    ↓
├─ Overview Module (總覽 - 聚合所有模塊數據)
├─ Documents Module (文件)
├─ Tasks Module (任務)
├─ Daily Module (每日紀錄 - 監聽其他模塊)
├─ QualityControl Module (質檢)
├─ Acceptance Module (驗收)
├─ Issues Module (問題單)
├─ Members Module (成員)
├─ Permissions Module (權限)
├─ Audit Module (審計 - 監聽所有模塊)
└─ Settings Module (設置)

每個 Module 獨立的:
    ├─ Domain (Aggregates, Events)
    ├─ Application (Commands, Queries, Handlers)
    ├─ Infrastructure (Repositories, Event Handlers)
    └─ Presentation (Components, Signal Stores)
```

### **事件驅動特性**

1. **模塊解耦**: 透過 Event Bus 實現模塊間鬆耦合
2. **自動化流程**: 如任務完成自動觸發質檢、記錄日報
3. **審計追蹤**: Audit Module 監聽所有事件
4. **總覽聚合**: Overview Module 訂閱各模塊事件更新儀表板
5. **Workspace 隔離**: 每個 workspace 的事件完全隔離

### **1. 四層架構清晰分離**

```
domain/          ← 純業務邏輯,無依賴
    ↓
application/     ← 用例協調,依賴 domain
    ↓
infrastructure/  ← 技術實現,依賴 domain + application
    ↓
presentation/    ← UI 層,依賴 application (透過 services)
```

### **2. Firestore + ngrx/signals 整合**

```
Presentation (Signal Store)
    ↓
Application Service
    ↓
Command/Query Bus
    ↓
Handler → Domain Aggregate
    ↓
Infrastructure Repository (Firestore)
    ↓
Event Store (Firestore) + Event Bus
    ↓
Read Model (Firestore) ← 更新
    ↓
Signal Store 自動反應 (computed)
```

### **3. 模塊化事件處理**

- **domain/modules/[module]/events/** - 事件定義
- **application/modules/[module]/event-handlers/** - 事件處理
  - **domain/** - 處理本模塊事件
  - **integration/** - 處理其他模塊事件

### **4. Workspace 上下文貫穿**

- **infrastructure/context/** - 上下文管理
- **infrastructure/persistence/firestore/base/workspace-scoped-repository.base.ts** - 自動注入 workspaceId
- **infrastructure/messaging/event-bus/workspace-event-bus.service.ts** - Workspace 隔離

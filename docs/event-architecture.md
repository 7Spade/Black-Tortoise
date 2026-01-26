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
│   ├── core/                                    # 核心層 (跨 workspace 共享)
│   │   │
│   │   ├── domain/                             # 領域層
│   │   │   ├── shared/                         # 共享領域概念
│   │   │   │   ├── aggregates/
│   │   │   │   │   └── workspace/              # Workspace 聚合根
│   │   │   │   │       ├── workspace.aggregate.ts
│   │   │   │   │       ├── workspace-member.entity.ts
│   │   │   │   │       └── workspace-settings.value-object.ts
│   │   │   │   │
│   │   │   │   ├── value-objects/
│   │   │   │   │   ├── workspace-id.value-object.ts
│   │   │   │   │   ├── module-type.value-object.ts
│   │   │   │   │   └── permission.value-object.ts
│   │   │   │   │
│   │   │   │   └── events/                     # 共享領域事件
│   │   │   │       ├── base/
│   │   │   │       │   ├── domain-event.base.ts
│   │   │   │       │   ├── workspace-event.base.ts  ★ 新增
│   │   │   │       │   ├── event-metadata.interface.ts
│   │   │   │       │   └── event-lifecycle.interface.ts
│   │   │   │       └── workspace/
│   │   │   │           ├── workspace-created.event.ts
│   │   │   │           └── member-added.event.ts
│   │   │   │
│   │   │   └── modules/                        # 各模塊的領域層 ★ 新增
│   │   │       ├── documents/
│   │   │       │   ├── aggregates/
│   │   │       │   │   ├── document.aggregate.ts
│   │   │       │   │   └── document-version.entity.ts
│   │   │       │   ├── value-objects/
│   │   │       │   │   └── document-status.value-object.ts
│   │   │       │   ├── events/
│   │   │       │   │   ├── document-created.event.ts
│   │   │       │   │   ├── document-updated.event.ts
│   │   │       │   │   └── document-deleted.event.ts
│   │   │       │   └── repositories/
│   │   │       │       └── document.repository.interface.ts
│   │   │       │
│   │   │       ├── tasks/
│   │   │       │   ├── aggregates/
│   │   │       │   │   └── task.aggregate.ts
│   │   │       │   ├── events/
│   │   │       │   │   ├── task-created.event.ts
│   │   │       │   │   ├── task-completed.event.ts
│   │   │       │   │   └── task-assigned.event.ts
│   │   │       │   └── repositories/
│   │   │       │       └── task.repository.interface.ts
│   │   │       │
│   │   │       ├── daily/
│   │   │       │   ├── aggregates/
│   │   │       │   │   └── daily-record.aggregate.ts
│   │   │       │   └── events/
│   │   │       │       └── daily-record-created.event.ts
│   │   │       │
│   │   │       ├── quality-control/
│   │   │       │   ├── aggregates/
│   │   │       │   │   └── inspection.aggregate.ts
│   │   │       │   └── events/
│   │   │       │       ├── inspection-started.event.ts
│   │   │       │       └── inspection-completed.event.ts
│   │   │       │
│   │   │       ├── acceptance/
│   │   │       │   ├── aggregates/
│   │   │       │   │   └── acceptance.aggregate.ts
│   │   │       │   └── events/
│   │   │       │       └── acceptance-approved.event.ts
│   │   │       │
│   │   │       ├── issues/
│   │   │       │   ├── aggregates/
│   │   │       │   │   └── issue.aggregate.ts
│   │   │       │   └── events/
│   │   │       │       ├── issue-created.event.ts
│   │   │       │       └── issue-resolved.event.ts
│   │   │       │
│   │   │       ├── members/
│   │   │       │   ├── aggregates/
│   │   │       │   │   └── member.aggregate.ts
│   │   │       │   └── events/
│   │   │       │       └── member-role-changed.event.ts
│   │   │       │
│   │   │       ├── permissions/
│   │   │       │   ├── aggregates/
│   │   │       │   │   └── permission-policy.aggregate.ts
│   │   │       │   └── events/
│   │   │       │       └── permission-granted.event.ts
│   │   │       │
│   │   │       ├── audit/
│   │   │       │   ├── aggregates/
│   │   │       │   │   └── audit-log.aggregate.ts
│   │   │       │   └── events/
│   │   │       │       └── action-audited.event.ts
│   │   │       │
│   │   │       └── settings/
│   │   │           ├── aggregates/
│   │   │           │   └── workspace-settings.aggregate.ts
│   │   │           └── events/
│   │   │               └── settings-updated.event.ts
│   │   │
│   │   ├── application/                        # 應用層
│   │   │   ├── shared/                         # 共享應用邏輯
│   │   │   │   ├── commands/
│   │   │   │   │   └── workspace/
│   │   │   │   ├── command-handlers/
│   │   │   │   └── event-handlers/            # 跨模塊事件處理
│   │   │   │       └── cross-module/
│   │   │   │           └── workspace-created.handler.ts
│   │   │   │
│   │   │   └── modules/                       # 各模塊的應用層 ★ 新增
│   │   │       ├── documents/
│   │   │       │   ├── commands/
│   │   │       │   │   ├── create-document.command.ts
│   │   │       │   │   ├── update-document.command.ts
│   │   │       │   │   └── delete-document.command.ts
│   │   │       │   ├── command-handlers/
│   │   │       │   │   ├── create-document.handler.ts
│   │   │       │   │   ├── update-document.handler.ts
│   │   │       │   │   └── delete-document.handler.ts
│   │   │       │   ├── queries/
│   │   │       │   │   ├── get-document.query.ts
│   │   │       │   │   └── list-documents.query.ts
│   │   │       │   ├── query-handlers/
│   │   │       │   │   ├── get-document.handler.ts
│   │   │       │   │   └── list-documents.handler.ts
│   │   │       │   ├── event-handlers/        # 本模塊事件處理
│   │   │       │   │   ├── domain/
│   │   │       │   │   │   └── document-created.handler.ts
│   │   │       │   │   └── integration/       # 接收其他模塊事件
│   │   │       │   │       └── task-completed.handler.ts
│   │   │       │   └── services/
│   │   │       │       └── documents.service.ts
│   │   │       │
│   │   │       ├── tasks/
│   │   │       │   ├── commands/
│   │   │       │   ├── command-handlers/
│   │   │       │   ├── queries/
│   │   │       │   ├── query-handlers/
│   │   │       │   ├── event-handlers/
│   │   │       │   │   ├── domain/
│   │   │       │   │   └── integration/
│   │   │       │   └── services/
│   │   │       │
│   │   │       ├── daily/
│   │   │       │   ├── event-handlers/
│   │   │       │   │   └── integration/      # 監聽其他模塊事件
│   │   │       │   │       ├── task-completed.handler.ts
│   │   │       │   │       ├── document-created.handler.ts
│   │   │       │   │       └── issue-created.handler.ts
│   │   │       │   └── services/
│   │   │       │
│   │   │       ├── quality-control/
│   │   │       │   ├── commands/
│   │   │       │   ├── event-handlers/
│   │   │       │   │   └── integration/
│   │   │       │   │       └── task-completed.handler.ts  ← 任務完成觸發質檢
│   │   │       │   └── services/
│   │   │       │
│   │   │       ├── acceptance/
│   │   │       ├── issues/
│   │   │       ├── members/
│   │   │       ├── permissions/
│   │   │       ├── audit/                    # 審計模塊 ★ 特殊
│   │   │       │   └── event-handlers/
│   │   │       │       └── integration/      # 監聽所有模塊事件
│   │   │       │           ├── any-domain-event.handler.ts
│   │   │       │           └── audit-logger.ts
│   │   │       │
│   │   │       └── settings/
│   │   │
│   │   └── infrastructure/                   # 基礎設施層
│   │       ├── persistence/
│   │       │   ├── repositories/
│   │       │   │   ├── firestore/
│   │       │   │   │   ├── base/
│   │       │   │   │   │   └── workspace-scoped.repository.ts  ★ 新增
│   │       │   │   │   ├── documents/
│   │       │   │   │   │   └── firestore-document.repository.ts
│   │       │   │   │   ├── tasks/
│   │       │   │   │   └── [其他模塊]...
│   │       │   │   └── in-memory/
│   │       │   │
│   │       │   ├── event-store/
│   │       │   │   ├── event-store.interface.ts
│   │       │   │   ├── firestore-event-store.ts
│   │       │   │   ├── workspace-event-store.ts  ★ 新增 (按 workspace 分區)
│   │       │   │   ├── event-serializer.ts
│   │       │   │   └── snapshot-store.ts
│   │       │   │
│   │       │   └── read-models/             # CQRS 讀模型
│   │       │       ├── documents/
│   │       │       │   └── document-read-model.ts
│   │       │       ├── tasks/
│   │       │       └── overview/            # 總覽模塊的讀模型
│   │       │           └── dashboard-read-model.ts
│   │       │
│   │       ├── messaging/
│   │       │   ├── event-bus/
│   │       │   │   ├── event-bus.interface.ts
│   │       │   │   ├── in-memory-event-bus.ts
│   │       │   │   ├── workspace-event-bus.ts  ★ 新增 (workspace 隔離)
│   │       │   │   ├── event-dispatcher.ts
│   │       │   │   ├── event-registry.ts
│   │       │   │   └── module-event-router.ts  ★ 新增 (模塊路由)
│   │       │   ├── command-bus/
│   │       │   └── query-bus/
│   │       │
│   │       ├── context/                      # Context 管理 ★ 新增
│   │       │   ├── workspace-context.service.ts
│   │       │   ├── module-context.service.ts
│   │       │   └── execution-context.ts
│   │       │
│   │       └── causality/
│   │           ├── correlation-context.ts
│   │           ├── causation-tracker.ts
│   │           └── workspace-trace-logger.ts  ★ 新增
│   │
│   ├── features/                             # 功能模塊 (Presentation Layer)
│   │   ├── workspace/                        # Workspace 容器
│   │   │   ├── workspace-shell.component.ts
│   │   │   ├── workspace-layout.component.ts
│   │   │   └── workspace-routing.module.ts
│   │   │
│   │   ├── overview/                         # OverviewModule
│   │   │   ├── pages/
│   │   │   │   └── dashboard/
│   │   │   │       ├── dashboard.component.ts
│   │   │   │       ├── dashboard.component.html
│   │   │   │       └── dashboard.signal-store.ts  ★ ngrx/signals
│   │   │   ├── components/
│   │   │   │   ├── stat-card/
│   │   │   │   └── activity-timeline/
│   │   │   └── overview-routing.module.ts
│   │   │
│   │   ├── documents/                        # DocumentsModule
│   │   │   ├── pages/
│   │   │   │   ├── document-list/
│   │   │   │   │   ├── document-list.component.ts
│   │   │   │   │   ├── document-list.component.html
│   │   │   │   │   └── document-list.signal-store.ts  ★
│   │   │   │   └── document-detail/
│   │   │   │       ├── document-detail.component.ts
│   │   │   │       └── document-detail.signal-store.ts  ★
│   │   │   ├── components/
│   │   │   │   ├── document-editor/
│   │   │   │   └── document-version-history/
│   │   │   └── documents-routing.module.ts
│   │   │
│   │   ├── tasks/                            # TasksModule
│   │   │   ├── pages/
│   │   │   │   ├── task-board/
│   │   │   │   │   ├── task-board.component.ts
│   │   │   │   │   └── task-board.signal-store.ts  ★
│   │   │   │   └── task-detail/
│   │   │   ├── components/
│   │   │   │   ├── task-card/
│   │   │   │   └── task-assignment/
│   │   │   └── tasks-routing.module.ts
│   │   │
│   │   ├── daily/                            # DailyModule
│   │   │   ├── pages/
│   │   │   │   └── daily-records/
│   │   │   │       ├── daily-records.component.ts
│   │   │   │       └── daily-records.signal-store.ts  ★
│   │   │   ├── components/
│   │   │   │   └── daily-record-card/
│   │   │   └── daily-routing.module.ts
│   │   │
│   │   ├── quality-control/                  # QualityControlModule
│   │   │   ├── pages/
│   │   │   │   └── inspections/
│   │   │   ├── components/
│   │   │   └── quality-control-routing.module.ts
│   │   │
│   │   ├── acceptance/                       # AcceptanceModule
│   │   ├── issues/                           # IssuesModule
│   │   ├── members/                          # MembersModule
│   │   ├── permissions/                      # PermissionsModule
│   │   ├── audit/                            # AuditModule
│   │   └── settings/                         # SettingsModule
│   │
│   └── shared/                               # 共享 UI 組件
│       ├── components/
│       │   ├── ui/                           # Material Design 包裝
│       │   │   ├── button/
│       │   │   ├── card/
│       │   │   └── dialog/
│       │   └── common/
│       │       ├── loading/
│       │       └── error/
│       ├── directives/
│       ├── pipes/
│       └── signals/                          # 共享 Signal Stores
│           └── workspace.signal-store.ts
│
└── environments/
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

這樣的架構完全契合你的需求，是否需要進一步細化某個部分?
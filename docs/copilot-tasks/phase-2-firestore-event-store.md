# Phase 2: Firestore Event Store (利用現有 @angular/fire)

> **注意**: 在開始此階段前，請確保 Phase 1: Workspace Context 自動注入 已經完成並通過驗證。

## 任務描述
實作 Firestore 版本的 Event Store, 按 workspace 分區儲存。

## 前提
根據報告, `app.config.ts` 已配置 Firebase。

---

## 實施步驟

### 步驟 1: 建立 Firestore Event Store
新檔案: `infrastructure/persistence/firestore/event-store/firestore-event-store.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
  CollectionReference
} from '@angular/fire/firestore';
import { EventStore } from '../../../../domain/event-store/event-store.interface';
import { DomainEvent } from '../../../../domain/event/domain-event';

/**
 * Firestore Event Store
 * 事件儲存結構: /workspaces/{workspaceId}/events/{eventId}
 */
@Injectable({
  providedIn: 'root'
})
export class FirestoreEventStore implements EventStore {
  private readonly firestore = inject(Firestore);

  /**
   * 附加事件到 Event Store
   * ✨ 自動按 workspaceId 分區
   */
  async append<TPayload>(event: DomainEvent<TPayload>): Promise<void> {
    const workspaceId = event.metadata?.workspaceId;
    if (!workspaceId) {
      console.warn('Event missing workspaceId, storing in global events');
    }

    const eventsCol = this.getEventsCollection(workspaceId || 'global');

    await addDoc(eventsCol, {
      // Event 基礎欄位
      eventId: event.eventId,
      type: event.type,
      aggregateId: event.aggregateId,
      correlationId: event.correlationId,
      causationId: event.causationId,
      timestamp: Timestamp.fromMillis(event.timestamp),
      
      // Metadata (新增)
      workspaceId: event.metadata?.workspaceId,
      moduleType: event.metadata?.moduleType,
      userId: event.metadata?.userId,
      version: event.metadata?.version || 1,
      
      // Payload
      payload: event.payload,
      
      // 完整 metadata 備份 (用於事件回放)
      _rawMetadata: event.metadata
    });
  }

  /**
   * 批次附加事件
   */
  async appendBatch<TPayload>(events: DomainEvent<TPayload>[]): Promise<void> {
    // 簡化版: 逐一儲存
    // TODO: 使用 Firestore batch write 優化
    for (const event of events) {
      await this.append(event);
    }
  }

  /**
   * 查詢事件: 按 Aggregate ID
   */
  async getEventsByAggregateId(aggregateId: string): Promise<DomainEvent<unknown>[]> {
    // ⚠️ 這裡需要知道 workspaceId, 簡化版先搜尋 global
    // TODO: 改為需要傳入 workspaceId 參數
    const eventsCol = this.getEventsCollection('global');
    const q = query(
      eventsCol,
      where('aggregateId', '==', aggregateId),
      orderBy('timestamp', 'asc')
    );

    return this.executeQuery(q);
  }

  /**
   * 查詢事件: 按 Causality (correlationId)
   */
  async getEventsByCorrelationId(correlationId: string): Promise<DomainEvent<unknown>[]> {
    const eventsCol = this.getEventsCollection('global');
    const q = query(
      eventsCol,
      where('correlationId', '==', correlationId),
      orderBy('timestamp', 'asc')
    );

    return this.executeQuery(q);
  }

  /**
   * 查詢事件: 按類型
   */
  async getEventsByType(type: string): Promise<DomainEvent<unknown>[]> {
    const eventsCol = this.getEventsCollection('global');
    const q = query(
      eventsCol,
      where('type', '==', type),
      orderBy('timestamp', 'asc')
    );

    return this.executeQuery(q);
  }

  /**
   * 查詢事件: 按時間範圍
   */
  async getEventsByTimeRange(
    startTime: number,
    endTime: number
  ): Promise<DomainEvent<unknown>[]> {
    const eventsCol = this.getEventsCollection('global');
    const q = query(
      eventsCol,
      where('timestamp', '>=', Timestamp.fromMillis(startTime)),
      where('timestamp', '<=', Timestamp.fromMillis(endTime)),
      orderBy('timestamp', 'asc')
    );

    return this.executeQuery(q);
  }

  /**
   * ✨ 新增: 按 Workspace 查詢所有事件
   */
  async getEventsByWorkspace(
    workspaceId: string,
    options?: {
      moduleType?: string;
      eventType?: string;
      fromTimestamp?: number;
      toTimestamp?: number;
    }
  ): Promise<DomainEvent<unknown>[]> {
    const eventsCol = this.getEventsCollection(workspaceId);
    let q = query(eventsCol, orderBy('timestamp', 'asc'));

    if (options?.moduleType) {
      q = query(q, where('moduleType', '==', options.moduleType));
    }
    if (options?.eventType) {
      q = query(q, where('type', '==', options.eventType));
    }
    if (options?.fromTimestamp) {
      q = query(q, where('timestamp', '>=', Timestamp.fromMillis(options.fromTimestamp)));
    }
    if (options?.toTimestamp) {
      q = query(q, where('timestamp', '<=', Timestamp.fromMillis(options.toTimestamp)));
    }

    return this.executeQuery(q);
  }

  /**
   * 獲取指定 workspace 的 events collection
   * 結構: /workspaces/{workspaceId}/events
   */
  private getEventsCollection(workspaceId: string): CollectionReference {
    return collection(
      this.firestore,
      'workspaces',
      workspaceId,
      'events'
    );
  }

  /**
   * 執行查詢並反序列化為 DomainEvent
   */
  private async executeQuery(q: any): Promise<DomainEvent<unknown>[]> {
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        eventId: data['eventId'],
        type: data['type'],
        aggregateId: data['aggregateId'],
        correlationId: data['correlationId'],
        causationId: data['causationId'],
        timestamp: data['timestamp'].toMillis(),
        payload: data['payload'],
        metadata: data['_rawMetadata'] || {
          eventId: data['eventId'],
          eventType: data['type'],
          workspaceId: data['workspaceId'],
          moduleType: data['moduleType'],
          timestamp: data['timestamp'].toMillis(),
          correlationId: data['correlationId'],
          causationId: data['causationId'],
          userId: data['userId'],
          aggregateId: data['aggregateId'],
          version: data['version'] || 1
        }
      } as DomainEvent<unknown>;
    });
  }
}
```

### 步驟 2: 在 app.config.ts 提供 FirestoreEventStore
檔案: `app.config.ts`

```typescript
import { EventStore } from './domain/event-store/event-store.interface';
import { FirestoreEventStore } from './infrastructure/persistence/firestore/event-store/firestore-event-store.service';
import { InMemoryEventStore } from './infrastructure/events/in-memory-event-store.impl';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... 現有配置

    // ✨ 優先使用 Firestore Event Store
    // 如果需要切回記憶體版本, 改用 InMemoryEventStore
    {
      provide: EventStore,
      useClass: FirestoreEventStore  // 或 InMemoryEventStore
    }
  ]
};
```

### 步驟 3: 修改 PublishEventUseCase 整合 Event Store
檔案: `application/events/use-cases/publish-event.use-case.ts`

確保 append 發生在 publish 之前:

```typescript
async execute<TPayload>(request: PublishEventRequest<TPayload>): Promise<PublishEventResponse> {
  const { event } = request;

  // ✨ 驗證 workspace metadata
  if (!event.metadata?.workspaceId) {
    throw new Error(`Event ${event.type} missing workspace metadata`);
  }

  // 驗證事件
  this.validateEvent(event);

  try {
    // 1️⃣ 先保存到 Event Store (持久化)
    await this.eventStore.append(event);

    // 2️⃣ 再發布到 Event Bus (即時通知)
    await this.eventBus.publish(event);

    console.log(`✅ Event published: ${event.type} in workspace ${event.metadata.workspaceId}`);

    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to publish event ${event.type}:`, error);
    return { success: false, error };
  }
}
```

### 步驟 4: 建立 Firestore 索引
在 Firebase Console 或 `firestore.indexes.json` 中配置:

```json
{
  "indexes": [
    {
      "collectionGroup": "events",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "workspaceId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "events",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "moduleType", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "events",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "correlationId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "ASCENDING" }
      ]
    }
  ]
}
```

### 測試步驟:
1. 建立一個 Task
2. 到 Firebase Console 確認事件儲存到: `/workspaces/{workspaceId}/events/{auto-generated-id}`
3. 確認事件包含 `metadata.workspaceId` 和 `metadata.moduleType`
4. 測試查詢: `await eventStore.getEventsByWorkspace('ws-123')`

完成後回報:
- Event Store 是否正確儲存到 Firestore?
- Workspace 分區是否生效?
- 查詢功能是否正常?

---

## 通用規範 (所有階段適用)

```text
技術要求:

1. Angular 20 控制流:
   - 所有新模板使用 @if/@else
   - 使用 @for 替代 *ngFor
   - 使用 @switch/@case 替代 *ngSwitch
   - 使用 @defer 進行延遲載入

2. @ngrx/signals:
   - 使用 signalStore() 建立 Store
   - 使用 withState() 定義狀態
   - 使用 withComputed() 定義計算屬性
   - 使用 withMethods() 定義方法
   - 使用 rxMethod() 處理非同步操作

3. @angular/fire:
   - 使用 inject(Firestore) 注入
   - 使用 collection(), addDoc(), getDocs()
   - 使用 Timestamp 處理時間
   - 建立適當的 Firestore 索引

4. 向後相容:
   - 不刪除現有 public API
   - 保留現有方法簽名
   - 新功能用「新增」而非「替換」
   - 標記 deprecated 但不移除

5. 命名規範:
   - 檔案: kebab-case (workspace-context.service.ts)
   - Class: PascalCase (WorkspaceContextService)
   - Interface: PascalCase with I prefix optional
   - Signal Store: PascalCase + Store suffix

檢查點:
- 每個階段完成後執行 ng build
- 確認無編譯錯誤
- 手動測試關鍵流程
- 一個階段一個 commit
```

## 執行建議

```text
給 Copilot 的工作流程:

1. 請專注於完成 Phase 2 任務。
2. 完成後回報:
   - 修改的檔案清單
   - 新增的檔案清單
   - 遇到的問題 (如果有)
   - 測試結果
3. 如果遇到衝突或不確定, 立即停止並詢問。
4. 所有的實作都必須通過 `ng build` 驗證。
```

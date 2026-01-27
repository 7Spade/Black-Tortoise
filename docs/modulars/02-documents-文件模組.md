# 文件模組 (DocumentsModule) - 開發指南

**模組編號**：02-documents
**版本**：2.0
**最後更新**：2026-01-27
**父文件**：workspace-modular-architecture_constitution_enhanced.md

---

## 一、模組概述

### 核心職責
Workspace 檔案資產管理，包含檔案樹結構與資料夾組織

### 邊界定義
僅處理檔案的 CRUD 與組織，不涉及檔案內容的業務邏輯

### 在架構中的位置
本模組是 Workspace 的子模組之一，遵循 Domain → Application → Infrastructure → Presentation 的分層架構。

---

## 二、功能需求規格

### 1. 檔案樹 (File Tree)

#### 需求清單
1. 使用樹狀結構儲存檔案與資料夾關係
2. 每個節點包含：id, name, type (file/folder), parentId, children, metadata
3. 支援最大深度限制 (建議 10 層)
4. 使用 mat-tree 或自訂樹狀元件呈現檔案樹
5. 支援展開/收合資料夾，記住展開狀態
6. 支援拖曳移動檔案/資料夾 (使用 CDK Drag & Drop)
7. 支援多選操作 (Ctrl+Click, Shift+Click)
8. 右鍵選單：新增資料夾、重新命名、刪除、移動、複製連結
9. 麵包屑導航：顯示當前路徑，支援快速跳轉
10. 雙擊檔案：預覽或下載
11. 檔案圖示：依副檔名顯示不同圖示

### 2. 新增資料夾 (Create Folder)

#### 需求清單
1. 彈出 Dialog 輸入資料夾名稱
2. 驗證名稱：不可為空、不可重複、不可包含特殊字元
3. 新資料夾預設在當前選中的節點下建立
4. 若未選中任何節點，則在根目錄建立
5. 建立後自動選中新資料夾並展開父節點
6. 發布 FolderCreated 事件

### 3. 檔案上傳 (File Upload)

#### 需求清單
1. 支援拖曳上傳：拖曳到樹狀結構或指定區域
2. 支援點擊上傳：點擊按鈕選擇檔案
3. 支援批次上傳：一次選擇多個檔案
4. 支援資料夾上傳：保留資料夾結構
5. 使用 Signal 追蹤上傳進度
6. 使用 mat-progress-bar 顯示進度
7. 支援暫停/恢復上傳 (Optional)
8. 支援取消上傳
9. 檢查檔案大小 (預設限制 100MB)
10. 檢查檔案類型 (允許清單)
11. 檢查檔案名稱：不可包含特殊字元
12. 檢查重複：同名檔案提示覆蓋或重新命名
13. 自動刷新檔案樹
14. 發布 DocumentUploaded 事件

### 4. 檔案列表與搜尋

#### 需求清單
1. 使用 cdk-virtual-scroll-viewport 處理大量檔案列表
2. 僅渲染可見區域的檔案項目
3. 支援檔案名稱全文搜尋
4. 支援標籤搜尋 (Optional)
5. 支援進階篩選：檔案類型、上傳日期、上傳者、大小範圍
6. 使用 computed signal 過濾檔案列表
7. 支援多欄位排序：名稱、大小、修改日期、上傳者
8. 支援升序/降序切換
9. 記住使用者的排序偏好

### 5. 檔案預覽與下載

#### 需求清單
1. 圖片：直接在 Dialog 中顯示
2. PDF：使用 PDF Viewer 元件顯示
3. 文字檔案：直接顯示內容
4. 單檔下載：直接下載檔案
5. 批次下載：打包為 ZIP 下載
6. 資料夾下載：遞迴打包所有子檔案與資料夾

---

## 三、現代化實作要求

### Angular 20+ 最佳實踐

- 使用 signalStore 維護檔案樹狀態
- 上傳進度必須封裝為 Signal
- 檔案預覽元件使用 @defer (on interaction) 延遲載入

### 模板控制流 (Control Flow)
- **必須**使用 @if / @else 取代 *ngIf
- **必須**使用 @for (item of items; track item.id) 取代 *ngFor
- **必須**使用 @switch / @case 取代 *ngSwitch
- **必須**使用 @defer 進行延遲載入

### 狀態管理 (State Management)
- 使用 NgRx Signals (signalStore) 管理所有狀態
- 禁止使用 BehaviorSubject 或手動 subscribe
- 所有計算屬性使用 computed signal
- 所有副作用使用 effect

### 效能優化
- 啟用 Zone-less Change Detection
- 使用 ChangeDetectionStrategy.OnPush
- 重型視圖使用 @defer (on viewport)
- 次要互動使用 @defer (on interaction)

---

## 四、事件整合

### 發布事件 (Published Events)
- **DocumentUploaded**
- **DocumentDeleted**
- **FolderCreated**
- **FolderDeleted**

### 訂閱事件 (Subscribed Events)
- **WorkspaceSwitched**

### 事件處理原則
1. 事件必須遵循 Append -> Publish -> React 順序
2. 事件 Payload 必須是純資料 DTO
3. 所有事件必須包含 correlationId
4. 禁止在事件中傳遞 Service/Function/UI Reference

---

## 五、禁止事項 (Forbidden Practices)

- ❌ 在 Component 中直接操作 Storage SDK
- ❌ 在 Component 中處理檔案上傳邏輯，必須委派給 Use Case
- ❌ 跨 Workspace 存取檔案

---

## 六、測試策略

### Unit Tests
- 測試 computed 邏輯是否正確反映 source signal 的變化
- 測試 pure functions 的輸入輸出
- 禁止測試 effect 的副作用

### Integration Tests
- 測試事件發布與訂閱的契約
- Given 初始 State → When 發出 Command → Then 驗證 Event
- 不驗證 Private Method 或 Private State

### E2E Tests
- 覆蓋關鍵使用者流程
- 驗證 Optimistic UI 的正確回滾

---

## 七、UI/UX 規範

### 設計系統
- 使用 Angular Material (M3)
- 使用 Tailwind CSS (Utility-first)
- 遵循統一的卡片、按鈕、Dialog 佈局

### 無障礙設計 (A11y)
- 支援鍵盤導航
- 使用語意化 HTML
- 重要狀態變更使用 LiveAnnouncer 通知

### Core Web Vitals
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1

---

## 八、跨模組整合 (Cross-Module Integration)

### 本模組發布 (Published by This Module)

#### Context Provider
```typescript
// Application Layer: 02-documents/application/providers/documents-context.provider.ts
export abstract class DocumentContextProvider {
  abstract getDocumentCount(workspaceId: string): number;
  abstract hasDocument(documentId: string): boolean;
  abstract getDocumentPath(documentId: string): string | null;
}
```

#### 發布事件 (Published Events)
- **DocumentUploaded**
- **DocumentUpdated**
- **DocumentDeleted**
- **FolderCreated**

### 本模組訂閱 (Consumed by This Module)

#### 訂閱事件 (Subscribed Events)
- **WorkspaceSwitched**

#### 使用的 Context Providers
- **WorkspaceContextProvider**: 查詢當前 Workspace ID

### 整合範例

```typescript
// Application Layer: 02-documents/application/stores/documents.store.ts
export const DocumentsStore = signalStore(
  { providedIn: 'root' },
  withState<DocumentsState>(initialState),
  withMethods((store) => {
    const eventBus = inject(WorkspaceEventBus);
    const workspaceContext = inject(WorkspaceContextProvider);
    
    return {
      // 業務方法範例
    };
  }),
  withHooks({
    onInit(store) {
      const eventBus = inject(WorkspaceEventBus);
      
      // 訂閱 WorkspaceSwitched
      eventBus.on('WorkspaceSwitched', () => {
        patchState(store, initialState);
      });
    }
  })
);
```

### 禁止的整合方式

❌ **禁止**：直接注入其他模組的 Store
```typescript
// ❌ 錯誤
export class DocumentsStore {
  private taskStore = inject(TaskStore); // 緊密耦合
}
```

✅ **正確**：使用 Context Provider 或 Event Bus
```typescript
export class DocumentsStore {
  private workspaceContext = inject(WorkspaceContextProvider); // 鬆散耦合
  private eventBus = inject(WorkspaceEventBus);
}
```

---

## 九、DDD 實作規範

### Aggregate Root: DocumentEntity

#### Creation Pattern (產生 Domain Event)
```typescript
// Domain Layer: 02-documents/domain/aggregates/documents.aggregate.ts
export class DocumentEntity {
  private constructor(...) {}
  
  public static create(..., eventMetadata?: EventMetadata): DocumentEntity {
    // 產生 Domain Event
    // ...
  }
  
  public static reconstruct(props): DocumentEntity {
    // 從 Snapshot 重建，不產生 Event
    return new DocumentEntity(...);
  }
}
```

#### Factory Pattern (強制執行 Policy)
```typescript
// Domain Layer: 02-documents/domain/factories/documents.factory.ts
export class DocumentFactory {
  public static create(..., metadata?: EventMetadata): DocumentEntity {
    // 執行 Policy 檢查
    DocumentNamingPolicy.assertIsValid(...);
    
    // 透過 Aggregate 創建
    return DocumentEntity.create(..., metadata);
  }
}
```

#### Policy Pattern (封裝業務規則)
```typescript
// Domain Layer: 02-documents/domain/policies/documents.policy.ts
export class DocumentNamingPolicy {
  public static isSatisfiedBy(...): boolean {
    // 業務規則檢查
  }
  
  public static assertIsValid(...): void {
    if (!this.isSatisfiedBy(...)) {
      throw new DomainError('...');
    }
  }
}
```

### Dependency Inversion (Repository Pattern)

#### Application Layer: 定義介面與 Token
```typescript
// Application Layer: 02-documents/application/ports/documents-repository.port.ts
export interface IDocumentRepository {
  findById(id: string): Promise<DocumentEntity | null>;
  save(entity: DocumentEntity): Promise<void>;
}

// Application Layer: 02-documents/application/tokens/documents-repository.token.ts
export const DOCUMENT_REPOSITORY_TOKEN = new InjectionToken<IDocumentRepository>(
  'DOCUMENT_REPOSITORY_TOKEN'
);
```

### Mapper Pattern (Domain <-> DTO/Firestore)
- Application Layer: DocumentToDtoMapper
- Infrastructure Layer: DocumentFirestoreMapper

### 型別安全
- 禁止使用 any 或 as unknown
- Mapper 必須明確處理深層嵌套物件

------

## 十、開發檢查清單

實作本模組時，請確認以下項目：

- [ ] 模組遵循 Domain → Application → Infrastructure → Presentation 分層
- [ ] 使用 signalStore 管理狀態
- [ ] 模板使用 @if / @for / @switch (禁止 *ngIf / *ngFor)
- [ ] @for 必須包含 track 表達式
- [ ] 使用 @defer 延遲載入重型視圖
- [ ] 所有事件包含 correlationId
- [ ] 事件遵循 Append -> Publish -> React
- [ ] 模組間僅透過 Event Bus 互動
- [ ] Component 設定 ChangeDetectionStrategy.OnPush
- [ ] 支援鍵盤導航與螢幕閱讀器
- [ ] 撰寫 Unit / Integration / E2E 測試
- [ ] 遵循奧卡姆剃刀原則，避免過度設計
- [ ] 實作 Context Provider 供其他模組查詢
- [ ] 使用 InjectionToken 進行依賴注入
- [ ] 使用 Factory/Policy 封裝創建與驗證邏輯
- [ ] 使用 Mapper 分離 Domain Entity 與 DTO
- [ ] 避免直接注入其他模組的 Store

---

## 十一、參考資料

- **父文件**：workspace-modular-architecture_constitution_enhanced.md
- **DDD 規範**：.github/skills/ddd/SKILL.md
- **Angular 文件**：https://angular.dev
- **Angular Material**：https://material.angular.io
- **Tailwind CSS**：https://tailwindcss.com

---

**注意**：本指南必須與父文件保持一致。若有衝突，以父文件為準。

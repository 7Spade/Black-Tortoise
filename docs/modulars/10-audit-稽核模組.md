# 稽核模組 (AuditModule) - 開發指南

**模組編號**：10-audit
**版本**：2.0
**最後更新**：2026-01-27
**父文件**：workspace-modular-architecture_constitution_enhanced.md

---

## 一、模組概述

### 核心職責
系統操作與安全日誌 (Audit Log)，記錄所有重要操作

### 邊界定義
唯讀 (Read-Only) 呈現，確保日誌不可篡改

### 在架構中的位置
本模組是 Workspace 的能力模組 (Capability Module) 之一，遵循 Domain → Application → Infrastructure → Presentation 的分層架構。模組自主管理自身狀態，不依賴或修改 Workspace Context，僅透過事件與其他模組協作。作為唯讀稽核模組，訂閱所有模組事件進行日誌記錄。

---

## 二、架構指引遵循

本模組的實作必須嚴格遵循以下架構指引文件：

1. **使用者層級指引**  
   `.github/instructions/00-user-guidelines.instructions.md`  
   定義使用者體驗、無障礙設計、互動模式等前端規範

2. **組織層級指引**  
   `.github/instructions/01-organization-guidelines.instructions.md`  
   定義多組織管理、權限隔離、資源分配等規範

3. **工作區層級指引**  
   `.github/instructions/02-workspace-guidelines.instructions.md`  
   定義 Workspace Context 邊界、模組協作、狀態管理等核心規範

4. **模組開發指引**  
   `.github/instructions/03-modules-guidelines.instructions.md`  
   定義模組分層架構、DDD 實作、事件驅動等開發規範

5. **事件溯源與因果關係**  
   `.github/instructions/04-event-sourcing-and-causality.instructions.md`  
   定義事件設計、因果鏈追蹤、事件處理順序等規範

**重要提醒**：所有實作決策若與上述指引衝突，必須以指引文件為準。若指引之間有衝突，優先順序為 04 > 03 > 02 > 01 > 00。

---

## 三、開發流程與方法

本模組採用 **Sub-Agent + Software Planning + Sequential Thinking** 的開發流程：

### 流程說明

1. **Software Planning 階段**  
   - 使用 `software-planning-mcp` 工具建立模組開發計劃
   - 分解功能需求為可執行的開發任務
   - 定義各層級（Domain/Application/Infrastructure/Presentation）的職責邊界
   - 建立事件流轉與模組互動的序列圖

2. **Sequential Thinking 階段**  
   - 使用 `server-sequential-thinking` 工具進行逐步推理
   - 驗證架構設計是否符合 DDD 原則
   - 檢查事件設計是否滿足因果完整性
   - 確認模組邊界是否清晰且無循環依賴

3. **Sub-Agent 協作**  
   - Domain Agent: 負責 Aggregate、Entity、Value Object 設計
   - Application Agent: 負責 Use Case、Command Handler、Event Handler 實作
   - Infrastructure Agent: 負責 Repository、Adapter、外部服務整合
   - Presentation Agent: 負責 Component、Store、UI 互動邏輯

4. **迭代與驗證**  
   - 每完成一個功能需求，回到 Planning 階段驗證
   - 使用 Sequential Thinking 檢查是否引入技術債
   - 確保所有變更都有對應的測試覆蓋

---

## 四、模組結構規劃

以下是本模組預期的檔案結構樹（按分層展示）：

```
src/app/
├── domain/audit/
│   ├── aggregates/
│   │   └── audit-log.aggregate.ts
│   ├── value-objects/
│   │   ├── audit-log-id.vo.ts
│   │   ├── operation-type.vo.ts
│   │   └── audit-metadata.vo.ts
│   ├── events/
│   │   └── audit-log-created.event.ts
│   └── repositories/
│       └── audit-log.repository.interface.ts
│
├── application/audit/
│   ├── commands/
│   │   └── create-audit-log.command.ts
│   ├── handlers/
│   │   ├── all-domain-events.handler.ts
│   │   └── create-audit-log.handler.ts
│   ├── queries/
│   │   ├── get-audit-logs.query.ts
│   │   └── search-audit-logs.query.ts
│   └── stores/
│       └── audit.store.ts
│
├── infrastructure/audit/
│   ├── repositories/
│   │   └── audit-log.repository.ts
│   └── adapters/
│       └── firebase-audit.adapter.ts
│
└── presentation/audit/
    ├── components/
    │   ├── audit-log-list/
    │   ├── audit-log-filter/
    │   └── audit-log-detail/
    └── pages/
        └── audit-page.component.ts
```

---

## 五、預計新增檔案

### Domain Layer (src/app/domain/audit/)
- `aggregates/audit-log.aggregate.ts` - 稽核日誌聚合根
- `value-objects/audit-log-id.vo.ts` - 稽核日誌 ID 值物件
- `value-objects/operation-type.vo.ts` - 操作類型值物件
- `value-objects/audit-metadata.vo.ts` - 稽核元資料值物件
- `events/audit-log-created.event.ts` - 稽核日誌建立事件
- `repositories/audit-log.repository.interface.ts` - Repository 介面

### Application Layer (src/app/application/audit/)
- `commands/create-audit-log.command.ts` - 建立稽核日誌命令
- `handlers/all-domain-events.handler.ts` - 所有領域事件處理器
- `handlers/create-audit-log.handler.ts` - 建立稽核日誌處理器
- `queries/get-audit-logs.query.ts` - 取得稽核日誌查詢
- `queries/search-audit-logs.query.ts` - 搜尋稽核日誌查詢
- `stores/audit.store.ts` - 稽核 Signal Store

### Infrastructure Layer (src/app/infrastructure/audit/)
- `repositories/audit-log.repository.ts` - Repository 實作
- `adapters/firebase-audit.adapter.ts` - Firebase 適配器

### Presentation Layer (src/app/presentation/audit/)
- `components/audit-log-list/audit-log-list.component.ts` - 稽核日誌列表元件
- `components/audit-log-filter/audit-log-filter.component.ts` - 稽核日誌篩選元件
- `components/audit-log-detail/audit-log-detail.component.ts` - 稽核日誌詳情元件
- `pages/audit-page.component.ts` - 稽核頁面元件

---

## 六、功能需求規格

### 1. 操作記錄

#### 需求清單
1. 記錄所有模組的關鍵操作 (CRUD)
2. 記錄權限變更、角色分配
3. 記錄成員邀請、移除
4. 記錄任務狀態流轉
5. 記錄問題單建立、解決
6. 記錄文件上傳、刪除
7. 記錄設定變更
8. 記錄屬性：操作 ID、時間、操作者、操作類型、操作對象、操作模組、操作詳情、IP 位址、使用者代理

### 2. 唯讀呈現

#### 需求清單
1. 稽核日誌一旦建立，不可修改或刪除
2. 使用 append-only 模式儲存
3. 定期備份日誌資料
4. 僅 Owner 和 Admin 可查看完整稽核日誌
5. 一般成員僅可查看自己的操作記錄
6. 敏感操作需特殊權限查看

### 3. 多維度篩選

#### 需求清單
1. 依時間範圍篩選
2. 依操作者篩選
3. 依模組篩選
4. 依操作類型篩選
5. 依操作對象篩選
6. 支援關鍵字搜尋
7. 支援進階搜尋

### 4. 日誌視覺化

#### 需求清單
1. 以時間軸方式呈現操作記錄
2. 支援展開/收合詳細資訊
3. 操作次數趨勢圖 (折線圖)
4. 各模組操作分佈 (圓餅圖)
5. 各操作類型分佈 (長條圖)
6. 各成員操作次數排行 (橫向長條圖)

### 5. 日誌匯出與備份

#### 需求清單
1. 支援匯出為 Excel / CSV / JSON
2. 支援自訂匯出欄位
3. 支援匯出篩選後的結果
4. 定期自動備份稽核日誌
5. 備份儲存在獨立的儲存空間
6. 支援手動觸發備份

### 6. 異常偵測

#### 需求清單
1. 短時間內大量操作 (可能是惡意行為)
2. 非工作時間的操作 (可能是異常存取)
3. 刪除大量資料 (可能是誤操作或惡意破壞)
4. 偵測到異常行為時，發送警報通知管理員
5. 記錄異常事件，標記為高優先級

---

## 七、現代化實作要求

### Angular 20+ 最佳實踐

- 使用 signalStore 維護稽核日誌 (Read-Only)
- 訂閱所有模組的操作事件，自動記錄
- 使用 computed signal 進行多維度篩選

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

## 八、事件整合

### 發布事件 (Published Events)
- 無

### 訂閱事件 (Subscribed Events)
- **ALL_EVENTS**

### 事件處理原則
1. 事件必須遵循 Append -> Publish -> React 順序
2. 事件 Payload 必須是純資料 DTO
3. 所有事件必須包含 correlationId
4. 禁止在事件中傳遞 Service/Function/UI Reference

---

## 九、架構合規性

### Workspace Context 邊界
- 本模組不修改 Workspace Context
- 不直接依賴其他模組的內部狀態
- 僅透過訂閱事件進行日誌記錄

### 模組自主性
- 完全擁有並管理稽核日誌狀態
- 不允許其他模組直接讀寫本模組狀態
- 作為唯讀稽核模組，不發布業務事件

### 稽核模組特性
- 訂閱所有模組事件，自動記錄操作日誌
- 使用 append-only 模式，確保日誌不可篡改
- 不參與業務邏輯，僅負責記錄與查詢

## 十、禁止事項 (Forbidden Practices)

- ❌ 修改或刪除稽核日誌
- ❌ 繞過稽核記錄執行敏感操作
- ❌ 跨 Workspace 存取稽核日誌
- ❌ 直接修改 Workspace Context
- ❌ 將稽核資料寫入 Workspace Context

---

## 十一、測試策略

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

## 十二、UI/UX 規範

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

## 十三、DDD 實作規範

### Aggregate Root
- 支援 Creation (create()) 與 Reconstruction (reconstruct())
- 所有業務變更方法必須產生 Domain Event
- reconstruct 不產生 Domain Event

### Child Entities
- 使用 Value Object ID
- 禁止直接暴露陣列，必須透過方法操作

### 型別安全
- 禁止使用 any 或 as unknown
- Mapper 必須明確處理深層嵌套物件

---

## 十四、開發檢查清單

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

---

## 十五、參考資料

- **父文件**：workspace-modular-architecture_constitution_enhanced.md
- **DDD 規範**：.github/skills/ddd/SKILL.md
- **Angular 文件**：https://angular.dev
- **Angular Material**：https://material.angular.io
- **Tailwind CSS**：https://tailwindcss.com

---

**注意**：本指南必須與父文件保持一致。若有衝突，以父文件為準。

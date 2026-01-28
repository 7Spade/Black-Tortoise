# 驗收模組 (AcceptanceModule) - 開發指南

**模組編號**：06-acceptance
**版本**：2.0
**最後更新**：2026-01-27
**父文件**：workspace-modular-architecture_constitution_enhanced.md

---

## 一、模組概述

### 核心職責
最終交付物的商業驗收

### 邊界定義
透過事件訂閱接收已通過 QC 的任務，透過事件發布通知驗收結果

### 在架構中的位置
本模組是 Workspace 的能力模組 (Capability Module) 之一，遵循 Domain → Application → Infrastructure → Presentation 的分層架構。模組自主管理自身狀態，不依賴或修改 Workspace Context，僅透過事件與其他模組協作。

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
├── domain/acceptance/
│   ├── aggregates/
│   │   └── acceptance-item.aggregate.ts
│   ├── entities/
│   │   └── acceptance-criteria-item.entity.ts
│   ├── value-objects/
│   │   ├── acceptance-item-id.vo.ts
│   │   ├── acceptance-status.vo.ts
│   │   └── acceptance-result.vo.ts
│   ├── events/
│   │   ├── acceptance-approved.event.ts
│   │   ├── acceptance-rejected.event.ts
│   │   └── acceptance-started.event.ts
│   └── repositories/
│       └── acceptance-item.repository.interface.ts
│
├── application/acceptance/
│   ├── commands/
│   │   ├── start-acceptance.command.ts
│   │   ├── approve-acceptance.command.ts
│   │   └── reject-acceptance.command.ts
│   ├── handlers/
│   │   ├── task-ready-for-acceptance-event.handler.ts
│   │   ├── start-acceptance.handler.ts
│   │   ├── approve-acceptance.handler.ts
│   │   └── reject-acceptance.handler.ts
│   ├── queries/
│   │   ├── get-pending-acceptance-items.query.ts
│   │   └── get-acceptance-history.query.ts
│   └── stores/
│       └── acceptance.store.ts
│
├── infrastructure/acceptance/
│   ├── repositories/
│   │   └── acceptance-item.repository.ts
│   └── adapters/
│       └── firebase-acceptance.adapter.ts
│
└── presentation/acceptance/
    ├── components/
    │   ├── acceptance-criteria-list/
    │   ├── acceptance-item-detail/
    │   └── acceptance-history/
    └── pages/
        └── acceptance-page.component.ts
```

---

## 五、預計新增檔案

### Domain Layer (src/app/domain/acceptance/)
- `aggregates/acceptance-item.aggregate.ts` - 驗收項目聚合根
- `entities/acceptance-criteria-item.entity.ts` - 驗收標準項目實體
- `value-objects/acceptance-item-id.vo.ts` - 驗收項目 ID 值物件
- `value-objects/acceptance-status.vo.ts` - 驗收狀態值物件
- `value-objects/acceptance-result.vo.ts` - 驗收結果值物件
- `events/acceptance-approved.event.ts` - 驗收通過事件
- `events/acceptance-rejected.event.ts` - 驗收駁回事件
- `events/acceptance-started.event.ts` - 驗收開始事件
- `repositories/acceptance-item.repository.interface.ts` - Repository 介面

### Application Layer (src/app/application/acceptance/)
- `commands/start-acceptance.command.ts` - 開始驗收命令
- `commands/approve-acceptance.command.ts` - 批准驗收命令
- `commands/reject-acceptance.command.ts` - 駁回驗收命令
- `handlers/task-ready-for-acceptance-event.handler.ts` - 任務準備驗收事件處理器
- `handlers/start-acceptance.handler.ts` - 開始驗收處理器
- `handlers/approve-acceptance.handler.ts` - 批准驗收處理器
- `handlers/reject-acceptance.handler.ts` - 駁回驗收處理器
- `queries/get-pending-acceptance-items.query.ts` - 取得待辦驗收查詢
- `queries/get-acceptance-history.query.ts` - 取得驗收歷史查詢
- `stores/acceptance.store.ts` - 驗收 Signal Store

### Infrastructure Layer (src/app/infrastructure/acceptance/)
- `repositories/acceptance-item.repository.ts` - Repository 實作
- `adapters/firebase-acceptance.adapter.ts` - Firebase 適配器

### Presentation Layer (src/app/presentation/acceptance/)
- `components/acceptance-criteria-list/acceptance-criteria-list.component.ts` - 驗收標準列表元件
- `components/acceptance-item-detail/acceptance-item-detail.component.ts` - 驗收項目詳情元件
- `components/acceptance-history/acceptance-history.component.ts` - 驗收歷史元件
- `pages/acceptance-page.component.ts` - 驗收頁面元件

---

## 六、功能需求規格

### 1. 驗收項目管理

#### 需求清單
1. 訂閱 TaskReadyForAcceptance 事件，僅接收已通過 QC 的任務
2. 接收到事件時自動建立驗收項目
3. 項目屬性：關聯任務 ID、驗收人員、驗收標準、驗收狀態、驗收日期、驗收備註
4. 驗收狀態：Pending, InProgress, Approved, Rejected

### 2. 驗收標準清單

#### 需求清單
1. 強調「交付標準」的核對清單 UI
2. 支援預設範本 (依專案類型)
3. 每個項目包含：標準描述、驗收方法、是否必檢、檢查結果
4. 支援上傳驗收相關文件
5. 支援查看任務的所有附件與產出物

### 3. 驗收流程

#### 需求清單
1. 驗收人員從待辦清單選擇項目
2. 系統顯示任務完整資訊與交付物
3. 驗收人員依 Acceptance Criteria 逐項檢查
4. 所有必檢標準滿足時通過
5. 通過時發布 AcceptanceApproved 事件 (任務模組訂閱並流轉狀態)
6. (任務模組訂閱 AcceptanceApproved 事件後流轉到 Completed)
7. 至少一個標準未滿足時不通過
8. 驗收人員必須填寫「拒絕原因」
9. 發布 AcceptanceRejected 事件 (Issues 模組訂閱並建立問題單)
10. 發布 AcceptanceRejected 事件
11. (任務模組訂閱 AcceptanceRejected 事件後流轉到 Blocked)

### 4. 自動化驗收閘門與失敗處理 (Automated Acceptance Gates & Failure Handling)

#### 需求清單
1. **自動接收待驗收任務**：訂閱 TaskReadyForAcceptance 事件 → 自動建立驗收項目 → 僅接收 QCPassed 狀態的任務 → 出現在驗收待辦清單 → 無需人工觸發
2. **明確的通過/失敗閘門**：
   - **通過條件**：所有必檢標準滿足 → 發布 AcceptanceApproved 事件 → 任務自動流轉到 Completed
   - **失敗條件**：任一標準未滿足 → 強制填寫拒絕原因 → 發布 AcceptanceRejected 事件
3. **失敗自動觸發問題單建立**：
   - AcceptanceRejected 事件發布後 → 自動建立問題單：
     - 標題：「[驗收失敗] {任務標題}」
     - 類型：Requirement Change / Defect
     - 優先級：繼承任務優先級
     - 指派：任務負責人
   - 發布 IssueCreated 事件 → 問題單與任務建立雙向關聯
4. **閉環行為**：
   - 訂閱 IssueResolved 事件 → 檢查關聯問題單是否已解決
   - 問題單解決後 → 任務從 Blocked 流轉回 ReadyForQC → 重新經過完整 QC → Acceptance 流程
   - 驗收項目自動重置為 Pending → 可重新開始驗收
5. **異常處理**：AcceptanceRejected 事件發布時，若問題單建立失敗，系統記錄異常並保持驗收項目在 Rejected 狀態，等待重試

### 4. 驗收不通過流轉到問題單

#### 需求清單
1. 驗收失敗時，發布 AcceptanceRejected 事件包含拒絕原因與未滿足標準
2. (Issues 模組訂閱 AcceptanceRejected 並建立問題單，標題：「[驗收失敗] {任務標題}」)
3. (問題單描述由 Issues 模組自動填入事件中的拒絕原因與標準)
4. (問題單類型：Requirement Change / Defect)
5. (問題單優先級：依事件中的任務優先級設定)
6. (問題單指派：依事件中的任務負責人指派)
7. (任務模組訂閱 IssueResolved 事件後重新流經 QC → Acceptance 流程)
8. 驗收人員可透過事件查詢關聯問題單的處理記錄
9. 訂閱 IssueResolved 事件，驗收項目重置，等待任務重新進入

### 5. 驗收歷史與追蹤

#### 需求清單
1. 保留所有驗收歷史記錄
2. 顯示驗收時間、驗收人員、驗收結果、拒絕原因
3. 驗收通過率 (Approval Rate)
4. 平均驗收時間
5. 常見拒絕原因統計

---

## 七、現代化實作要求

### Angular 20+ 最佳實踐

- 使用 signalStore 維護驗收項目 Map<AcceptanceId, AcceptanceItem>
- 僅接收已通過 QC 的項目
- 拒絕時必須填寫原因

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
- **AcceptanceApproved** (所有必檢標準滿足)
- **AcceptanceRejected** (任一標準未滿足，包含拒絕資訊供 Issues 模組建立問題單)
- **AcceptanceStarted**

### 訂閱事件 (Subscribed Events)
- **TaskReadyForAcceptance** (僅接收 QCPassed 狀態任務，自動建立驗收項目)
- **IssueResolved** (問題單解決後重置驗收項目狀態)
- **WorkspaceSwitched**

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
- 跨模組協作僅透過事件完成

### 模組自主性
- 完全擁有並管理驗收項目與標準狀態
- 不允許其他模組直接讀寫本模組狀態
- 狀態變更必須透過 Domain Event 公告

## 十、禁止事項 (Forbidden Practices)

- ❌ 接收未通過 QC 的任務
- ❌ 直接修改任務狀態，必須透過事件
- ❌ 繞過 Acceptance Criteria 強制檢查
- ❌ 直接修改 Workspace Context 或其他模組狀態
- ❌ 將模組狀態寫入 Workspace Context

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

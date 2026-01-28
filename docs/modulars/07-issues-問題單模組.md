# 問題單模組 (IssuesModule) - 開發指南

**模組編號**：07-issues
**版本**：2.0
**最後更新**：2026-01-27
**父文件**：workspace-modular-architecture_constitution_enhanced.md

---

## 一、模組概述

### 核心職責
異常與缺失追蹤 (Defect Tracking)，管理所有工作流中的問題

### 邊界定義
追蹤問題的生命週期，透過事件訂閱接收失敗通知，透過事件發布通知問題解決狀態

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
├── domain/issues/
│   ├── aggregates/
│   │   └── issue.aggregate.ts
│   ├── value-objects/
│   │   ├── issue-id.vo.ts
│   │   ├── issue-type.vo.ts
│   │   ├── issue-status.vo.ts
│   │   └── issue-priority.vo.ts
│   ├── events/
│   │   ├── issue-created.event.ts
│   │   ├── issue-resolved.event.ts
│   │   ├── issue-closed.event.ts
│   │   └── issue-reopened.event.ts
│   └── repositories/
│       └── issue.repository.interface.ts
│
├── application/issues/
│   ├── commands/
│   │   ├── create-issue.command.ts
│   │   ├── update-issue.command.ts
│   │   ├── resolve-issue.command.ts
│   │   ├── close-issue.command.ts
│   │   └── reopen-issue.command.ts
│   ├── handlers/
│   │   ├── qc-failed-event.handler.ts
│   │   ├── acceptance-rejected-event.handler.ts
│   │   ├── create-issue.handler.ts
│   │   ├── resolve-issue.handler.ts
│   │   └── close-issue.handler.ts
│   ├── queries/
│   │   ├── get-issues.query.ts
│   │   ├── get-issue-by-id.query.ts
│   │   └── get-issues-by-task.query.ts
│   └── stores/
│       └── issues.store.ts
│
├── infrastructure/issues/
│   ├── repositories/
│   │   └── issue.repository.ts
│   └── adapters/
│       └── firebase-issues.adapter.ts
│
└── presentation/issues/
    ├── components/
    │   ├── issue-list/
    │   ├── issue-editor/
    │   └── issue-detail/
    └── pages/
        └── issues-page.component.ts
```

---

## 五、預計新增檔案

### Domain Layer (src/app/domain/issues/)
- `aggregates/issue.aggregate.ts` - 問題單聚合根
- `value-objects/issue-id.vo.ts` - 問題單 ID 值物件
- `value-objects/issue-type.vo.ts` - 問題單類型值物件
- `value-objects/issue-status.vo.ts` - 問題單狀態值物件
- `value-objects/issue-priority.vo.ts` - 問題單優先級值物件
- `events/issue-created.event.ts` - 問題單建立事件
- `events/issue-resolved.event.ts` - 問題單解決事件
- `events/issue-closed.event.ts` - 問題單關閉事件
- `events/issue-reopened.event.ts` - 問題單重開事件
- `repositories/issue.repository.interface.ts` - Repository 介面

### Application Layer (src/app/application/issues/)
- `commands/create-issue.command.ts` - 建立問題單命令
- `commands/update-issue.command.ts` - 更新問題單命令
- `commands/resolve-issue.command.ts` - 解決問題單命令
- `commands/close-issue.command.ts` - 關閉問題單命令
- `commands/reopen-issue.command.ts` - 重開問題單命令
- `handlers/qc-failed-event.handler.ts` - QC 失敗事件處理器
- `handlers/acceptance-rejected-event.handler.ts` - 驗收駁回事件處理器
- `handlers/create-issue.handler.ts` - 建立問題單處理器
- `handlers/resolve-issue.handler.ts` - 解決問題單處理器
- `handlers/close-issue.handler.ts` - 關閉問題單處理器
- `queries/get-issues.query.ts` - 取得問題單列表查詢
- `queries/get-issue-by-id.query.ts` - 依 ID 取得問題單查詢
- `queries/get-issues-by-task.query.ts` - 依任務取得問題單查詢
- `stores/issues.store.ts` - 問題單 Signal Store

### Infrastructure Layer (src/app/infrastructure/issues/)
- `repositories/issue.repository.ts` - Repository 實作
- `adapters/firebase-issues.adapter.ts` - Firebase 適配器

### Presentation Layer (src/app/presentation/issues/)
- `components/issue-list/issue-list.component.ts` - 問題單列表元件
- `components/issue-editor/issue-editor.component.ts` - 問題單編輯器元件
- `components/issue-detail/issue-detail.component.ts` - 問題單詳情元件
- `pages/issues-page.component.ts` - 問題單頁面元件

---

## 六、功能需求規格

### 1. 問題單建立

#### 需求清單
1. 自動建立：訂閱 QCFailed / AcceptanceRejected 事件，接收到事件時自動建立
2. 手動建立：使用者在任務頁面或問題單模組手動建立
3. 問題單屬性：標題、描述、類型、優先級、狀態、關聯任務、指派人員、報告者
4. 類型：Defect、Bug、Requirement Change、Question
5. 優先級：Low, Medium, High, Critical
6. 狀態：Open, InProgress, Resolved, Closed, Reopened
7. 支援上傳附件 (截圖、日誌等)
8. 支援貼上截圖 (Clipboard)

### 2. 問題單生命週期

#### 需求清單
1. 狀態流轉：Open → InProgress → Resolved → Closed
2. 任何階段可 Reopen
3. Open：問題單剛建立，待處理
4. InProgress：指派人員開始處理
5. Resolved：問題已解決，等待驗證
6. Closed：問題已驗證關閉，不可再修改
7. Reopened：問題驗證未通過，重新開啟
8. 問題單為 Open / InProgress 時，發布狀態供任務模組訂閱
9. 問題單 Resolved 時，發布 IssueResolved 事件通知
10. 問題單 Closed 時，發布 IssueClosed 事件
11. (任務模組訂閱 IssueResolved 事件，檢查所有關聯問題單後決定是否解除 Blocked)

### 3. 問題單根據處理狀態流轉到模組完成閉環

#### 需求清單
1. QC 失敗產生的問題單 → 解決後發布 IssueResolved (含 sourceEvent) → (任務模組訂閱並流轉回 InProgress)
2. 驗收失敗產生的問題單 → 解決後發布 IssueResolved (含 sourceEvent) → (任務模組訂閱並流轉回 ReadyForQC)
3. 手動建立的問題單 → 解決後發布 IssueResolved → (任務模組訂閱並繼續原流程)
4. 發布 IssueResolved 事件包含 sourceEvent 資訊
5. 發布 IssueResolved 事件
6. (任務模組訂閱 IssueResolved 並依 sourceEvent 更新狀態)
7. (任務模組完成前訂閱 IssueClosed 檢查是否有未關閉問題單)
8. (任務模組依檢查結果決定是否允許標記為 Completed)

### 4. 自動問題單建立與閉環處理 (Automated Issue Creation & Closed-Loop)

#### 需求清單
1. **自動接收失敗事件並建立問題單**：
   - 訂閱 QCFailed 事件 → 自動建立問題單 (類型: Defect, 標題: "[QC 失敗] {任務標題}")
   - 訂閱 AcceptanceRejected 事件 → 自動建立問題單 (類型: Requirement Change/Defect, 標題: "[驗收失敗] {任務標題}")
   - 問題單描述自動填入失敗原因、檢查項目/標準
   - 優先級繼承任務優先級，自動指派給任務負責人
2. **問題單與任務雙向關聯**：
   - 發布 IssueCreated 事件 → 包含 taskId, issueType, sourceEvent (QCFailed/AcceptanceRejected)
   - 任務訂閱 IssueCreated 事件 → 建立雙向關聯 → 流轉到 Blocked 狀態
3. **閉環行為：問題解決後重新進入正確階段**：
   - 問題單標記為 Resolved → 發布 IssueResolved 事件 (包含 sourceEvent)
   - 任務訂閱 IssueResolved 事件 → 檢查所有關聯問題單是否已解決
   - 若全部解決，依 sourceEvent 自動流轉：
     - 來源為 QCFailed → Blocked → InProgress (等待開發者重新完成)
     - 來源為 AcceptanceRejected → Blocked → ReadyForQC (重新經過 QC → Acceptance)
   - 發布 TaskUnblocked 事件
4. **異常處理與防護**：
   - 問題單狀態為 Open/InProgress 時，關聯任務禁止標記為 Completed
   - 任務嘗試完成時，系統自動檢查未關閉問題單 → 若有則發布 TaskCompletionBlocked 事件
   - 問題單 Closed 後，任務檢查是否所有問題單都已關閉 → 若是則允許繼續流程

### 4. 問題單列表與篩選

#### 需求清單
1. 顯示所有問題單，支援排序、篩選、分組
2. 預設依建立時間降序排列
3. 依狀態篩選
4. 依類型篩選
5. 依優先級篩選
6. 依指派人員篩選
7. 依關聯任務篩選
8. 支援批次指派
9. 支援批次關閉
10. 支援批次匯出

### 5. 問題單列表與篩選

#### 需求清單
1. 顯示所有問題單，支援排序、篩選、分組
2. 預設依建立時間降序排列
3. 依狀態篩選
4. 依類型篩選
5. 依優先級篩選
6. 依指派人員篩選
7. 依關聯任務篩選
8. 支援批次指派
9. 支援批次關閉
10. 支援批次匯出

### 6. 問題單統計與報表

#### 需求清單
1. 問題單總數 / 開啟數 / 解決數 / 關閉數
2. 平均解決時間 (MTTR)
3. 問題單類型分佈 (圓餅圖)
4. 問題單優先級分佈 (長條圖)
5. 問題單趨勢 (折線圖)
6. 支援匯出為 Excel / CSV / PDF

---

## 七、現代化實作要求

### Angular 20+ 最佳實踐

- 使用 signalStore 維護問題單 Map<IssueId, Issue>
- Issue 的生命週期必須與 Task 狀態掛鉤
- 接收到 QCFailed / AcceptanceRejected 事件時，自動預填 Issue

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
- **IssueCreated** (QC/Acceptance 失敗時自動建立，包含 sourceEvent)
- **IssueUpdated**
- **IssueResolved** (包含 sourceEvent 以便任務正確流轉)
- **IssueClosed**
- **IssueReopened**

### 訂閱事件 (Subscribed Events)
- **QCFailed** (自動建立問題單，sourceEvent: QCFailed)
- **AcceptanceRejected** (自動建立問題單，sourceEvent: AcceptanceRejected)
- **TaskCompleted** (檢查是否有未關閉問題單)
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
- 完全擁有並管理問題單狀態與生命週期
- 不允許其他模組直接讀寫本模組狀態
- 狀態變更必須透過 Domain Event 公告

## 十、禁止事項 (Forbidden Practices)

- ❌ 直接修改任務狀態，必須透過事件
- ❌ 關閉問題單時未驗證問題是否真正解決
- ❌ 遺漏未關閉問題單而完成任務
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

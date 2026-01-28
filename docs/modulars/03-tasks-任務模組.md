# 任務模組 (TasksModule) - 開發指南

**模組編號**：03-tasks
**版本**：2.0
**最後更新**：2026-01-27
**父文件**：workspace-modular-architecture_constitution_enhanced.md

---

## 一、模組概述

### 核心職責
核心任務與專案管理，支援單價/數量/進度/指派、無限拆分子任務、狀態流轉

### 邊界定義
作為工作流的發起點，響應 QC/Acceptance 的回饋，但不直接修改其他模組狀態

### 在架構中的位置
本模組是 Workspace 的能力模組 (Capability Module) 之一，遵循 Domain → Application → Infrastructure → Presentation 的分層架構。模組自主管理自身狀態，不依賴或修改 Workspace Context，僅透過事件與其他模組協作。

---

## 二、功能需求規格

### 1. 單一狀態來源 (Single Source of Truth) + 派生視圖

#### 需求清單
1. 所有任務僅存在一份 Canonical State (TaskAggregate / TaskStore)
2. 所有視圖 (List, Gantt, Kanban, Calendar) 都是對該狀態的投影
3. 切換視圖時禁止重新打 API，僅改變 viewMode signal
4. List View：清單視圖，支援排序、篩選、分組
5. Gantt View：甘特圖，顯示任務時間軸與依賴關係
6. Kanban View：看板視圖，依狀態分欄顯示
7. Calendar View：行事曆視圖（由 CalendarModule 提供）
8. 使用 viewMode signal 控制當前視圖
9. 使用 computed signal 計算視圖所需的資料結構
10. 視圖元件使用 @if 條件渲染
11. 資料變更時，所有視圖自動同步更新

### 2. 任務屬性：單價/數量/進度/指派

#### 需求清單
1. 標題：必填，長度 3-200 字元
2. 描述：選填，支援 Markdown 格式
3. 單價：使用 Money Value Object，支援多幣別
4. 數量：正整數或小數，支援單位
5. 總價：自動計算 = unitPrice × quantity
6. 進度：百分比 0-100，支援手動調整或自動計算
7. 狀態：Draft, InProgress, ReadyForQC, QCPassed, ReadyForAcceptance, Accepted, Completed, Blocked
8. 優先級：Low, Medium, High, Urgent
9. 到期日：選填，支援日期時間選擇器
10. 支援多人指派
11. 支援指派負責人
12. 支援指派協作者
13. 指派變更發布 TaskAssigneeChanged 事件
14. 葉節點任務：由使用者手動更新進度
15. 父任務：自動計算子任務的加權平均進度
16. 進度公式：parentProgress = Σ(childProgress × childTotalPrice) / Σ(childTotalPrice)
17. 父任務的總價 = 所有子任務總價之和
18. 子任務總價超過父任務總價時，顯示警告並禁止提交
19. 支援自動分配：依子任務數量平均分配父任務總價

### 3. 無限拆分子任務 (Infinite Task Hierarchy)

#### 需求清單
1. 使用 Parent-Child 關係建立任務樹
2. 支援無限層級的子任務拆分 (建議最大深度 10 層)
3. 每個子任務都是完整的 Task Entity
4. 使用者在任務詳情頁點擊「新增子任務」
5. 子任務繼承父任務的部分屬性
6. 子任務的總價總和不可超過父任務的總價
7. 支援批次建立子任務
8. 使用 mat-tree 或自訂樹狀元件呈現任務層級
9. 支援展開/收合子任務
10. 使用縮排表示層級關係
11. 父任務顯示子任務數量與完成度摘要
12. 支援拖曳調整層級
13. 支援移動任務到其他父任務下
14. 支援轉換為獨立任務

### 4. 狀態流轉與模組整合

#### 需求清單
1. 任務生命週期：Draft → InProgress → ReadyForQC → QCPassed → ReadyForAcceptance → Accepted → Completed
2. 任何階段可能因失敗流轉到 Blocked 狀態
3. 進度達到 100% 時，自動流轉到 ReadyForQC 狀態
4. ReadyForQC 狀態的任務自動出現在質檢模組的待辦清單
5. QCPassed 狀態的任務自動流轉到 ReadyForAcceptance
6. Accepted 狀態的任務自動流轉到 Completed
7. 任務完成 (100%) 時，發布 TaskReadyForQC 事件
8. 質檢通過時，任務接收 QCPassed 事件
9. 質檢失敗時，任務接收 QCFailed 事件，流轉到 Blocked
10. QC 通過後，任務發布 TaskReadyForAcceptance 事件
11. 驗收通過時，任務接收 AcceptanceApproved 事件
12. 驗收失敗時，任務接收 AcceptanceRejected 事件
13. 任何任務可建立關聯的問題單
14. 任務狀態為 Blocked 時，必須關聯至少一個未解決的問題單
15. 所有關聯問題單解決後，任務自動解除 Blocked 狀態

### 5. 自動化工作流與閉環處理 (Automated Workflow & Closed-Loop Behavior)

#### 需求清單
1. **無人工介入自動流轉**：進度達 100% → 自動發布 TaskReadyForQC → QC 模組自動接收 → QC 通過自動發布 QCPassed → 任務自動流轉 ReadyForAcceptance → Acceptance 模組自動接收
2. **明確的通過/失敗閘門**：
   - QC 閘門：所有必檢項目通過 → QCPassed 事件；任一必檢項目失敗 → QCFailed 事件
   - Acceptance 閘門：所有必檢標準滿足 → AcceptanceApproved 事件；任一標準未滿足 → AcceptanceRejected 事件
3. **失敗自動觸發問題單建立**：
   - 接收 QCFailed 事件 → 任務流轉到 Blocked → 訂閱 IssueCreated 事件確認問題單已建立
   - 接收 AcceptanceRejected 事件 → 任務流轉到 Blocked → 訂閱 IssueCreated 事件確認問題單已建立
4. **閉環行為：問題解決後重新進入適當階段**：
   - 接收 IssueResolved 事件 → 檢查所有關聯問題單是否已解決 → 若全部解決，依問題來源自動流轉：
     - QC 失敗來源：Blocked → InProgress (待開發者重新完成並觸發 100% 進度)
     - Acceptance 失敗來源：Blocked → ReadyForQC (重新經過完整 QC 流程)
   - 發布 TaskUnblocked 事件通知相關模組
5. **異常處理**：任務標記為 Completed 前，系統自動檢查是否有未關閉的問題單，若有則禁止完成並發布 TaskCompletionBlocked 事件

### 6. 提交任務完成數量時自動發布每日紀錄

#### 需求清單
1. 使用者更新任務進度或完成數量時，自動觸發每日紀錄建立
2. 每日紀錄包含：任務 ID、完成數量、工作日期、工作者 ID
3. 若當日已有該任務的記錄，則累加數量
4. 任務進度更新時，發布 TaskProgressUpdated 事件
5. DailyModule 訂閱此事件，自動建立或更新每日紀錄
6. 完成後發布 DailyEntryCreated 事件
7. 提供「自動記錄」開關
8. 關閉時，使用者需手動到 DailyModule 建立記錄

---

## 三、現代化實作要求

### Angular 20+ 最佳實踐

- 使用 signalStore 維護 Map<TaskId, Task> 結構
- 所有視圖使用 computed signal 從同一份資料投影
- 使用 CDK Drag & Drop，拖曳結束時僅 Patch State
- Gantt Chart 使用純 CSS Grid 或 SVG 繪製

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
- **TaskCreated**
- **TaskUpdated**
- **TaskDeleted**
- **TaskProgressUpdated**
- **TaskReadyForQC**
- **TaskReadyForAcceptance**
- **TaskCompleted**
- **TaskAssigneeChanged**
- **TaskUnblocked** (當所有關聯問題單解決後)
- **TaskCompletionBlocked** (當嘗試完成但有未關閉問題單時)

### 訂閱事件 (Subscribed Events)
- **QCPassed**
- **QCFailed**
- **AcceptanceApproved**
- **AcceptanceRejected**
- **IssueCreated** (確認 QC/Acceptance 失敗時問題單已建立)
- **IssueResolved** (觸發檢查是否可解除 Blocked 狀態)
- **WorkspaceSwitched**

### 事件處理原則
1. 事件必須遵循 Append -> Publish -> React 順序
2. 事件 Payload 必須是純資料 DTO
3. 所有事件必須包含 correlationId
4. 禁止在事件中傳遞 Service/Function/UI Reference

---

## 五、架構合規性

### Workspace Context 邊界
- 本模組不修改 Workspace Context
- 不直接依賴其他模組的內部狀態
- 跨模組協作僅透過事件完成

### 模組自主性
- 完全擁有並管理任務狀態與視圖投影
- 不允許其他模組直接讀寫本模組狀態
- 狀態變更必須透過 Domain Event 公告

## 六、禁止事項 (Forbidden Practices)

- ❌ TasksModule 直接修改 Permissions/Issues 狀態
- ❌ 在 Component 中直接操作 Task Entity
- ❌ 視圖切換時重新請求 API
- ❌ 直接修改 Workspace Context 或其他模組狀態
- ❌ 將模組狀態寫入 Workspace Context

---

## 七、測試策略

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

## 八、UI/UX 規範

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

## 九、DDD 實作規範

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

---

## 十一、參考資料

- **父文件**：workspace-modular-architecture_constitution_enhanced.md
- **DDD 規範**：.github/skills/ddd/SKILL.md
- **Angular 文件**：https://angular.dev
- **Angular Material**：https://material.angular.io
- **Tailwind CSS**：https://tailwindcss.com

---

**注意**：本指南必須與父文件保持一致。若有衝突，以父文件為準。

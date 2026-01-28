# 質檢模組 (QualityControlModule) - 開發指南

**模組編號**：05-quality-control
**版本**：2.0
**最後更新**：2026-01-27
**父文件**：workspace-modular-architecture_constitution_enhanced.md

---

## 一、模組概述

### 核心職責
任務產出物的品質驗證關卡

### 邊界定義
僅處理 QC 流程，透過事件訂閱接收待質檢任務，透過事件發布通知質檢結果

### 在架構中的位置
本模組是 Workspace 的能力模組 (Capability Module) 之一，遵循 Domain → Application → Infrastructure → Presentation 的分層架構。模組自主管理自身狀態，不依賴或修改 Workspace Context，僅透過事件與其他模組協作。

---

## 二、功能需求規格

### 1. 質檢項目管理

#### 需求清單
1. 訂閱 TaskReadyForQC 事件，接收到事件時自動建立質檢項目
2. 質檢項目建立後出現在待辦清單
3. 項目屬性：關聯任務 ID、質檢人員、質檢標準、質檢狀態、質檢日期、質檢備註
4. 質檢狀態：Pending, InProgress, Passed, Failed
5. 支援預設範本 (依任務類型)
6. 支援自訂檢查項目
7. 每個項目包含：名稱、描述、是否必檢、檢查結果
8. 所有必檢項目通過才能標記為 Passed

### 2. 質檢流程

#### 需求清單
1. 質檢人員從待辦清單選擇項目
2. 系統顯示任務快照：任務標題、描述、完成數量、附件等
3. 質檢人員依 Checklist 逐項檢查
4. 所有必檢項目標記為 Pass 才能通過
5. 通過時發布 QCPassed 事件 (任務模組訂閱並流轉狀態)
6. (任務模組訂閱 QCPassed 事件後流轉到 ReadyForAcceptance)
7. 至少一個必檢項目標記為 Fail 時不通過
8. 質檢人員必須填寫「缺失原因」
9. 發布 QCFailed 事件 (Issues 模組訂閱並建立問題單)
10. 發布 QCFailed 事件
11. (任務模組訂閱 QCFailed 事件後流轉到 Blocked)

### 3. 自動化質檢閘門與失敗處理 (Automated QC Gates & Failure Handling)

#### 需求清單
1. **自動接收待質檢任務**：訂閱 TaskReadyForQC 事件 → 自動建立 QC 項目 → 出現在質檢待辦清單 → 無需人工觸發
2. **明確的通過/失敗閘門**：
   - **通過條件**：所有必檢項目標記為 Pass → 發布 QCPassed 事件 → 任務自動流轉到 ReadyForAcceptance
   - **失敗條件**：任一必檢項目標記為 Fail → 強制填寫缺失原因 → 發布 QCFailed 事件
3. **失敗自動觸發問題單建立**：
   - QCFailed 事件發布後 → 自動建立問題單：
     - 標題：「[QC 失敗] {任務標題}」
     - 類型：Defect
     - 優先級：繼承任務優先級
     - 指派：任務負責人
   - 發布 IssueCreated 事件 → 問題單與任務建立雙向關聯
4. **閉環行為**：
   - 訂閱 IssueResolved 事件 → 檢查關聯問題單是否已解決
   - 問題單解決後 → 質檢項目狀態重置為 Pending → 可重新開始質檢
   - 任務從 Blocked 流轉回 InProgress 後重新達到 100% → 自動再次進入 QC 流程
5. **異常處理**：QCFailed 事件發布時，若問題單建立失敗，系統記錄異常並保持質檢項目在 Failed 狀態，等待重試

### 3. 質檢不通過流轉到問題單

#### 需求清單
1. 質檢失敗時，發布 QCFailed 事件包含缺失原因與檢查項目
2. (Issues 模組訂閱 QCFailed 並建立問題單，標題：「[QC 失敗] {任務標題}」)
3. (問題單描述由 Issues 模組自動填入事件中的缺失原因與檢查項目)
4. (問題單類型：Defect)
5. (問題單優先級：依事件中的任務優先級設定)
6. (問題單指派：依事件中的任務負責人指派)
7. (Issues 模組發布 IssueCreated 事件，任務模組訂閱並建立關聯)
8. (任務模組處理顯示關聯問題單)
9. (Issues 模組處理顯示關聯任務)
10. 訂閱 IssueResolved 事件，質檢項目重置，可重新質檢

### 4. 質檢歷史與追蹤

#### 需求清單
1. 保留所有質檢歷史記錄
2. 顯示質檢時間、質檢人員、質檢結果、缺失原因
3. 支援查詢任務的所有質檢記錄
4. 質檢通過率 (Pass Rate)
5. 平均質檢時間
6. 常見缺失類型統計
7. 質檢人員工作量統計

---

## 三、現代化實作要求

### Angular 20+ 最佳實踐

- 使用 signalStore 維護 QC 項目 Map<QCId, QCItem>
- 介面應呈現 Task 的 Snapshot (快照) 供對照
- 駁回時必須強制填寫「缺失原因」

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
- **QCPassed** (所有必檢項目通過)
- **QCFailed** (任一必檢項目失敗，包含缺失資訊供 Issues 模組建立問題單)
- **QCStarted**

### 訂閱事件 (Subscribed Events)
- **TaskReadyForQC** (自動建立質檢項目)
- **IssueResolved** (問題單解決後重置質檢項目狀態)
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
- 完全擁有並管理質檢項目與檢查狀態
- 不允許其他模組直接讀寫本模組狀態
- 狀態變更必須透過 Domain Event 公告

## 六、禁止事項 (Forbidden Practices)

- ❌ 直接修改任務狀態，必須透過事件
- ❌ 跨 Workspace 存取質檢項目
- ❌ 繞過 Checklist 強制檢查
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

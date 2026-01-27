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
僅接收已通過 QC 的項目，不涉及技術品質檢查

### 在架構中的位置
本模組是 Workspace 的子模組之一，遵循 Domain → Application → Infrastructure → Presentation 的分層架構。

---

## 二、功能需求規格

### 1. 驗收項目管理

#### 需求清單
1. 僅接收狀態為 ReadyForAcceptance 的任務
2. 系統自動訂閱 TaskReadyForAcceptance 事件
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
5. 通過時發布 AcceptanceApproved 事件
6. 任務狀態自動流轉到 Completed
7. 至少一個標準未滿足時不通過
8. 驗收人員必須填寫「拒絕原因」
9. 系統自動建立問題單
10. 系統發布 AcceptanceRejected 事件
11. 任務狀態流轉到 Blocked

### 4. 驗收不通過流轉到問題單

#### 需求清單
1. 驗收失敗時，系統自動建立問題單
2. 問題單標題：「[驗收失敗] {任務標題}」
3. 問題單描述：自動填入拒絕原因與未滿足的標準
4. 問題單類型：Requirement Change / Defect
5. 問題單優先級：依任務優先級自動設定
6. 問題單指派：自動指派給任務負責人
7. 問題單解決後，任務重新流經 QC → Acceptance 流程
8. 驗收人員可查看問題單的處理記錄

### 5. 驗收歷史與追蹤

#### 需求清單
1. 保留所有驗收歷史記錄
2. 顯示驗收時間、驗收人員、驗收結果、拒絕原因
3. 驗收通過率 (Approval Rate)
4. 平均驗收時間
5. 常見拒絕原因統計

---

## 三、現代化實作要求

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

## 四、事件整合

### 發布事件 (Published Events)
- **AcceptanceApproved**
- **AcceptanceRejected**
- **AcceptanceStarted**

### 訂閱事件 (Subscribed Events)
- **TaskReadyForAcceptance**
- **IssueResolved**
- **WorkspaceSwitched**

### 事件處理原則
1. 事件必須遵循 Append -> Publish -> React 順序
2. 事件 Payload 必須是純資料 DTO
3. 所有事件必須包含 correlationId
4. 禁止在事件中傳遞 Service/Function/UI Reference

---

## 五、禁止事項 (Forbidden Practices)

- ❌ 接收未通過 QC 的任務
- ❌ 直接修改任務狀態，必須透過事件
- ❌ 繞過 Acceptance Criteria 強制檢查

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

## 八、DDD 實作規範

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

## 九、開發檢查清單

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

## 十、參考資料

- **父文件**：workspace-modular-architecture_constitution_enhanced.md
- **DDD 規範**：.github/skills/ddd/SKILL.md
- **Angular 文件**：https://angular.dev
- **Angular Material**：https://material.angular.io
- **Tailwind CSS**：https://tailwindcss.com

---

**注意**：本指南必須與父文件保持一致。若有衝突，以父文件為準。

# 行事曆模組 (CalendarModule) - 開發指南

**模組編號**：11-calendar
**版本**：2.0
**最後更新**：2026-01-27
**父文件**：workspace-modular-architecture_constitution_enhanced.md

---

## 一、模組概述

### 核心職責
以時間維度檢視任務與工作日誌

### 邊界定義
先做出基礎功能，未來擴展

### 在架構中的位置
本模組是 Workspace 的能力模組 (Capability Module) 之一，遵循 Domain → Application → Infrastructure → Presentation 的分層架構。模組自主管理自身狀態，不依賴或修改 Workspace Context，僅透過事件與其他模組協作。作為聚合視圖模組，訂閱其他模組事件進行時間維度資料聚合。

---

## 二、功能需求規格

### 1. 任務行事曆 (基礎版)

#### 需求清單
1. 聚合 TasksModule 的到期日資料
2. 不重新 fetch 資料，訂閱 TasksModule 的 Store
3. 月視圖：顯示整月的任務分佈
4. 週視圖：顯示一週的任務時間軸
5. 日視圖：顯示單日的任務詳細時間
6. 依到期日顯示任務
7. 任務卡片顯示：標題、狀態、優先級
8. 支援點擊任務卡片查看詳情
9. 支援拖曳調整任務到期日

### 2. 工作日誌行事曆 (基礎版)

#### 需求清單
1. 聚合 DailyModule 的工時紀錄
2. 不重新 fetch 資料，訂閱 DailyModule 的 Store
3. 顯示每日的工作記錄
4. 顯示每日的人工/日統計
5. 支援快速新增工作記錄

### 3. 基礎互動

#### 需求清單
1. 支援切換月份 (上一月、下一月、今日)
2. 支援快速跳轉到特定日期
3. 依任務狀態篩選
4. 依任務優先級篩選
5. 依指派人員篩選

### 4. 未來擴展方向

#### 需求清單
1. 會議整合：整合會議行事曆 (Google Calendar, Outlook)
2. 里程碑標記：標記重要日期與里程碑
3. 假日顯示：顯示國定假日與公司休假日
4. 提醒功能：任務到期前自動提醒

---

## 三、現代化實作要求

### Angular 20+ 最佳實踐

- 聚合 TasksModule 與 DailyModule 的資料
- 訂閱原模組的 Store，禁止重新 fetch 資料
- 使用 computed signal 計算不同視圖的資料

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
- 無

### 訂閱事件 (Subscribed Events)
- **TaskCreated**
- **TaskUpdated**
- **DailyEntryCreated**
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
- 僅透過訂閱事件獲取其他模組資訊

### 模組自主性
- 完全擁有並管理行事曆視圖狀態與配置
- 不允許其他模組直接讀寫本模組狀態
- 作為只讀聚合模組，不發布業務事件

### 聚合模組特性
- 訂閱 TasksModule 與 DailyModule 事件
- 不重複請求 API，僅透過事件訂閱獲取資料
- 不實作業務邏輯，僅負責時間維度聚合與視覺化

## 六、禁止事項 (Forbidden Practices)

- ❌ 重新 fetch 資料，應訂閱原模組的 Store
- ❌ 在 CalendarModule 中實作業務邏輯
- ❌ 直接修改 Workspace Context 或其他模組狀態
- ❌ 將聚合資料寫入 Workspace Context

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

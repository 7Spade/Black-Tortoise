# 總覽模組 (OverviewModule) - 開發指南

**模組編號**：08-overview
**版本**：2.0
**最後更新**：2026-01-27
**父文件**：workspace-modular-architecture_constitution_enhanced.md

---

## 一、模組概述

### 核心職責
Workspace 核心指標與活動儀表板，顯示各項數據、負責人、詳細內容

### 邊界定義
僅負責資料聚合與視覺化，不涉及具體業務邏輯

### 在架構中的位置
本模組是 Workspace 的子模組之一，遵循 Domain → Application → Infrastructure → Presentation 的分層架構。

---

## 二、功能需求規格

### 1. 核心指標儀表板

#### 需求清單
1. 任務總數 / 進行中 / 已完成 / 已封鎖
2. 問題單總數 / 開啟 / 已解決
3. 質檢通過率 / 驗收通過率
4. 本週完成任務數 / 本月完成任務數
5. 團隊成員總數 / 活躍成員數
6. 文件總數 / 本週新增文件數
7. 使用卡片 (Cards) 呈現各指標
8. 支援點擊卡片跳轉到詳細模組
9. 支援自訂 Widget 排列順序
10. 支援隱藏/顯示特定 Widget

### 2. 活動時間軸

#### 需求清單
1. 顯示 Workspace 內的最近活動 (最近 50 條)
2. 活動類型：任務建立、任務完成、問題單建立、文件上傳、成員加入等
3. 每條活動包含：時間、操作者、操作類型、操作對象、描述
4. 依活動類型篩選
5. 依操作者篩選
6. 依時間範圍篩選
7. 支援關鍵字搜尋

### 3. 負責人視圖

#### 需求清單
1. 顯示各任務的負責人與進度
2. 支援依負責人分組顯示
3. 顯示負責人的工作負載
4. 顯示團隊成員列表與角色
5. 顯示每個成員的活躍度
6. 顯示每個成員的貢獻度

### 4. 圖表與視覺化

#### 需求清單
1. 燃盡圖：顯示任務剩餘數量趨勢
2. 燃起圖：顯示任務完成數量累積
3. 甘特圖摘要：顯示重要任務的時間軸
4. 問題單趨勢圖：每週新增 vs 解決數量
5. 問題單類型分佈 (圓餅圖)
6. 團隊工作量圖 (長條圖)
7. 各成員活躍度 (雷達圖)

### 5. 響應式佈局

#### 需求清單
1. 使用 Grid Layout 排列 Widget
2. 支援響應式設計：桌面 (3 欄)、平板 (2 欄)、手機 (1 欄)
3. 支援拖曳調整 Widget 位置與大小
4. 使用者可自訂要顯示的 Widget
5. 使用者可自訂 Widget 的順序與大小
6. 設定儲存在使用者偏好中，跨裝置同步

---

## 三、現代化實作要求

### Angular 20+ 最佳實踐

- 聚合各模組關鍵資訊
- 支援響應式佈局
- 訂閱所有模組的關鍵事件，即時更新儀表板

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
- **TaskCompleted**
- **IssueCreated**
- **IssueResolved**
- **DocumentUploaded**
- **MemberAdded**
- **DailyEntryCreated**
- **WorkspaceSwitched**

### 事件處理原則
1. 事件必須遵循 Append -> Publish -> React 順序
2. 事件 Payload 必須是純資料 DTO
3. 所有事件必須包含 correlationId
4. 禁止在事件中傳遞 Service/Function/UI Reference

---

## 五、禁止事項 (Forbidden Practices)

- ❌ 重複請求 API，應訂閱原模組的 Store
- ❌ 在 OverviewModule 中實作業務邏輯
- ❌ 直接修改其他模組的狀態

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

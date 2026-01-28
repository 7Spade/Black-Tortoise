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
本模組是 Workspace 的能力模組 (Capability Module) 之一，遵循 Domain → Application → Infrastructure → Presentation 的分層架構。模組自主管理自身狀態，不依賴或修改 Workspace Context，僅透過事件與其他模組協作。作為聚合視圖模組，訂閱其他模組事件進行資料聚合展示。

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
├── domain/overview/
│   ├── aggregates/
│   │   └── dashboard-config.aggregate.ts
│   ├── value-objects/
│   │   ├── widget-id.vo.ts
│   │   ├── widget-type.vo.ts
│   │   └── widget-position.vo.ts
│   └── repositories/
│       └── dashboard-config.repository.interface.ts
│
├── application/overview/
│   ├── commands/
│   │   ├── update-widget-layout.command.ts
│   │   └── toggle-widget.command.ts
│   ├── handlers/
│   │   ├── task-created-event.handler.ts
│   │   ├── task-completed-event.handler.ts
│   │   ├── issue-created-event.handler.ts
│   │   ├── document-uploaded-event.handler.ts
│   │   └── update-widget-layout.handler.ts
│   ├── queries/
│   │   ├── get-dashboard-metrics.query.ts
│   │   └── get-activity-timeline.query.ts
│   ├── models/
│   │   └── dashboard-metrics.model.ts
│   └── stores/
│       └── overview.store.ts
│
├── infrastructure/overview/
│   ├── models/
│   │   └── dashboard-config.dto.ts
│   ├── mappers/
│   │   └── dashboard-config.mapper.ts
│   ├── repositories/
│   │   └── dashboard-config.repository.ts
│   └── adapters/
│       └── firebase-overview.adapter.ts
│
└── presentation/overview/
    ├── components/
    │   ├── metrics-card/
    │   ├── activity-timeline/
    │   ├── chart-widgets/
    │   └── dashboard-grid/
    └── pages/
        └── overview-page.component.ts
```

---

## 五、預計新增檔案

### Domain Layer (src/app/domain/overview/)
- `aggregates/dashboard-config.aggregate.ts` - 儀表板配置聚合根
- `value-objects/widget-id.vo.ts` - Widget ID 值物件
- `value-objects/widget-type.vo.ts` - Widget 類型值物件
- `value-objects/widget-position.vo.ts` - Widget 位置值物件
- `repositories/dashboard-config.repository.interface.ts` - Repository 介面

### Application Layer (src/app/application/overview/)
- `commands/update-widget-layout.command.ts` - 更新 Widget 佈局命令
- `commands/toggle-widget.command.ts` - 切換 Widget 顯示命令
- `handlers/task-created-event.handler.ts` - 任務建立事件處理器
- `handlers/task-completed-event.handler.ts` - 任務完成事件處理器
- `handlers/issue-created-event.handler.ts` - 問題單建立事件處理器
- `handlers/document-uploaded-event.handler.ts` - 文件上傳事件處理器
- `handlers/update-widget-layout.handler.ts` - 更新佈局處理器
- `queries/get-dashboard-metrics.query.ts` - 取得儀表板指標查詢
- `queries/get-activity-timeline.query.ts` - 取得活動時間軸查詢
- `models/dashboard-metrics.model.ts` - 儀表板指標讀取模型
- `stores/overview.store.ts` - 總覽 Signal Store

### Infrastructure Layer (src/app/infrastructure/overview/)
- `models/dashboard-config.dto.ts` - 儀表板配置資料傳輸物件
- `mappers/dashboard-config.mapper.ts` - 儀表板配置資料映射器
- `repositories/dashboard-config.repository.ts` - Repository 實作
- `adapters/firebase-overview.adapter.ts` - Firebase 適配器

### Presentation Layer (src/app/presentation/overview/)
- `components/metrics-card/metrics-card.component.ts` - 指標卡片元件
- `components/activity-timeline/activity-timeline.component.ts` - 活動時間軸元件
- `components/chart-widgets/chart-widgets.component.ts` - 圖表 Widget 元件
- `components/dashboard-grid/dashboard-grid.component.ts` - 儀表板網格元件
- `pages/overview-page.component.ts` - 總覽頁面元件

---

## 六、功能需求規格

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

## 七、現代化實作要求

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

## 八、事件整合

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

## 九、架構合規性

### Workspace Context 邊界
- 本模組不修改 Workspace Context
- 不直接依賴其他模組的內部狀態
- 僅透過訂閱事件獲取其他模組資訊

### 模組自主性
- 完全擁有並管理聚合視圖狀態與儀表板配置
- 不允許其他模組直接讀寫本模組狀態
- 作為只讀聚合模組，不發布業務事件

### 聚合模組特性
- 訂閱所有模組關鍵事件，即時更新儀表板
- 不重複請求 API，僅透過事件訂閱獲取資料
- 不實作業務邏輯，僅負責資料聚合與視覺化

## 十、禁止事項 (Forbidden Practices)

- ❌ 重複請求 API，應訂閱原模組的 Store
- ❌ 在 OverviewModule 中實作業務邏輯
- ❌ 直接修改其他模組的狀態
- ❌ 直接修改 Workspace Context
- ❌ 將聚合資料寫入 Workspace Context

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

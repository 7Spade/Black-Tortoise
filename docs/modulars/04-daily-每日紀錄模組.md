# 每日紀錄模組 (DailyModule) - 開發指南

**模組編號**：04-daily
**版本**：2.0
**最後更新**：2026-01-27
**父文件**：workspace-modular-architecture_constitution_enhanced.md

---

## 一、模組概述

### 核心職責
個人工作日誌 (Worklog)，記錄每日工作內容與工時

### 邊界定義
傳統產業使用，不按時數計算，只按人工/日計數

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
├── domain/daily/
│   ├── aggregates/
│   │   └── daily-entry.aggregate.ts
│   ├── value-objects/
│   │   ├── daily-entry-id.vo.ts
│   │   ├── man-day.vo.ts
│   │   └── work-date.vo.ts
│   ├── events/
│   │   ├── daily-entry-created.event.ts
│   │   └── daily-entry-updated.event.ts
│   └── repositories/
│       └── daily-entry.repository.interface.ts
│
├── application/daily/
│   ├── commands/
│   │   ├── create-daily-entry.command.ts
│   │   ├── update-daily-entry.command.ts
│   │   └── batch-create-entries.command.ts
│   ├── handlers/
│   │   ├── create-daily-entry.handler.ts
│   │   ├── task-progress-updated-event.handler.ts
│   │   └── batch-create-entries.handler.ts
│   ├── queries/
│   │   ├── get-daily-entries.query.ts
│   │   └── get-weekly-summary.query.ts
│   ├── models/
│   │   └── weekly-summary.model.ts
│   └── stores/
│       └── daily.store.ts
│
├── infrastructure/daily/
│   ├── models/
│   │   └── daily-entry.dto.ts
│   ├── mappers/
│   │   └── daily-entry.mapper.ts
│   ├── repositories/
│   │   └── daily-entry.repository.ts
│   └── adapters/
│       └── firebase-daily.adapter.ts
│
└── presentation/daily/
    ├── components/
    │   ├── daily-entry-form/
    │   ├── daily-entry-list/
    │   └── weekly-summary/
    └── pages/
        └── daily-page.component.ts
```

---

## 五、預計新增檔案

### Domain Layer (src/app/domain/daily/)
- `aggregates/daily-entry.aggregate.ts` - 每日紀錄聚合根
- `value-objects/daily-entry-id.vo.ts` - 紀錄 ID 值物件
- `value-objects/man-day.vo.ts` - 人工/日值物件
- `value-objects/work-date.vo.ts` - 工作日期值物件
- `events/daily-entry-created.event.ts` - 紀錄建立事件
- `events/daily-entry-updated.event.ts` - 紀錄更新事件
- `repositories/daily-entry.repository.interface.ts` - Repository 介面

### Application Layer (src/app/application/daily/)
- `commands/create-daily-entry.command.ts` - 建立紀錄命令
- `commands/update-daily-entry.command.ts` - 更新紀錄命令
- `commands/batch-create-entries.command.ts` - 批次建立命令
- `handlers/create-daily-entry.handler.ts` - 建立紀錄處理器
- `handlers/task-progress-updated-event.handler.ts` - 任務進度更新事件處理器
- `handlers/batch-create-entries.handler.ts` - 批次建立處理器
- `queries/get-daily-entries.query.ts` - 取得紀錄查詢
- `queries/get-weekly-summary.query.ts` - 取得週摘要查詢
- `models/weekly-summary.model.ts` - 週摘要讀取模型
- `stores/daily.store.ts` - 每日紀錄 Signal Store

### Infrastructure Layer (src/app/infrastructure/daily/)
- `models/daily-entry.dto.ts` - 每日紀錄資料傳輸物件
- `mappers/daily-entry.mapper.ts` - 每日紀錄資料映射器
- `repositories/daily-entry.repository.ts` - Repository 實作
- `adapters/firebase-daily.adapter.ts` - Firebase 適配器

### Presentation Layer (src/app/presentation/daily/)
- `components/daily-entry-form/daily-entry-form.component.ts` - 紀錄表單元件
- `components/daily-entry-list/daily-entry-list.component.ts` - 紀錄列表元件
- `components/weekly-summary/weekly-summary.component.ts` - 週摘要元件
- `pages/daily-page.component.ts` - 每日紀錄頁面元件

---

## 六、功能需求規格

### 1. 傳統產業工時計算

#### 需求清單
1. 不記錄具體工作時數 (小時)
2. 僅記錄人工/日 (Man-Day)
3. 例如：1 人工作 1 天 = 1 人工/日
4. 支援全日 (1.0)、半日 (0.5)、四分之一日 (0.25)
5. 支援自訂數值 (0.1 ~ 1.0)
6. 一個人一天的總人工/日不可超過 1.0
7. 必須關聯到具體任務
8. 記錄工作描述 (選填)
9. 記錄完成數量 (與任務進度同步)

### 2. 快速填寫介面

#### 需求清單
1. 自動列出使用者今日參與的所有任務
2. 支援快速選擇任務並填寫人工/日
3. 支援批次提交
4. 顯示過去 7 天的工作記錄
5. 支援複製昨日記錄到今日
6. 支援修改歷史記錄 (僅限本週)
7. 顯示本週累計人工/日
8. 顯示本月累計人工/日
9. 顯示各任務的人工/日分佈 (圓餅圖)

### 3. 自動記錄與手動記錄

#### 需求清單
1. 當任務進度更新時，自動建立每日紀錄
2. 自動計算人工/日 (依進度變化比例)
3. 使用者可調整自動產生的記錄
4. 使用者可手動新增任何任務的工作記錄
5. 支援補登過去的記錄 (限定過去 30 天)
6. 同一天同一任務不可重複記錄，僅能累加
7. 一天的總人工/日不可超過 1.0
8. 任務已完成後，不可再記錄人工/日

### 4. 團隊工時統計

#### 需求清單
1. 主管可查看團隊成員的每日紀錄
2. 支援依成員、依任務、依日期篩選
3. 支援匯出為 Excel / CSV
4. 團隊本週人工/日趨勢圖 (折線圖)
5. 各任務人工/日分佈 (長條圖)
6. 各成員人工/日比較 (雷達圖)

---

## 七、現代化實作要求

### Angular 20+ 最佳實踐

- 使用 signalStore 維護每日紀錄 Map<Date, DailyEntry[]>
- 提交時自動計算工時並發布統計事件
- 使用 computed signal 自動關聯當日活躍 Task

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
- **DailyEntryCreated**
- **DailyEntryUpdated**

### 訂閱事件 (Subscribed Events)
- **TaskProgressUpdated**
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
- 完全擁有並管理每日紀錄狀態
- 不允許其他模組直接讀寫本模組狀態
- 狀態變更必須透過 Domain Event 公告

## 十、禁止事項 (Forbidden Practices)

- ❌ 記錄超過 1.0 人工/日
- ❌ 跨 Workspace 查看或修改記錄
- ❌ 在 Component 中直接計算統計資料
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

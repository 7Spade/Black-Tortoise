# 設定模組 (SettingsModule) - 開發指南

**模組編號**：12-settings
**版本**：2.0
**最後更新**：2026-01-27
**父文件**：workspace-modular-architecture_constitution_enhanced.md

---

## 一、模組概述

### 核心職責
管理 Workspace 及模組的全域設定

### 邊界定義
先做出基礎功能，未來擴展

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
├── domain/settings/
│   ├── aggregates/
│   │   └── workspace-settings.aggregate.ts
│   ├── entities/
│   │   ├── module-config.entity.ts
│   │   └── notification-config.entity.ts
│   ├── value-objects/
│   │   ├── settings-id.vo.ts
│   │   ├── locale.vo.ts
│   │   └── timezone.vo.ts
│   ├── events/
│   │   └── settings-changed.event.ts
│   └── repositories/
│       └── workspace-settings.repository.interface.ts
│
├── application/settings/
│   ├── commands/
│   │   ├── update-workspace-info.command.ts
│   │   ├── toggle-module.command.ts
│   │   └── update-notification-config.command.ts
│   ├── handlers/
│   │   ├── update-workspace-info.handler.ts
│   │   ├── toggle-module.handler.ts
│   │   └── update-notification-config.handler.ts
│   ├── queries/
│   │   └── get-workspace-settings.query.ts
│   └── stores/
│       └── settings.store.ts
│
├── infrastructure/settings/
│   ├── repositories/
│   │   └── workspace-settings.repository.ts
│   └── adapters/
│       └── firebase-settings.adapter.ts
│
└── presentation/settings/
    ├── components/
    │   ├── workspace-info-form/
    │   ├── module-toggles/
    │   └── notification-settings/
    └── pages/
        └── settings-page.component.ts
```

---

## 五、預計新增檔案

### Domain Layer (src/app/domain/settings/)
- `aggregates/workspace-settings.aggregate.ts` - Workspace 設定聚合根
- `entities/module-config.entity.ts` - 模組配置實體
- `entities/notification-config.entity.ts` - 通知配置實體
- `value-objects/settings-id.vo.ts` - 設定 ID 值物件
- `value-objects/locale.vo.ts` - 語言設定值物件
- `value-objects/timezone.vo.ts` - 時區值物件
- `events/settings-changed.event.ts` - 設定變更事件
- `repositories/workspace-settings.repository.interface.ts` - Repository 介面

### Application Layer (src/app/application/settings/)
- `commands/update-workspace-info.command.ts` - 更新 Workspace 資訊命令
- `commands/toggle-module.command.ts` - 切換模組命令
- `commands/update-notification-config.command.ts` - 更新通知配置命令
- `handlers/update-workspace-info.handler.ts` - 更新 Workspace 資訊處理器
- `handlers/toggle-module.handler.ts` - 切換模組處理器
- `handlers/update-notification-config.handler.ts` - 更新通知配置處理器
- `queries/get-workspace-settings.query.ts` - 取得 Workspace 設定查詢
- `stores/settings.store.ts` - 設定 Signal Store

### Infrastructure Layer (src/app/infrastructure/settings/)
- `repositories/workspace-settings.repository.ts` - Repository 實作
- `adapters/firebase-settings.adapter.ts` - Firebase 適配器

### Presentation Layer (src/app/presentation/settings/)
- `components/workspace-info-form/workspace-info-form.component.ts` - Workspace 資訊表單元件
- `components/module-toggles/module-toggles.component.ts` - 模組切換元件
- `components/notification-settings/notification-settings.component.ts` - 通知設定元件
- `pages/settings-page.component.ts` - 設定頁面元件

---

## 六、功能需求規格

### 1. Workspace 基本設定 (基礎版)

#### 需求清單
1. Workspace 名稱 (可編輯)
2. Workspace 描述 (可編輯)
3. Workspace 圖示 (可上傳)
4. Workspace 建立時間 (唯讀)
5. Workspace 建立者 (唯讀)
6. 時區設定
7. 語言設定 (中文、英文等)
8. 日期格式 (YYYY-MM-DD, DD/MM/YYYY 等)
9. 貨幣設定 (用於任務單價)

### 2. 模組啟用/停用 (基礎版)

#### 需求清單
1. 顯示所有可用模組列表
2. 支援啟用/停用特定模組
3. 停用的模組在導航列中隱藏
4. Tasks, Members, Overview 預設啟用，不可停用
5. 其他模組可自由啟用/停用

### 3. 通知設定 (基礎版)

#### 需求清單
1. 通知類型：任務指派通知、任務到期提醒、問題單建立通知、質檢/驗收結果通知
2. 通知方式：Email 通知、In-App 通知
3. 支援為每種通知類型選擇通知方式

### 4. 設定變更事件

#### 需求清單
1. 設定變更必須發布 SettingsChanged 事件
2. 相關模組訂閱此事件，調整行為
3. 記錄設定變更歷史
4. 支援回滾到先前的設定版本 (Optional)

### 5. 未來擴展方向

#### 需求清單
1. 主題設定：支援深色模式、淺色模式、自訂主題色
2. 權限範本：預設的角色權限範本管理
3. 整合設定：第三方服務整合 (Google Drive, Slack, Jira 等)
4. 自動化規則：自訂工作流自動化規則

---

## 七、現代化實作要求

### Angular 20+ 最佳實踐

- 使用 signalStore 維護設定 Map<SettingKey, SettingValue>
- 設定變更必須發布事件，通知相關模組調整行為
- 提供統一的設定介面，支援即時更新與版本控制

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
- **SettingsChanged**

### 訂閱事件 (Subscribed Events)
- **WorkspaceSwitched**

### 事件處理原則
1. 事件必須遵循 Append -> Publish -> React 順序
2. 事件 Payload 必須是純資料 DTO
3. 所有事件必須包含 correlationId
4. 禁止在事件中傳遞 Service/Function/UI Reference

---

## 九、架構合規性

### Workspace Context 邊界
- 本模組管理 Workspace 層級設定，但不修改 Workspace Context 本身
- 不直接依賴其他模組的內部狀態
- 跨模組協作僅透過事件完成

### 模組自主性
- 完全擁有並管理 Workspace 設定狀態
- 不允許其他模組直接讀寫本模組狀態
- 設定變更必須透過 SettingsChanged 事件通知相關模組

### 設定模組特性
- 管理 Workspace 全域設定與偏好
- 設定變更發布事件，讓其他模組調整行為
- 不直接調用其他模組方法，僅透過事件通知

## 十、禁止事項 (Forbidden Practices)

- ❌ 未發布事件就變更設定
- ❌ 跨 Workspace 共享設定
- ❌ 在 Component 中直接修改設定
- ❌ 直接修改 Workspace Context
- ❌ 直接調用其他模組方法改變其行為

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

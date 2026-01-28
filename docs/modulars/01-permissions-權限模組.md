# 權限模組 (PermissionsModule) - 開發指南

**模組編號**：01-permissions
**版本**：2.0
**最後更新**：2026-01-27
**父文件**：workspace-modular-architecture_constitution_enhanced.md

---

## 一、模組概述

### 核心職責
管理 Workspace 內的權限矩陣 (RBAC) 與自訂角色

### 邊界定義
僅處理「誰可以做什麼」，不涉及身份識別 (Identity)

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
├── domain/permissions/
│   ├── aggregates/
│   │   └── permission-matrix.aggregate.ts
│   ├── entities/
│   │   ├── role.entity.ts
│   │   └── permission.entity.ts
│   ├── value-objects/
│   │   ├── role-id.vo.ts
│   │   ├── permission-id.vo.ts
│   │   └── resource-action.vo.ts
│   ├── events/
│   │   ├── permission-changed.event.ts
│   │   ├── role-created.event.ts
│   │   ├── role-updated.event.ts
│   │   └── role-deleted.event.ts
│   └── repositories/
│       └── permission-matrix.repository.interface.ts
│
├── application/permissions/
│   ├── commands/
│   │   ├── create-role.command.ts
│   │   ├── update-role.command.ts
│   │   ├── delete-role.command.ts
│   │   └── update-permissions.command.ts
│   ├── handlers/
│   │   ├── create-role.handler.ts
│   │   ├── update-role.handler.ts
│   │   ├── delete-role.handler.ts
│   │   └── update-permissions.handler.ts
│   ├── queries/
│   │   ├── get-permission-matrix.query.ts
│   │   └── get-roles.query.ts
│   ├── models/
│   │   └── permission-check-result.model.ts
│   └── stores/
│       └── permissions.store.ts
│
├── infrastructure/permissions/
│   ├── repositories/
│   │   └── permission-matrix.repository.ts
│   ├── adapters/
│       └── firebase-permissions.adapter.ts
│   ├── models/
│   │   └── permission-matrix.dto.ts
│   └── mappers/
│       └── permission-matrix.mapper.ts
│
└── presentation/permissions/
    ├── components/
    │   ├── permission-matrix/
    │   │   ├── permission-matrix.component.ts
    │   │   ├── permission-matrix.component.html
    │   │   └── permission-matrix.component.scss
    │   ├── role-editor/
    │   │   ├── role-editor.component.ts
    │   │   ├── role-editor.component.html
    │   │   └── role-editor.component.scss
    │   └── role-list/
    │       ├── role-list.component.ts
    │       ├── role-list.component.html
    │       └── role-list.component.scss
    └── pages/
        └── permissions-page.component.ts
```

---

## 五、預計新增檔案

### Domain Layer (src/app/domain/permissions/)
- `aggregates/permission-matrix.aggregate.ts` - 權限矩陣聚合根
- `entities/role.entity.ts` - 角色實體
- `entities/permission.entity.ts` - 權限實體
- `value-objects/role-id.vo.ts` - 角色 ID 值物件
- `value-objects/permission-id.vo.ts` - 權限 ID 值物件
- `value-objects/resource-action.vo.ts` - 資源操作值物件
- `events/permission-changed.event.ts` - 權限變更事件
- `events/role-created.event.ts` - 角色建立事件
- `events/role-updated.event.ts` - 角色更新事件
- `events/role-deleted.event.ts` - 角色刪除事件
- `repositories/permission-matrix.repository.interface.ts` - Repository 介面

### Application Layer (src/app/application/permissions/)
- `commands/create-role.command.ts` - 建立角色命令
- `commands/update-role.command.ts` - 更新角色命令
- `commands/delete-role.command.ts` - 刪除角色命令
- `commands/update-permissions.command.ts` - 更新權限命令
- `handlers/create-role.handler.ts` - 建立角色處理器
- `handlers/update-role.handler.ts` - 更新角色處理器
- `handlers/delete-role.handler.ts` - 刪除角色處理器
- `handlers/update-permissions.handler.ts` - 更新權限處理器
- `queries/get-permission-matrix.query.ts` - 取得權限矩陣查詢
- `queries/get-roles.query.ts` - 取得角色列表查詢
- `models/permission-check-result.model.ts` - 權限檢查結果模型
- `stores/permissions.store.ts` - 權限 Signal Store

### Infrastructure Layer (src/app/infrastructure/permissions/)
- `repositories/permission-matrix.repository.ts` - Repository 實作
- `adapters/firebase-permissions.adapter.ts` - Firebase 適配器
- `models/permission-matrix.dto.ts` - 權限矩陣 DTO/Schema
- `mappers/permission-matrix.mapper.ts` - 權限矩陣資料轉換器

### Presentation Layer (src/app/presentation/permissions/)
- `components/permission-matrix/permission-matrix.component.ts` - 權限矩陣元件
- `components/permission-matrix/permission-matrix.component.html` - 權限矩陣模板
- `components/permission-matrix/permission-matrix.component.scss` - 權限矩陣樣式
- `components/role-editor/role-editor.component.ts` - 角色編輯器元件
- `components/role-editor/role-editor.component.html` - 角色編輯器模板
- `components/role-editor/role-editor.component.scss` - 角色編輯器樣式
- `components/role-list/role-list.component.ts` - 角色列表元件
- `components/role-list/role-list.component.html` - 角色列表模板
- `components/role-list/role-list.component.scss` - 角色列表樣式
- `pages/permissions-page.component.ts` - 權限頁面元件

---

## 六、功能需求規格

### 1. 權限矩陣 (Permission Matrix)

#### 需求清單
1. 使用 Map<RoleId, Set<PermissionId>> 結構儲存角色-權限映射
2. 權限必須細粒度化 (tasks:create, tasks:edit, tasks:delete, qc:approve)
3. 支援資源層級權限 (resource-level permissions)
4. 二維矩陣視圖：行為角色，列為資源/操作
5. 支援 Sticky Headers (凍結行列標題)
6. 單元格使用 mat-checkbox，支援批次操作
7. 樂觀更新 (Optimistic Update)
8. 批次操作支援：選擇多個角色，一次性授予/撤銷權限
9. 變更歷史：顯示誰在何時修改了哪些權限
10. 權限繼承：子資源繼承父資源的權限設定
11. 權限覆蓋：特定資源可覆蓋繼承的權限

### 2. 自訂角色 (Custom Roles)

#### 需求清單
1. 支援建立/編輯/刪除自訂角色 (除系統預設角色外)
2. 角色必須包含：名稱、描述、權限集合、顏色標記
3. 角色命名規則：不可與現有角色重複，長度 3-30 字元
4. 提供常用角色範本：專案經理、開發人員、測試人員、訪客
5. 系統預設角色：Owner > Admin > Member > Viewer
6. Owner 不可刪除，每個 Workspace 至少一個 Owner
7. 自訂角色可設定優先級 (用於權限衝突時的判定)
8. 支援將角色指派給成員
9. 一個成員可擁有多個角色，有效權限為所有角色的聯集
10. 角色變更立即生效，無需重新登入

---

## 七、現代化實作要求

### Angular 20+ 最佳實踐

- 使用 signalStore 維護 Map<Role, Permission[]> 結構
- 權限檢查使用 computed signal 而非每次呼叫函數
- 角色或權限變更必須發布 PermissionChanged / RoleUpdated 事件

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
- **PermissionChanged**
- **RoleCreated**
- **RoleUpdated**
- **RoleDeleted**

### 訂閱事件 (Subscribed Events)
- **MemberRoleChanged**
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
- 完全擁有並管理權限矩陣與角色狀態
- 不允許其他模組直接讀寫本模組狀態
- 狀態變更必須透過 Domain Event 公告

## 十、禁止事項 (Forbidden Practices)

- ❌ 將「我是誰」的判斷混入此模組 (那是 Identity 的職責)
- ❌ 在 Component 中直接操作權限資料，必須透過 Store
- ❌ 跨 Workspace 共享權限資料
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

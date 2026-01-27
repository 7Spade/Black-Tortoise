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
本模組是 Workspace 的子模組之一，遵循 Domain → Application → Infrastructure → Presentation 的分層架構。

---

## 二、功能需求規格

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

## 三、現代化實作要求

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

## 四、事件整合

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

## 五、禁止事項 (Forbidden Practices)

- ❌ 將「我是誰」的判斷混入此模組 (那是 Identity 的職責)
- ❌ 在 Component 中直接操作權限資料，必須透過 Store
- ❌ 跨 Workspace 共享權限資料

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

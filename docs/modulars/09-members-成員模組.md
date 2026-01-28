# 成員模組 (MembersModule) - 開發指南

**模組編號**：09-members
**版本**：2.0
**最後更新**：2026-01-27
**父文件**：workspace-modular-architecture_constitution_enhanced.md

---

## 一、模組概述

### 核心職責
團隊成員管理與角色分配

### 邊界定義
建立工作區時自動將建立人加入，避免成員列表為空

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
src/app/modules/
├── members/domain/
│   ├── aggregates/
│   │   └── member.aggregate.ts
│   ├── value-objects/
│   │   ├── member-id.vo.ts
│   │   ├── member-status.vo.ts
│   │   └── invitation-token.vo.ts
│   ├── events/
│   │   ├── member-added.event.ts
│   │   ├── member-removed.event.ts
│   │   ├── member-role-changed.event.ts
│   │   └── member-invited.event.ts
│   └── repositories/
│       └── member.repository.interface.ts
│
├── members/application/
│   ├── commands/
│   │   ├── add-member.command.ts
│   │   ├── remove-member.command.ts
│   │   ├── assign-role.command.ts
│   │   └── invite-member.command.ts
│   ├── handlers/
│   │   ├── workspace-created-event.handler.ts
│   │   ├── add-member.handler.ts
│   │   ├── remove-member.handler.ts
│   │   └── assign-role.handler.ts
│   ├── queries/
│   │   ├── get-members.query.ts
│   │   └── get-member-by-id.query.ts
│   ├── models/
│   │   └── member-list-view.model.ts
│   └── stores/
│       └── members.store.ts
│
├── members/infrastructure/
│   ├── models/
│   │   └── member.dto.ts
│   ├── mappers/
│   │   └── member.mapper.ts
│   ├── repositories/
│   │   └── member.repository.ts
│   └── adapters/
│       └── firebase-members.adapter.ts
│
└── members/presentation/
    ├── components/
    │   ├── member-list/
    │   ├── member-invitation/
    │   └── member-detail/
    └── pages/
        └── members-page.component.ts
```

---

## 五、預計新增檔案

### Domain Layer (src/app/modules/members/domain/)
- `aggregates/member.aggregate.ts` - 成員聚合根
- `value-objects/member-id.vo.ts` - 成員 ID 值物件
- `value-objects/member-status.vo.ts` - 成員狀態值物件
- `value-objects/invitation-token.vo.ts` - 邀請 Token 值物件
- `events/member-added.event.ts` - 成員加入事件
- `events/member-removed.event.ts` - 成員移除事件
- `events/member-role-changed.event.ts` - 成員角色變更事件
- `events/member-invited.event.ts` - 成員邀請事件
- `repositories/member.repository.interface.ts` - Repository 介面

### Application Layer (src/app/modules/members/application/)
- `commands/add-member.command.ts` - 加入成員命令
- `commands/remove-member.command.ts` - 移除成員命令
- `commands/assign-role.command.ts` - 指派角色命令
- `commands/invite-member.command.ts` - 邀請成員命令
- `handlers/workspace-created-event.handler.ts` - Workspace 建立事件處理器
- `handlers/add-member.handler.ts` - 加入成員處理器
- `handlers/remove-member.handler.ts` - 移除成員處理器
- `handlers/assign-role.handler.ts` - 指派角色處理器
- `queries/get-members.query.ts` - 取得成員列表查詢
- `queries/get-member-by-id.query.ts` - 依 ID 取得成員查詢
- `models/member-list-view.model.ts` - 成員列表讀取模型
- `stores/members.store.ts` - 成員 Signal Store

### Infrastructure Layer (src/app/modules/members/infrastructure/)
- `models/member.dto.ts` - 成員資料傳輸物件
- `mappers/member.mapper.ts` - 成員資料映射器
- `repositories/member.repository.ts` - Repository 實作
- `adapters/firebase-members.adapter.ts` - Firebase 適配器

### Presentation Layer (src/app/modules/members/presentation/)
- `components/member-list/member-list.component.ts` - 成員列表元件
- `components/member-invitation/member-invitation.component.ts` - 成員邀請元件
- `components/member-detail/member-detail.component.ts` - 成員詳情元件
- `pages/members-page.component.ts` - 成員頁面元件

---

## 六、功能需求規格

### 1. 成員列表管理

#### 需求清單
1. 成員屬性：使用者 ID、名稱、電子郵件、角色、加入時間、最後活躍時間、狀態
2. 狀態：Active, Inactive, Suspended
3. 顯示所有成員，支援排序、篩選
4. 依角色篩選
5. 依狀態篩選
6. 搜尋成員 (名稱、電子郵件)

### 2. 建立工作區時自動加入建立人

#### 需求清單
1. 建立 Workspace 時，系統自動將建立人加入成員列表
2. 建立人預設角色為 Owner
3. 確保成員列表不為空
4. CreateWorkspaceUseCase 執行時，同時建立 Workspace 與加入建立人
5. 發布 WorkspaceCreated 與 MemberAdded 事件

### 3. 邀請成員

#### 需求清單
1. 透過電子郵件邀請
2. 透過邀請連結
3. 透過使用者名稱搜尋並邀請
4. 管理員輸入邀請對象的電子郵件或選擇使用者
5. 選擇要授予的角色 (可多選)
6. 系統發送邀請通知
7. 受邀者接受邀請後，自動加入成員列表
8. 發布 MemberInvited 事件
9. 顯示待處理的邀請列表
10. 支援撤銷邀請
11. 支援重新發送邀請
12. 邀請有效期 (預設 7 天)

### 4. 移除成員

#### 需求清單
1. 僅 Owner 和 Admin 可移除成員
2. 不可移除自己
3. 不可移除最後一個 Owner
4. 管理員選擇要移除的成員
5. 系統提示確認
6. 確認後，移除成員並發布 MemberRemoved 事件
7. 成員的任務指派與權限自動清除
8. 成員無法再存取該 Workspace
9. 成員的歷史記錄與貢獻保留
10. 成員的任務指派需重新分配 (系統提示)

### 5. 角色分配與變更

#### 需求清單
1. 支援為成員分配多個角色
2. 支援批次分配角色
3. 角色變更立即生效
4. 管理員選擇成員，編輯其角色
5. 系統驗證權限
6. 確認後，更新成員角色並發布 MemberRoleChanged 事件
7. PermissionsModule 訂閱此事件，更新權限快取

### 6. 成員活躍度與統計

#### 需求清單
1. 記錄成員的最後活躍時間
2. 記錄成員的操作次數
3. 顯示成員的任務完成數、問題單解決數、文件上傳數
4. 顯示成員的貢獻度排行榜

---

## 七、現代化實作要求

### Angular 20+ 最佳實踐

- 使用 signalStore 維護成員 Map<UserId, Member>
- 邀請/移除成員必須發布 MemberUpdated 事件
- 變更角色時需連動 PermissionsModule 的檢查邏輯

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
- **MemberAdded**
- **MemberRemoved**
- **MemberInvited**
- **MemberRoleChanged**
- **MemberStatusChanged**

### 訂閱事件 (Subscribed Events)
- **WorkspaceCreated**
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
- 完全擁有並管理成員列表與角色分配狀態
- 不允許其他模組直接讀寫本模組狀態
- 狀態變更必須透過 Domain Event 公告

### Workspace 初始化責任
- 訂閱 WorkspaceCreated 事件自動加入建立者
- 確保每個 Workspace 至少有一個 Owner 成員

## 十、禁止事項 (Forbidden Practices)

- ❌ 移除最後一個 Owner
- ❌ 成員列表為空的 Workspace
- ❌ 跨 Workspace 操作成員
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

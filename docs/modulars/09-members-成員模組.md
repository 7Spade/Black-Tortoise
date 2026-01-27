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
本模組是 Workspace 的子模組之一，遵循 Domain → Application → Infrastructure → Presentation 的分層架構。

---

## 二、功能需求規格

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

## 三、現代化實作要求

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

## 四、事件整合

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

## 五、禁止事項 (Forbidden Practices)

- ❌ 移除最後一個 Owner
- ❌ 成員列表為空的 Workspace
- ❌ 跨 Workspace 操作成員

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

## 八、跨模組整合 (Cross-Module Integration)

### 本模組發布 (Published by This Module)

#### Context Provider
```typescript
// Application Layer: 09-members/application/providers/members-context.provider.ts
export abstract class MemberContextProvider {
  abstract getMemberName(memberId: string): string | null;
  abstract isMember(userId: string, workspaceId: string): boolean;
  abstract getMemberRole(userId: string): string | null;
}
```

#### 發布事件 (Published Events)
- **MemberInvited**
- **MemberRemoved**
- **MemberRoleChanged**

### 本模組訂閱 (Consumed by This Module)

#### 訂閱事件 (Subscribed Events)
- **WorkspaceCreated**
- **WorkspaceSwitched**

#### 使用的 Context Providers
- **WorkspaceContextProvider**: 查詢當前 Workspace ID

### 整合範例

```typescript
// Application Layer: 09-members/application/stores/members.store.ts
export const MembersStore = signalStore(
  { providedIn: 'root' },
  withState<MembersState>(initialState),
  withMethods((store) => {
    const eventBus = inject(WorkspaceEventBus);
    const workspaceContext = inject(WorkspaceContextProvider);
    
    return {
      // 業務方法範例
    };
  }),
  withHooks({
    onInit(store) {
      const eventBus = inject(WorkspaceEventBus);
      
      // 訂閱 WorkspaceSwitched
      eventBus.on('WorkspaceSwitched', () => {
        patchState(store, initialState);
      });
    }
  })
);
```

### 禁止的整合方式

❌ **禁止**：直接注入其他模組的 Store
```typescript
// ❌ 錯誤
export class MembersStore {
  private taskStore = inject(TaskStore); // 緊密耦合
}
```

✅ **正確**：使用 Context Provider 或 Event Bus
```typescript
export class MembersStore {
  private workspaceContext = inject(WorkspaceContextProvider); // 鬆散耦合
  private eventBus = inject(WorkspaceEventBus);
}
```

---

## 九、DDD 實作規範

### Aggregate Root: MemberEntity

#### Creation Pattern (產生 Domain Event)
```typescript
// Domain Layer: 09-members/domain/aggregates/members.aggregate.ts
export class MemberEntity {
  private constructor(...) {}
  
  public static create(..., eventMetadata?: EventMetadata): MemberEntity {
    // 產生 Domain Event
    // ...
  }
  
  public static reconstruct(props): MemberEntity {
    // 從 Snapshot 重建，不產生 Event
    return new MemberEntity(...);
  }
}
```

#### Factory Pattern (強制執行 Policy)
```typescript
// Domain Layer: 09-members/domain/factories/members.factory.ts
export class MemberFactory {
  public static create(..., metadata?: EventMetadata): MemberEntity {
    // 執行 Policy 檢查
    MemberInvitationPolicy.assertIsValid(...);
    
    // 透過 Aggregate 創建
    return MemberEntity.create(..., metadata);
  }
}
```

#### Policy Pattern (封裝業務規則)
```typescript
// Domain Layer: 09-members/domain/policies/members.policy.ts
export class MemberInvitationPolicy {
  public static isSatisfiedBy(...): boolean {
    // 業務規則檢查
  }
  
  public static assertIsValid(...): void {
    if (!this.isSatisfiedBy(...)) {
      throw new DomainError('...');
    }
  }
}
```

### Dependency Inversion (Repository Pattern)

#### Application Layer: 定義介面與 Token
```typescript
// Application Layer: 09-members/application/ports/members-repository.port.ts
export interface IMemberRepository {
  findById(id: string): Promise<MemberEntity | null>;
  save(entity: MemberEntity): Promise<void>;
}

// Application Layer: 09-members/application/tokens/members-repository.token.ts
export const MEMBER_REPOSITORY_TOKEN = new InjectionToken<IMemberRepository>(
  'MEMBER_REPOSITORY_TOKEN'
);
```

### Mapper Pattern (Domain <-> DTO/Firestore)
- Application Layer: MemberToDtoMapper
- Infrastructure Layer: MemberFirestoreMapper

### 型別安全
- 禁止使用 any 或 as unknown
- Mapper 必須明確處理深層嵌套物件

------

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
- [ ] 實作 Context Provider 供其他模組查詢
- [ ] 使用 InjectionToken 進行依賴注入
- [ ] 使用 Factory/Policy 封裝創建與驗證邏輯
- [ ] 使用 Mapper 分離 Domain Entity 與 DTO
- [ ] 避免直接注入其他模組的 Store

---

## 十一、參考資料

- **父文件**：workspace-modular-architecture_constitution_enhanced.md
- **DDD 規範**：.github/skills/ddd/SKILL.md
- **Angular 文件**：https://angular.dev
- **Angular Material**：https://material.angular.io
- **Tailwind CSS**：https://tailwindcss.com

---

**注意**：本指南必須與父文件保持一致。若有衝突，以父文件為準。

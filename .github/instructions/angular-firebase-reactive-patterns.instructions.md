---
description: 'Angular Fire 現代化響應式整合模式與最佳實踐指南'
applyTo: '**/*.ts,**/*.service.ts,**/store/*.ts'
---

# Angular Fire 響應式整合規範

## 適用範圍
本規範適用於所有使用 @angular/fire 的 TypeScript 服務層與狀態管理代碼。

## 核心原則

### 1. 使用 Modular API (必須)
- ✅ 使用 `@angular/fire/*` modular imports
- ❌ 禁止使用 `@angular/fire/compat/*`

### 2. 響應式資料流模式
**優先順序**: Signals > RxJS Observables > Promise
```typescript
// ✅ 推薦: 轉換為 Signal
users = toSignal(collectionData(query), { initialValue: [] });

// ⚠️ 備選: 保留 Observable (需要複雜 RxJS 操作時)
users$ = collectionData(query);

// ❌ 避免: 手動訂閱
collectionData(query).subscribe(...);
```

### 3. 狀態管理策略

#### 區域狀態 (Component-level)
直接使用 `toSignal()` 轉換

#### 全域狀態 (App-level)
使用 `@ngrx/signals` + `signalStore`:
```typescript
export const UserStore = signalStore(
  withState({ users: [] }),
  withMethods((store, firestore = inject(Firestore)) => ({
    loadUsers: rxMethod<void>(
      pipe(
        switchMap(() => collectionData(collection(firestore, 'users'))),
        tapResponse(
          (users) => patchState(store, { users }),
          (error) => console.error(error)
        )
      )
    )
  }))
);
```

### 4. 架構分層
```
Component (只讀取 signals)
    ↓
Service/Store (負責資料轉換)
    ↓
Firebase SDK (原始 Observable)
```

## 常見模式

### Firestore 查詢
```typescript
// Service 層
private firestore = inject(Firestore);

getUsers() {
  const usersRef = collection(this.firestore, 'users');
  const q = query(usersRef, where('active', '==', true));
  return collectionData(q, { idField: 'id' });
}
```

### 認證狀態
```typescript
// 使用 authState
private auth = inject(Auth);
user = toSignal(authState(this.auth));
```

### 即時更新
```typescript
// 使用 docData 監聽單一文件
docData(doc(firestore, 'posts', id))
```

## 禁止事項

- ❌ 在 Component 直接呼叫 Firebase SDK
- ❌ 忘記處理 `toSignal()` 的 `initialValue`
- ❌ 在非 injection context 使用 `inject()`
- ❌ 混用 Signal 和手動訂閱管理

## 型別安全
```typescript
// 定義 Firestore Converter
interface User {
  id: string;
  name: string;
}

const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (user) => ({ name: user.name }),
  fromFirestore: (snap) => ({ id: snap.id, ...snap.data() } as User)
};
```

## 記憶體管理

- `toSignal()` 會自動清理訂閱 (在 Component destroy 時)
- `rxMethod()` 會在 Store destroy 時清理
- 手動訂閱必須在 `ngOnDestroy` 取消

## 參考資源

- [Angular Fire 文件](https://github.com/angular/angularfire)
- [@ngrx/signals 文件](https://ngrx.io/guide/signals)
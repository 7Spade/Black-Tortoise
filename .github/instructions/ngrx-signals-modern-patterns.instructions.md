---
description: 'Angular 20 + @ngrx/signals 現代化狀態管理模式'
applyTo: '**/*.store.ts,**/*.signal.ts,**/services/*.ts'
---

# @ngrx/signals 現代化狀態管理模式

## 核心概念

@ngrx/signals 是 NgRx 團隊推出的輕量級、響應式狀態管理解決方案，專為 Angular Signals 生態系統設計。相比傳統的 @ngrx/store，它提供更簡潔的 API、更好的 TypeScript 支援，以及與 Angular Signals 的原生整合。

## 為什麼選擇 @ngrx/signals

### 相較於傳統 @ngrx/store 的優勢
- **更簡潔的語法**: 不需要 Actions、Reducers、Effects 的繁瑣樣板代碼
- **原生 Signals 整合**: 與 Angular 20 的 Signal-based 架構完美配合
- **更好的 TypeScript 推斷**: 自動推斷狀態類型，減少手動型別定義
- **更小的 Bundle 大小**: 只引入需要的功能
- **更容易學習**: 學習曲線平緩，適合團隊快速上手
- **Local 和 Global 狀態統一處理**: 同一套 API 處理不同範圍的狀態

### 適用場景
- 新專案或重構專案
- 需要細粒度響應式更新的應用
- 團隊偏好函數式和組合式 API
- 需要與 Angular Signals 深度整合的場景

## 安裝與設定

### 安裝依賴
```bash
yarn add @ngrx/signals
```

### 基本配置
不需要在 `app.config.ts` 中進行全域配置，@ngrx/signals 採用 Injectable 方式使用。

## Signal Store 基礎

### 建立 Signal Store

#### Local Store (元件級)
```typescript
import { signalStore, withState, withMethods, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';

// 定義狀態型別
interface TodosState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  loading: boolean;
}

// 初始狀態
const initialState: TodosState = {
  todos: [],
  filter: 'all',
  loading: false
};

// 建立 Store
export const TodosStore = signalStore(
  // 定義狀態
  withState(initialState),
  
  // 定義 Computed Values
  withComputed(({ todos, filter }) => ({
    filteredTodos: computed(() => {
      const allTodos = todos();
      const currentFilter = filter();
      
      if (currentFilter === 'all') return allTodos;
      if (currentFilter === 'active') return allTodos.filter(t => !t.completed);
      return allTodos.filter(t => t.completed);
    }),
    
    activeCount: computed(() => todos().filter(t => !t.completed).length),
    completedCount: computed(() => todos().filter(t => t.completed).length)
  })),
  
  // 定義 Methods
  withMethods((store) => ({
    addTodo(text: string) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text,
        completed: false
      };
      patchState(store, { todos: [...store.todos(), newTodo] });
    },
    
    toggleTodo(id: string) {
      patchState(store, {
        todos: store.todos().map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      });
    },
    
    removeTodo(id: string) {
      patchState(store, {
        todos: store.todos().filter(todo => todo.id !== id)
      });
    },
    
    setFilter(filter: TodosState['filter']) {
      patchState(store, { filter });
    }
  }))
);
```

#### Global Store (應用級)
```typescript
import { signalStore, withState, withMethods } from '@ngrx/signals';
import { Injectable } from '@angular/core';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false
};

@Injectable({ providedIn: 'root' })
export class AuthStore extends signalStore(
  withState(initialState),
  
  withMethods((store, authService = inject(AuthService)) => ({
    async login(credentials: LoginCredentials) {
      patchState(store, { loading: true });
      
      try {
        const { user, token } = await authService.login(credentials);
        patchState(store, {
          user,
          token,
          isAuthenticated: true,
          loading: false
        });
      } catch (error) {
        patchState(store, { loading: false });
        throw error;
      }
    },
    
    logout() {
      patchState(store, initialState);
    }
  }))
) {}
```

### 在元件中使用 Store

#### Standalone Component 整合
```typescript
import { Component, inject, effect } from '@angular/core';
import { TodosStore } from './todos.store';

@Component({
  selector: 'app-todos',
  standalone: true,
  providers: [TodosStore], // Local store 需要提供
  template: `
    <div class="todos-container">
      <input 
        #newTodoInput
        type="text" 
        placeholder="新增待辦事項"
        (keyup.enter)="addTodo(newTodoInput.value); newTodoInput.value = ''"
      />
      
      <div class="filters">
        @for (filterOption of filterOptions; track filterOption) {
          <button 
            [class.active]="store.filter() === filterOption"
            (click)="store.setFilter(filterOption)"
          >
            {{ filterOption }}
          </button>
        }
      </div>
      
      <div class="stats">
        待完成: {{ store.activeCount() }} | 
        已完成: {{ store.completedCount() }}
      </div>
      
      <ul class="todo-list">
        @if (store.loading()) {
          <li class="loading">載入中...</li>
        } @else {
          @for (todo of store.filteredTodos(); track todo.id) {
            <li [class.completed]="todo.completed">
              <input 
                type="checkbox"
                [checked]="todo.completed"
                (change)="store.toggleTodo(todo.id)"
              />
              <span>{{ todo.text }}</span>
              <button (click)="store.removeTodo(todo.id)">刪除</button>
            </li>
          } @empty {
            <li class="empty">沒有待辦事項</li>
          }
        }
      </ul>
    </div>
  `
})
export class TodosComponent {
  readonly store = inject(TodosStore);
  readonly filterOptions: Array<'all' | 'active' | 'completed'> = ['all', 'active', 'completed'];
  
  // 使用 effect 追蹤狀態變化
  constructor() {
    effect(() => {
      console.log('Todos changed:', this.store.todos());
      console.log('Filter changed:', this.store.filter());
    });
  }
  
  addTodo(text: string) {
    if (text.trim()) {
      this.store.addTodo(text.trim());
    }
  }
}
```

## 進階模式

### withHooks - 生命週期整合

```typescript
import { signalStore, withState, withMethods, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

export const ProductsStore = signalStore(
  withState<ProductsState>(initialState),
  
  withMethods((store, productsService = inject(ProductsService)) => ({
    loadProducts: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(() => productsService.getProducts()),
        tap({
          next: (products) => patchState(store, { products, loading: false }),
          error: (error) => patchState(store, { error, loading: false })
        })
      )
    )
  })),
  
  // 在 Store 初始化時自動載入資料
  withHooks({
    onInit(store) {
      store.loadProducts();
    },
    onDestroy(store) {
      console.log('Store destroyed');
    }
  })
);
```

### Custom Features - 可重用的狀態片段

```typescript
// features/with-loading.feature.ts
import { signalStoreFeature, withState, withMethods, type } from '@ngrx/signals';

export function withLoading() {
  return signalStoreFeature(
    withState({ loading: false }),
    withMethods((store) => ({
      setLoading(loading: boolean) {
        patchState(store, { loading });
      }
    }))
  );
}

// features/with-pagination.feature.ts
export function withPagination<T>(config: { pageSize: number }) {
  return signalStoreFeature(
    withState({
      page: 1,
      pageSize: config.pageSize,
      total: 0
    }),
    
    withComputed(({ page, pageSize }) => ({
      totalPages: computed(() => Math.ceil(store.total() / pageSize())),
      hasNextPage: computed(() => page() < computed(() => Math.ceil(store.total() / pageSize()))()),
      hasPrevPage: computed(() => page() > 1)
    })),
    
    withMethods((store) => ({
      nextPage() {
        if (store.hasNextPage()) {
          patchState(store, { page: store.page() + 1 });
        }
      },
      prevPage() {
        if (store.hasPrevPage()) {
          patchState(store, { page: store.page() - 1 });
        }
      },
      setPage(page: number) {
        patchState(store, { page });
      },
      setTotal(total: number) {
        patchState(store, { total });
      }
    }))
  );
}

// 使用 Custom Features
export const ProductsStore = signalStore(
  withState<ProductsState>(initialState),
  withLoading(),
  withPagination({ pageSize: 20 }),
  
  withMethods((store, productsService = inject(ProductsService)) => ({
    async loadProducts() {
      store.setLoading(true);
      try {
        const { products, total } = await productsService.getProducts({
          page: store.page(),
          pageSize: store.pageSize()
        });
        patchState(store, { products });
        store.setTotal(total);
      } finally {
        store.setLoading(false);
      }
    }
  }))
);
```

### 與 RxJS 整合 - rxMethod

```typescript
import { signalStore, withState, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, debounceTime, distinctUntilChanged, tap } from 'rxjs';

export const SearchStore = signalStore(
  withState({
    query: '',
    results: [] as SearchResult[],
    loading: false
  }),
  
  withMethods((store, searchService = inject(SearchService)) => ({
    // rxMethod 自動處理訂閱和取消訂閱
    search: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((query) => patchState(store, { query, loading: true })),
        switchMap((query) =>
          searchService.search(query).pipe(
            tap({
              next: (results) => patchState(store, { results, loading: false }),
              error: () => patchState(store, { results: [], loading: false })
            })
          )
        )
      )
    )
  }))
);

// 在元件中使用
@Component({
  template: `
    <input 
      type="text"
      [value]="store.query()"
      (input)="store.search($any($event.target).value)"
    />
    
    @if (store.loading()) {
      <div>搜尋中...</div>
    }
    
    @for (result of store.results(); track result.id) {
      <div>{{ result.title }}</div>
    }
  `
})
export class SearchComponent {
  readonly store = inject(SearchStore);
}
```

### Entity Management - 實體集合管理

```typescript
import { signalStore, withState, withMethods } from '@ngrx/signals';
import { 
  entityConfig, 
  withEntities, 
  addEntity,
  updateEntity,
  removeEntity,
  setAllEntities
} from '@ngrx/signals/entities';

// 定義實體配置
const todosConfig = entityConfig({
  entity: type<Todo>(),
  collection: '_todos',
  selectId: (todo) => todo.id
});

export const TodosStore = signalStore(
  withEntities(todosConfig),
  
  withMethods((store) => ({
    addTodo(todo: Todo) {
      patchState(store, addEntity(todo, todosConfig));
    },
    
    updateTodo(id: string, changes: Partial<Todo>) {
      patchState(store, updateEntity({ id, changes }, todosConfig));
    },
    
    removeTodo(id: string) {
      patchState(store, removeEntity(id, todosConfig));
    },
    
    loadTodos(todos: Todo[]) {
      patchState(store, setAllEntities(todos, todosConfig));
    }
  }))
);
```

## 狀態持久化

### LocalStorage 整合

```typescript
import { effect } from '@angular/core';

export const TodosStore = signalStore(
  withState(loadStateFromStorage() ?? initialState),
  
  withMethods((store) => ({
    // ... methods
  })),
  
  withHooks({
    onInit(store) {
      // 監聽狀態變化並儲存
      effect(() => {
        const state = {
          todos: store.todos(),
          filter: store.filter()
        };
        localStorage.setItem('todos-state', JSON.stringify(state));
      });
    }
  })
);

function loadStateFromStorage(): TodosState | null {
  try {
    const stored = localStorage.getItem('todos-state');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}
```

### IndexedDB 整合

```typescript
import { openDB, DBSchema } from 'idb';

interface AppDB extends DBSchema {
  'app-state': {
    key: string;
    value: any;
  };
}

class StateStorageService {
  private dbPromise = openDB<AppDB>('app-db', 1, {
    upgrade(db) {
      db.createObjectStore('app-state');
    }
  });
  
  async save(key: string, value: any) {
    const db = await this.dbPromise;
    await db.put('app-state', value, key);
  }
  
  async load(key: string) {
    const db = await this.dbPromise;
    return await db.get('app-state', key);
  }
}

export const TodosStore = signalStore(
  withState(initialState),
  
  withMethods((store, storage = inject(StateStorageService)) => ({
    // ... methods
  })),
  
  withHooks({
    async onInit(store, storage = inject(StateStorageService)) {
      // 載入持久化狀態
      const savedState = await storage.load('todos');
      if (savedState) {
        patchState(store, savedState);
      }
      
      // 監聽並儲存
      effect(() => {
        storage.save('todos', {
          todos: store.todos(),
          filter: store.filter()
        });
      });
    }
  })
);
```

## 非同步狀態處理模式

### Loading States

```typescript
type LoadingState = 'idle' | 'loading' | 'loaded' | 'error';

interface DataState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}

export const UsersStore = signalStore(
  withState<DataState<User[]>>({
    data: null,
    status: 'idle',
    error: null
  }),
  
  withComputed(({ status }) => ({
    isLoading: computed(() => status() === 'loading'),
    isLoaded: computed(() => status() === 'loaded'),
    isError: computed(() => status() === 'error'),
    isIdle: computed(() => status() === 'idle')
  })),
  
  withMethods((store, usersService = inject(UsersService)) => ({
    async loadUsers() {
      patchState(store, { status: 'loading', error: null });
      
      try {
        const data = await usersService.getUsers();
        patchState(store, { data, status: 'loaded' });
      } catch (error) {
        patchState(store, {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    },
    
    reset() {
      patchState(store, { data: null, status: 'idle', error: null });
    }
  }))
);

// 在元件中使用
@Component({
  template: `
    @if (store.isIdle()) {
      <button (click)="store.loadUsers()">載入使用者</button>
    }
    
    @if (store.isLoading()) {
      <div class="spinner">載入中...</div>
    }
    
    @if (store.isError()) {
      <div class="error">
        {{ store.error() }}
        <button (click)="store.loadUsers()">重試</button>
      </div>
    }
    
    @if (store.isLoaded() && store.data()) {
      <ul>
        @for (user of store.data(); track user.id) {
          <li>{{ user.name }}</li>
        }
      </ul>
    }
  `
})
export class UsersComponent {
  readonly store = inject(UsersStore);
}
```

### Optimistic Updates

```typescript
export const TodosStore = signalStore(
  withState<TodosState>(initialState),
  
  withMethods((store, todosService = inject(TodosService)) => ({
    async toggleTodo(id: string) {
      // 樂觀更新 UI
      const previousTodos = store.todos();
      patchState(store, {
        todos: previousTodos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      });
      
      try {
        // 發送 API 請求
        await todosService.toggleTodo(id);
      } catch (error) {
        // 失敗時回滾
        patchState(store, { todos: previousTodos });
        throw error;
      }
    }
  }))
);
```

## 測試策略

### Store 單元測試

```typescript
import { TestBed } from '@angular/core/testing';
import { TodosStore } from './todos.store';

describe('TodosStore', () => {
  let store: InstanceType<typeof TodosStore>;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodosStore]
    });
    store = TestBed.inject(TodosStore);
  });
  
  it('should add todo', () => {
    store.addTodo('Test todo');
    
    expect(store.todos().length).toBe(1);
    expect(store.todos()[0].text).toBe('Test todo');
    expect(store.todos()[0].completed).toBe(false);
  });
  
  it('should toggle todo', () => {
    store.addTodo('Test todo');
    const todoId = store.todos()[0].id;
    
    store.toggleTodo(todoId);
    
    expect(store.todos()[0].completed).toBe(true);
  });
  
  it('should filter todos correctly', () => {
    store.addTodo('Todo 1');
    store.addTodo('Todo 2');
    store.toggleTodo(store.todos()[0].id);
    
    store.setFilter('active');
    expect(store.filteredTodos().length).toBe(1);
    expect(store.filteredTodos()[0].text).toBe('Todo 2');
    
    store.setFilter('completed');
    expect(store.filteredTodos().length).toBe(1);
    expect(store.filteredTodos()[0].text).toBe('Todo 1');
  });
  
  it('should compute counts correctly', () => {
    store.addTodo('Todo 1');
    store.addTodo('Todo 2');
    store.addTodo('Todo 3');
    store.toggleTodo(store.todos()[0].id);
    
    expect(store.activeCount()).toBe(2);
    expect(store.completedCount()).toBe(1);
  });
});
```

### 整合測試

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodosComponent } from './todos.component';
import { TodosStore } from './todos.store';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;
  let store: InstanceType<typeof TodosStore>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodosComponent],
      providers: [TodosStore]
    }).compileComponents();
    
    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(TodosStore);
    fixture.detectChanges();
  });
  
  it('should display todos', () => {
    store.addTodo('Test Todo');
    fixture.detectChanges();
    
    const todoItems = fixture.nativeElement.querySelectorAll('.todo-list li');
    expect(todoItems.length).toBe(1);
    expect(todoItems[0].textContent).toContain('Test Todo');
  });
  
  it('should add todo on enter', () => {
    const input = fixture.nativeElement.querySelector('input');
    input.value = 'New Todo';
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    fixture.detectChanges();
    
    expect(store.todos().length).toBe(1);
    expect(store.todos()[0].text).toBe('New Todo');
  });
});
```

## 效能最佳化

### 避免不必要的重新計算

```typescript
export const ProductsStore = signalStore(
  withState<ProductsState>(initialState),
  
  withComputed(({ products, sortBy, filterBy }) => ({
    // ✅ 良好：只在依賴改變時重新計算
    sortedAndFilteredProducts: computed(() => {
      let result = products();
      
      // 過濾
      if (filterBy().category) {
        result = result.filter(p => p.category === filterBy().category);
      }
      
      // 排序
      if (sortBy() === 'price') {
        result = [...result].sort((a, b) => a.price - b.price);
      }
      
      return result;
    }),
    
    // ❌ 不好：每次訪問都重新計算
    // 應該使用 computed()
  }))
);
```

### 批次更新

```typescript
export const CartStore = signalStore(
  withState<CartState>(initialState),
  
  withMethods((store) => ({
    addMultipleItems(items: CartItem[]) {
      // ✅ 良好：單次 patchState 更新多個項目
      patchState(store, {
        items: [...store.items(), ...items],
        totalItems: store.totalItems() + items.length,
        totalPrice: store.totalPrice() + items.reduce((sum, item) => sum + item.price, 0)
      });
      
      // ❌ 不好：多次 patchState 調用
      // items.forEach(item => {
      //   patchState(store, { items: [...store.items(), item] });
      // });
    }
  }))
);
```

### 選擇性訂閱

```typescript
@Component({
  template: `
    <!-- ✅ 良好：只訂閱需要的資料 -->
    <div>Total: {{ store.totalPrice() }}</div>
    
    <!-- ❌ 不好：訂閱整個 store -->
    <!-- <div>Total: {{ store().totalPrice }}</div> -->
  `
})
export class CartSummaryComponent {
  readonly store = inject(CartStore);
}
```

## 遷移指南

### 從 @ngrx/store 遷移

#### 傳統 Store
```typescript
// actions.ts
export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: User[] }>()
);

// reducer.ts
export const usersReducer = createReducer(
  initialState,
  on(loadUsersSuccess, (state, { users }) => ({ ...state, users }))
);

// effects.ts
export class UsersEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      switchMap(() =>
        this.usersService.getUsers().pipe(
          map(users => loadUsersSuccess({ users }))
        )
      )
    )
  );
}

// selectors.ts
export const selectUsers = (state: AppState) => state.users;
```

#### @ngrx/signals 版本
```typescript
export const UsersStore = signalStore(
  withState({ users: [] as User[] }),
  
  withMethods((store, usersService = inject(UsersService)) => ({
    loadUsers: rxMethod<void>(
      pipe(
        switchMap(() => usersService.getUsers()),
        tap(users => patchState(store, { users }))
      )
    )
  }))
);
```

### 從 Services 遷移

#### 傳統 Service
```typescript
@Injectable()
export class TodosService {
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();
  
  addTodo(text: string) {
    const currentTodos = this.todosSubject.value;
    this.todosSubject.next([...currentTodos, { id: Date.now(), text, completed: false }]);
  }
}
```

#### @ngrx/signals 版本
```typescript
export const TodosStore = signalStore(
  withState({ todos: [] as Todo[] }),
  
  withMethods((store) => ({
    addTodo(text: string) {
      patchState(store, {
        todos: [...store.todos(), { id: Date.now(), text, completed: false }]
      });
    }
  }))
);
```

## 最佳實踐

### ✅ 良好模式

1. **使用明確的狀態型別**
```typescript
interface TodosState {
  todos: Todo[];
  filter: TodoFilter;
  loading: boolean;
}
```

2. **保持 Store 單一職責**
```typescript
// ✅ 良好：每個 Store 負責一個領域
export const TodosStore = signalStore(/* todos logic */);
export const UserStore = signalStore(/* user logic */);

// ❌ 不好：一個 Store 處理所有邏輯
export const AppStore = signalStore(/* everything */);
```

3. **使用 Computed 避免重複計算**
```typescript
withComputed(({ todos }) => ({
  completedTodos: computed(() => todos().filter(t => t.completed)),
  activeTodos: computed(() => todos().filter(t => !t.completed))
}))
```

4. **使用 Custom Features 重用邏輯**
```typescript
// 可在多個 Store 中重用
export const withLoading = () => signalStoreFeature(/* ... */);
export const withPagination = () => signalStoreFeature(/* ... */);
```

5. **錯誤處理**
```typescript
withMethods((store, service = inject(Service)) => ({
  async loadData() {
    try {
      patchState(store, { loading: true, error: null });
      const data = await service.getData();
      patchState(store, { data, loading: false });
    } catch (error) {
      patchState(store, {
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}))
```

### ❌ 應避免

1. **直接修改狀態**
```typescript
// ❌ 不好
store.todos().push(newTodo);

// ✅ 良好
patchState(store, { todos: [...store.todos(), newTodo] });
```

2. **在 Computed 中執行副作用**
```typescript
// ❌ 不好
computed(() => {
  const todos = store.todos();
  localStorage.setItem('todos', JSON.stringify(todos)); // 副作用
  return todos;
})

// ✅ 良好：使用 effect
effect(() => {
  localStorage.setItem('todos', JSON.stringify(store.todos()));
});
```

3. **過度嵌套的狀態**
```typescript
// ❌ 不好
interface State {
  data: {
    users: {
      list: {
        items: User[]
      }
    }
  }
}

// ✅ 良好：扁平化
interface State {
  users: User[];
}
```

4. **忽略 Loading 和 Error 狀態**
```typescript
// ❌ 不好
interface State {
  data: Data[];
}

// ✅ 良好
interface State {
  data: Data[];
  loading: boolean;
  error: string | null;
}
```

## 常見問題

### Q: 何時使用 Local Store vs Global Store？
**A**: 
- **Local Store**: 元件特定的狀態，生命週期與元件綁定
- **Global Store**: 跨元件共享的狀態，應用級生命週期

### Q: @ngrx/signals vs @ngrx/store？
**A**:
- 新專案推薦使用 @ngrx/signals
- 已有大量 @ngrx/store 代碼的專案可漸進式遷移
- 兩者可共存於同一應用

### Q: 如何處理深層嵌套的狀態更新？
**A**: 使用展開運算符或 immer.js 保持不可變性：
```typescript
patchState(store, {
  user: {
    ...store.user(),
    profile: {
      ...store.user().profile,
      name: newName
    }
  }
});
```

### Q: 如何 Debug Signal Store？
**A**: 使用 Angular DevTools 和 effect：
```typescript
effect(() => {
  console.log('State changed:', {
    todos: store.todos(),
    filter: store.filter()
  });
});
```

## 學習資源

- [官方文件](https://ngrx.io/guide/signals)
- [範例應用](https://github.com/ngrx/platform/tree/main/modules/signals)
- [最佳實踐指南](https://ngrx.io/guide/signals/best-practices)
- [遷移指南](https://ngrx.io/guide/migration)
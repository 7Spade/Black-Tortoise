---
description: 'Angular 20 + Firebase 整合指南 (@angular/fire)'
applyTo: '**/firebase/**/*.ts,**/services/*firebase*.ts'
---

# Angular 20 + Firebase 整合指南

## 核心概念

@angular/fire 是 Angular 應用與 Firebase 服務整合的官方函式庫。本指南假設專案已完成基礎配置，包括 `app.config.ts`、環境變數檔案等設定。

## 前置要求確認

### ✅ 已完成的配置

本指南假設以下配置已就緒：

#### 1. `src/app/app.config.ts` 已配置
```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    
    // Firebase 配置
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideFunctions(() => getFunctions())
  ]
};
```

#### 2. `src/environments/environment.ts` 已配置
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef",
    measurementId: "G-XXXXXXXXXX" // 選用
  }
};
```

#### 3. `src/environments/environment.prod.ts` 已配置
```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: "YOUR_PROD_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef",
    measurementId: "G-XXXXXXXXXX"
  }
};
```

### 安裝依賴（如尚未安裝）
```bash
yarn add @angular/fire firebase
```

## Firestore 資料庫操作

### 基本 CRUD 操作

#### 建立 Firestore Service
```typescript
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  CollectionReference,
  DocumentReference
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Todo {
  id?: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class TodosFirestoreService {
  private firestore = inject(Firestore);
  private todosCollection = collection(this.firestore, 'todos') as CollectionReference<Todo>;
  
  // 取得所有待辦事項（Observable）
  getTodos$(): Observable<Todo[]> {
    return collectionData(this.todosCollection, { idField: 'id' });
  }
  
  // 取得特定使用者的待辦事項
  getUserTodos$(userId: string): Observable<Todo[]> {
    const q = query(
      this.todosCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return collectionData(q, { idField: 'id' });
  }
  
  // 取得單一待辦事項
  getTodo$(id: string): Observable<Todo | undefined> {
    const todoDoc = doc(this.firestore, `todos/${id}`) as DocumentReference<Todo>;
    return docData(todoDoc, { idField: 'id' });
  }
  
  // 新增待辦事項
  async addTodo(todo: Omit<Todo, 'id'>): Promise<string> {
    const docRef = await addDoc(this.todosCollection, {
      ...todo,
      createdAt: new Date()
    });
    return docRef.id;
  }
  
  // 更新待辦事項
  async updateTodo(id: string, changes: Partial<Todo>): Promise<void> {
    const todoDoc = doc(this.firestore, `todos/${id}`);
    await updateDoc(todoDoc, changes);
  }
  
  // 設定/覆寫待辦事項
  async setTodo(id: string, todo: Omit<Todo, 'id'>): Promise<void> {
    const todoDoc = doc(this.firestore, `todos/${id}`);
    await setDoc(todoDoc, todo);
  }
  
  // 刪除待辦事項
  async deleteTodo(id: string): Promise<void> {
    const todoDoc = doc(this.firestore, `todos/${id}`);
    await deleteDoc(todoDoc);
  }
  
  // 取得有限數量的待辦事項
  getLimitedTodos$(limitCount: number): Observable<Todo[]> {
    const q = query(
      this.todosCollection,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    return collectionData(q, { idField: 'id' });
  }
}
```

### 與 @ngrx/signals 整合

#### 建立 Firestore + Signals Store
```typescript
import { Injectable, inject } from '@angular/core';
import { signalStore, withState, withMethods, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { TodosFirestoreService, Todo } from './todos-firestore.service';

interface TodosState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  selectedTodoId: string | null;
}

const initialState: TodosState = {
  todos: [],
  loading: false,
  error: null,
  selectedTodoId: null
};

@Injectable({ providedIn: 'root' })
export class TodosStore extends signalStore(
  withState(initialState),
  
  withMethods((store, todosService = inject(TodosFirestoreService)) => ({
    // 載入使用者的待辦事項
    loadUserTodos: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((userId) => todosService.getUserTodos$(userId)),
        tap({
          next: (todos) => patchState(store, { todos, loading: false }),
          error: (error) => patchState(store, {
            loading: false,
            error: error.message
          })
        })
      )
    ),
    
    // 新增待辦事項
    async addTodo(todo: Omit<Todo, 'id'>) {
      try {
        const id = await todosService.addTodo(todo);
        // Firestore 監聽器會自動更新 todos 列表
        return id;
      } catch (error) {
        patchState(store, {
          error: error instanceof Error ? error.message : 'Failed to add todo'
        });
        throw error;
      }
    },
    
    // 更新待辦事項
    async updateTodo(id: string, changes: Partial<Todo>) {
      try {
        await todosService.updateTodo(id, changes);
        // Firestore 監聽器會自動更新
      } catch (error) {
        patchState(store, {
          error: error instanceof Error ? error.message : 'Failed to update todo'
        });
        throw error;
      }
    },
    
    // 刪除待辦事項
    async deleteTodo(id: string) {
      try {
        await todosService.deleteTodo(id);
        // Firestore 監聽器會自動更新
      } catch (error) {
        patchState(store, {
          error: error instanceof Error ? error.message : 'Failed to delete todo'
        });
        throw error;
      }
    },
    
    // 選擇待辦事項
    selectTodo(id: string | null) {
      patchState(store, { selectedTodoId: id });
    },
    
    // 清除錯誤
    clearError() {
      patchState(store, { error: null });
    }
  }))
) {}
```

#### 在元件中使用
```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodosStore } from './todos.store';
import { AuthStore } from '../auth/auth.store';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="todos-container">
      @if (todosStore.loading()) {
        <div class="loading">載入中...</div>
      }
      
      @if (todosStore.error()) {
        <div class="error">
          {{ todosStore.error() }}
          <button (click)="todosStore.clearError()">關閉</button>
        </div>
      }
      
      <div class="add-todo">
        <input
          type="text"
          [(ngModel)]="newTodoTitle"
          placeholder="新增待辦事項"
          (keyup.enter)="addTodo()"
        />
        <button (click)="addTodo()">新增</button>
      </div>
      
      <ul class="todo-list">
        @for (todo of todosStore.todos(); track todo.id) {
          <li [class.completed]="todo.completed">
            <input
              type="checkbox"
              [checked]="todo.completed"
              (change)="toggleTodo(todo)"
            />
            <span>{{ todo.title }}</span>
            <button (click)="deleteTodo(todo.id!)">刪除</button>
          </li>
        } @empty {
          <li class="empty">沒有待辦事項</li>
        }
      </ul>
    </div>
  `
})
export class TodosComponent implements OnInit {
  readonly todosStore = inject(TodosStore);
  readonly authStore = inject(AuthStore);
  
  newTodoTitle = '';
  
  ngOnInit() {
    const userId = this.authStore.user()?.uid;
    if (userId) {
      this.todosStore.loadUserTodos(userId);
    }
  }
  
  async addTodo() {
    if (!this.newTodoTitle.trim()) return;
    
    const userId = this.authStore.user()?.uid;
    if (!userId) return;
    
    await this.todosStore.addTodo({
      title: this.newTodoTitle.trim(),
      completed: false,
      createdAt: new Date(),
      userId
    });
    
    this.newTodoTitle = '';
  }
  
  async toggleTodo(todo: Todo) {
    await this.todosStore.updateTodo(todo.id!, {
      completed: !todo.completed
    });
  }
  
  async deleteTodo(id: string) {
    await this.todosStore.deleteTodo(id);
  }
}
```

### 進階查詢模式

#### 複合查詢
```typescript
import { getDocs, QueryConstraint } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AdvancedQueryService {
  private firestore = inject(Firestore);
  
  // 複雜查詢範例
  async searchTodos(filters: {
    userId?: string;
    completed?: boolean;
    searchText?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Todo[]> {
    const constraints: QueryConstraint[] = [];
    
    // 使用者過濾
    if (filters.userId) {
      constraints.push(where('userId', '==', filters.userId));
    }
    
    // 完成狀態過濾
    if (filters.completed !== undefined) {
      constraints.push(where('completed', '==', filters.completed));
    }
    
    // 日期範圍過濾
    if (filters.startDate) {
      constraints.push(where('createdAt', '>=', filters.startDate));
    }
    if (filters.endDate) {
      constraints.push(where('createdAt', '<=', filters.endDate));
    }
    
    // 排序
    constraints.push(orderBy('createdAt', 'desc'));
    
    const todosRef = collection(this.firestore, 'todos');
    const q = query(todosRef, ...constraints);
    const snapshot = await getDocs(q);
    
    let results = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Todo));
    
    // 客戶端文字搜尋（Firestore 不支援全文搜尋）
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      results = results.filter(todo =>
        todo.title.toLowerCase().includes(searchLower)
      );
    }
    
    return results;
  }
}
```

#### 分頁查詢
```typescript
import { startAfter, QueryDocumentSnapshot } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  private firestore = inject(Firestore);
  private lastVisible: QueryDocumentSnapshot | null = null;
  
  async getFirstPage(pageSize: number = 20): Promise<Todo[]> {
    const todosRef = collection(this.firestore, 'todos');
    const q = query(
      todosRef,
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    
    const snapshot = await getDocs(q);
    this.lastVisible = snapshot.docs[snapshot.docs.length - 1];
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Todo));
  }
  
  async getNextPage(pageSize: number = 20): Promise<Todo[]> {
    if (!this.lastVisible) return [];
    
    const todosRef = collection(this.firestore, 'todos');
    const q = query(
      todosRef,
      orderBy('createdAt', 'desc'),
      startAfter(this.lastVisible),
      limit(pageSize)
    );
    
    const snapshot = await getDocs(q);
    this.lastVisible = snapshot.docs[snapshot.docs.length - 1];
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Todo));
  }
  
  resetPagination() {
    this.lastVisible = null;
  }
}
```

### 批次操作

```typescript
import { writeBatch, WriteBatch } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class BatchOperationsService {
  private firestore = inject(Firestore);
  
  // 批次新增
  async addMultipleTodos(todos: Omit<Todo, 'id'>[]): Promise<void> {
    const batch = writeBatch(this.firestore);
    
    todos.forEach(todo => {
      const docRef = doc(collection(this.firestore, 'todos'));
      batch.set(docRef, {
        ...todo,
        createdAt: new Date()
      });
    });
    
    await batch.commit();
  }
  
  // 批次更新
  async updateMultipleTodos(updates: Array<{ id: string; changes: Partial<Todo> }>): Promise<void> {
    const batch = writeBatch(this.firestore);
    
    updates.forEach(({ id, changes }) => {
      const docRef = doc(this.firestore, `todos/${id}`);
      batch.update(docRef, changes);
    });
    
    await batch.commit();
  }
  
  // 批次刪除
  async deleteMultipleTodos(ids: string[]): Promise<void> {
    const batch = writeBatch(this.firestore);
    
    ids.forEach(id => {
      const docRef = doc(this.firestore, `todos/${id}`);
      batch.delete(docRef);
    });
    
    await batch.commit();
  }
  
  // 標記所有待辦事項為已完成
  async markAllAsCompleted(userId: string): Promise<void> {
    const todosRef = collection(this.firestore, 'todos');
    const q = query(todosRef, where('userId', '==', userId), where('completed', '==', false));
    const snapshot = await getDocs(q);
    
    const batch = writeBatch(this.firestore);
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { completed: true });
    });
    
    await batch.commit();
  }
}
```

## Firebase Authentication

### 認證 Service
```typescript
import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  user,
  User,
  UserCredential,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  
  // 當前使用者 Observable
  readonly user$: Observable<User | null> = user(this.auth);
  
  // Email/Password 註冊
  async signUp(email: string, password: string, displayName?: string): Promise<UserCredential> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    
    if (displayName && credential.user) {
      await updateProfile(credential.user, { displayName });
    }
    
    return credential;
  }
  
  // Email/Password 登入
  async signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  
  // Google 登入
  async signInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }
  
  // 登出
  async signOut(): Promise<void> {
    return signOut(this.auth);
  }
  
  // 發送密碼重設信件
  async resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }
  
  // 更新個人資料
  async updateUserProfile(displayName?: string, photoURL?: string): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('No user logged in');
    
    return updateProfile(currentUser, { displayName, photoURL });
  }
  
  // 取得當前使用者
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}
```

### Auth Store with @ngrx/signals
```typescript
import { Injectable, inject } from '@angular/core';
import { signalStore, withState, withMethods, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '@angular/fire/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};

@Injectable({ providedIn: 'root' })
export class AuthStore extends signalStore(
  withState(initialState),
  
  withMethods((store, authService = inject(AuthService)) => ({
    // 監聽認證狀態變化
    listenToAuthState: rxMethod<void>(
      pipe(
        switchMap(() => authService.user$),
        tap(user => patchState(store, { user }))
      )
    ),
    
    // 註冊
    async signUp(email: string, password: string, displayName?: string) {
      patchState(store, { loading: true, error: null });
      try {
        await authService.signUp(email, password, displayName);
        patchState(store, { loading: false });
      } catch (error) {
        patchState(store, {
          loading: false,
          error: error instanceof Error ? error.message : 'Sign up failed'
        });
        throw error;
      }
    },
    
    // 登入
    async signIn(email: string, password: string) {
      patchState(store, { loading: true, error: null });
      try {
        await authService.signIn(email, password);
        patchState(store, { loading: false });
      } catch (error) {
        patchState(store, {
          loading: false,
          error: error instanceof Error ? error.message : 'Sign in failed'
        });
        throw error;
      }
    },
    
    // Google 登入
    async signInWithGoogle() {
      patchState(store, { loading: true, error: null });
      try {
        await authService.signInWithGoogle();
        patchState(store, { loading: false });
      } catch (error) {
        patchState(store, {
          loading: false,
          error: error instanceof Error ? error.message : 'Google sign in failed'
        });
        throw error;
      }
    },
    
    // 登出
    async signOut() {
      patchState(store, { loading: true, error: null });
      try {
        await authService.signOut();
        patchState(store, { user: null, loading: false });
      } catch (error) {
        patchState(store, {
          loading: false,
          error: error instanceof Error ? error.message : 'Sign out failed'
        });
        throw error;
      }
    },
    
    clearError() {
      patchState(store, { error: null });
    }
  })),
  
  withHooks({
    onInit(store) {
      // 啟動時開始監聽認證狀態
      store.listenToAuthState();
    }
  })
) {}
```

### 認證守衛（Functional Guard）
```typescript
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from './auth.store';
import type { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  
  const user = authStore.user();
  
  if (user) {
    return true;
  }
  
  // 重導向到登入頁面
  return router.createUrlTree(['/login']);
};

// 使用範例
export const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard.component')
  }
];
```

## Storage (檔案上傳)

### Storage Service
```typescript
import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadResult,
  UploadTask,
  StorageReference
} from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private storage = inject(Storage);
  
  // 上傳檔案（簡單版本）
  async uploadFile(path: string, file: File): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }
  
  // 上傳檔案（帶進度追蹤）
  uploadFileWithProgress(path: string, file: File): {
    task: UploadTask;
    progress$: Observable<number>;
  } {
    const storageRef = ref(this.storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    const progress$ = new Observable<number>(observer => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next(progress);
        },
        (error) => observer.error(error),
        () => observer.complete()
      );
    });
    
    return { task: uploadTask, progress$ };
  }
  
  // 取得下載網址
  async getDownloadURL(path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    return getDownloadURL(storageRef);
  }
  
  // 刪除檔案
  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(this.storage, path);
    return deleteObject(storageRef);
  }
  
  // 列出資料夾中的所有檔案
  async listFiles(path: string): Promise<StorageReference[]> {
    const storageRef = ref(this.storage, path);
    const result = await listAll(storageRef);
    return result.items;
  }
  
  // 上傳使用者頭像
  async uploadUserAvatar(userId: string, file: File): Promise<string> {
    const path = `users/${userId}/avatar.${file.name.split('.').pop()}`;
    return this.uploadFile(path, file);
  }
  
  // 上傳多個檔案
  async uploadMultipleFiles(basePath: string, files: File[]): Promise<string[]> {
    const uploadPromises = files.map((file, index) => {
      const path = `${basePath}/${Date.now()}_${index}_${file.name}`;
      return this.uploadFile(path, file);
    });
    
    return Promise.all(uploadPromises);
  }
}
```

### 檔案上傳元件
```typescript
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from './storage.service';
import { AuthStore } from '../auth/auth.store';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="upload-container">
      <input
        type="file"
        #fileInput
        (change)="onFileSelected($event)"
        [accept]="acceptedTypes"
      />
      
      @if (uploading()) {
        <div class="progress-bar">
          <div
            class="progress-fill"
            [style.width.%]="uploadProgress()"
          ></div>
          <span>{{ uploadProgress() | number:'1.0-0' }}%</span>
        </div>
      }
      
      @if (downloadURL()) {
        <div class="success">
          檔案上傳成功！
          <a [href]="downloadURL()" target="_blank">查看檔案</a>
        </div>
      }
      
      @if (error()) {
        <div class="error">{{ error() }}</div>
      }
    </div>
  `
})
export class FileUploadComponent {
  private storageService = inject(StorageService);
  private authStore = inject(AuthStore);
  
  acceptedTypes = 'image/*';
  
  uploading = signal(false);
  uploadProgress = signal(0);
  downloadURL = signal<string | null>(null);
  error = signal<string | null>(null);
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;
    
    this.uploadFile(file);
  }
  
  private async uploadFile(file: File) {
    const userId = this.authStore.user()?.uid;
    if (!userId) {
      this.error.set('請先登入');
      return;
    }
    
    this.uploading.set(true);
    this.error.set(null);
    this.downloadURL.set(null);
    
    try {
      const path = `users/${userId}/uploads/${Date.now()}_${file.name}`;
      const { task, progress$ } = this.storageService.uploadFileWithProgress(path, file);
      
      // 訂閱進度
      progress$.subscribe({
        next: (progress) => this.uploadProgress.set(progress),
        error: (error) => {
          this.error.set(error.message);
          this.uploading.set(false);
        }
      });
      
      // 等待上傳完成
      const result = await task;
      const url = await this.storageService.getDownloadURL(path);
      
      this.downloadURL.set(url);
      this.uploading.set(false);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Upload failed');
      this.uploading.set(false);
    }
  }
}
```

## Cloud Functions

### Functions Service
```typescript
import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable, HttpsCallableResult } from '@angular/fire/functions';

interface SendEmailData {
  to: string;
  subject: string;
  body: string;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
}

@Injectable({ providedIn: 'root' })
export class CloudFunctionsService {
  private functions = inject(Functions);
  
  // 呼叫 Cloud Function
  async sendEmail(data: SendEmailData): Promise<SendEmailResult> {
    const callable = httpsCallable<SendEmailData, SendEmailResult>(
      this.functions,
      'sendEmail'
    );
    const result = await callable(data);
    return result.data;
  }
  
  // 處理付款
  async processPayment(amount: number, currency: string): Promise<{ success: boolean }> {
    const callable = httpsCallable(this.functions, 'processPayment');
    const result = await callable({ amount, currency });
    return result.data as { success: boolean };
  }
  
  // 產生報告
  async generateReport(userId: string, reportType: string): Promise<{ url: string }> {
    const callable = httpsCallable(this.functions, 'generateReport');
    const result = await callable({ userId, reportType });
    return result.data as { url: string };
  }
}
```

## 安全性規則

### Firestore 規則範例
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 使用者只能讀寫自己的資料
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 待辦事項規則
    match /todos/{todoId} {
      // 必須登入
      allow read, write: if request.auth != null;
      
      // 只能建立屬於自己的待辦事項
      allow create: if request.auth != null 
        && request.resource.data.userId == request.auth.uid;
      
      // 只能更新/刪除自己的待辦事項
      allow update, delete: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
    
    // 公開讀取，但只有管理員可寫入
    match /settings/{document} {
      allow read: if true;
      allow write: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Storage 規則範例
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 使用者上傳的檔案
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 公開檔案
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // 圖片大小限制（5MB）
    match /images/{imageId} {
      allow write: if request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 離線支援

### 啟用離線持久化
```typescript
// app.config.ts
import { enableIndexedDbPersistence } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... 其他 providers
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      const firestore = getFirestore();
      enableIndexedDbPersistence(firestore).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
          console.warn('The current browser does not support persistence.');
        }
      });
      return firestore;
    })
  ]
};
```

### 監聽連線狀態
```typescript
import { Injectable, inject, signal } from '@angular/core';
import { Database, ref, onValue, onDisconnect } from '@angular/fire/database';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  private db = inject(Database);
  isOnline = signal(true);
  
  constructor() {
    this.monitorConnection();
  }
  
  private monitorConnection() {
    const connectedRef = ref(this.db, '.info/connected');
    onValue(connectedRef, (snapshot) => {
      this.isOnline.set(snapshot.val() === true);
    });
  }
}
```

## 效能最佳化

### 1. 使用索引
在 Firebase Console 中為常用查詢建立索引

### 2. 限制查詢結果
```typescript
// ✅ 良好：限制結果數量
const q = query(todosRef, limit(50));

// ❌ 不好：載入所有資料
const q = query(todosRef);
```

### 3. 使用分頁
參考前面的分頁查詢範例

### 4. 快取策略
```typescript
import { getDocsFromCache, getDocsFromServer } from '@angular/fire/firestore';

// 優先從快取讀取
try {
  const cached = await getDocsFromCache(q);
  if (!cached.empty) {
    return cached.docs;
  }
} catch {
  // 快取失效，從伺服器讀取
  const server = await getDocsFromServer(q);
  return server.docs;
}
```

## 測試

### Mock Firebase Services
```typescript
import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';

describe('TodosFirestoreService', () => {
  let service: TodosFirestoreService;
  let firestoreMock: jasmine.SpyObj<Firestore>;
  
  beforeEach(() => {
    const spy = jasmine.createSpyObj('Firestore', ['collection', 'doc']);
    
    TestBed.configureTestingModule({
      providers: [
        TodosFirestoreService,
        { provide: Firestore, useValue: spy }
      ]
    });
    
    service = TestBed.inject(TodosFirestoreService);
    firestoreMock = TestBed.inject(Firestore) as jasmine.SpyObj<Firestore>;
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

## 常見問題

### Q: 如何處理 Timestamp 型別？
```typescript
import { Timestamp } from '@angular/fire/firestore';

// Firestore → JavaScript Date
const date = timestamp.toDate();

// JavaScript Date → Firestore
const timestamp = Timestamp.fromDate(new Date());
```

### Q: 如何處理陣列操作？
```typescript
import { arrayUnion, arrayRemove } from '@angular/fire/firestore';

// 新增元素到陣列
await updateDoc(docRef, {
  tags: arrayUnion('new-tag')
});

// 從陣列移除元素
await updateDoc(docRef, {
  tags: arrayRemove('old-tag')
});
```

### Q: 如何處理交易？
```typescript
import { runTransaction } from '@angular/fire/firestore';

await runTransaction(this.firestore, async (transaction) => {
  const docRef = doc(this.firestore, 'counter/count');
  const docSnap = await transaction.get(docRef);
  
  const newCount = (docSnap.data()?.count || 0) + 1;
  transaction.update(docRef, { count: newCount });
});
```

## 最佳實踐

### ✅ 良好模式
1. 使用 TypeScript 介面定義資料結構
2. 將 Firebase 操作封裝在 Services 中
3. 使用 @ngrx/signals 管理應用狀態
4. 實作適當的錯誤處理
5. 使用環境變數管理 Firebase 配置
6. 啟用離線持久化
7. 為常用查詢建立索引

### ❌ 應避免
1. 在元件中直接使用 Firebase SDK
2. 忽略錯誤處理
3. 不限制查詢結果數量
4. 在客戶端執行複雜的資料處理
5. 忽略安全規則
6. 暴露敏感資料在客戶端

## 學習資源
- [官方文件](https://github.com/angular/angularfire)
- [Firebase 文件](https://firebase.google.com/docs)
- [Firestore 資料模型設計](https://firebase.google.com/docs/firestore/manage-data/structure-data)
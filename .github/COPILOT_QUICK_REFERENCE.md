# Copilot Quick Reference

> **常用模式與指令速查**

---

## 🚀 基本指令

### Copilot Chat 對話
```bash
# 開始任務
/new 建立新的 workspace 功能,遵循 DDD 架構

# 架構指導
@workspace 新增領域實體應該如何組織結構?

# 程式碼審查
/fix 檢查此元件是否符合 Angular 20 最佳實踐

# 產生測試
/tests 為此 store 建立單元測試,使用 @ngrx/signals
```

---

## 📋 核心模式

### DDD 新功能架構

```typescript
// 1️⃣ Domain Layer (domain/entities/)
export interface WorkspaceEntity {
  id: string;
  name: string;
  // 純領域模型,無 UI 欄位
}

// 2️⃣ Application Layer (application/stores/)
export const WorkspaceStore = signalStore(
  { providedIn: 'root' },
  withState({ workspaces: [] }),
  withMethods((store, service = inject(WorkspaceService)) => ({
    load: rxMethod<void>(
      pipe(
        switchMap(() => service.get()),
        tapResponse({
          next: (ws) => patchState(store, { workspaces: ws }),
          error: (e) => console.error(e)
        })
      )
    )
  }))
);

// 3️⃣ Infrastructure Layer (infrastructure/services/)
@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  private firestore = inject(Firestore);
  
  get(): Observable<Workspace[]> {
    // Firebase 邏輯
  }
}

// 4️⃣ Presentation Layer (presentation/components/)
@Component({
  standalone: true,
  template: `
    @if (store.workspaces(); as ws) {
      @for (w of ws; track w.id) {
        <div>{{ w.name }}</div>
      # Copilot 快速參考（精簡）

      —— 一頁速查：命令、核心規則、常見禁忌 ——

      ## 一行命令
      - `/new` 開啟新任務範本（附 DDD 要求）。
      - `/fix` 要求檢查並修正現有程式碼（列出違規點）。
      - `/tests` 產生測試樣板（指定 store 或 component）。

      ## 核心短句規則
      - 控制流程：使用 `@if / @for / @switch`，不要用 `*ngIf/*ngFor/*ngSwitch`。
      - 狀態管理：使用 `signalStore()` + `rxMethod()`，不要用傳統 `@ngrx/store`。
      - 非同步：用 `rxMethod(...tapResponse(...))`，不要在元件 `.subscribe()`。
      - 層界：業務邏輯放 Domain/Application，元件只做顯示與委派。

      ```mermaid
      flowchart LR
        Start[需要快速規則?] -->|控制流程| Rule1[@if/@for 範例]
        Start -->|狀態管理| Rule2[signalStore 範例]
        Start -->|除錯| Rule3[COPILOT_TROUBLESHOOTING.md]
      ```

      ## 常見禁忌（3 條）
      1. ❌ 別在 domain/import Angular 或 Firebase。
      2. ❌ 別使用 Zone.js 或 legacy control flow。
      3. ❌ 別把 persistence 放在 domain 實體中。

      最後更新：2026-01-28

---

## 📝 Code Snippets

### Component Template

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div>Loading...</div>
    } @else {
      @for (item of items(); track item.id) {
        <div>{{ item.name }}</div>
      }
    }
  `
})
export class MyComponent {
  private store = inject(MyStore);
  
  loading = computed(() => this.store.loading());
  items = computed(() => this.store.items());
  
  ngOnInit() {
    this.store.loadItems();
  }
}
```

### Store Template

```typescript
import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject, computed } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

export const MyStore = signalStore(
  { providedIn: 'root' },
  
  // State
  withState({
    items: [] as MyItem[],
    loading: false,
    error: null as string | null
  }),
  
  // Computed
  withComputed(({ items }) => ({
    itemCount: computed(() => items().length),
    hasItems: computed(() => items().length > 0)
  })),
  
  // Methods
  withMethods((store, service = inject(MyService)) => ({
    loadItems: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() => service.getItems()),
        tapResponse({
          next: (items) => patchState(store, { items, loading: false }),
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    )
  }))
);
```

---

## 🎓 Learning Path

### For New Developers

1. **Week 1**: Read [README.md](../README.md) and [AGENTS.md](../AGENTS.md)
2. **Week 2**: Study [DDD Instructions](./instructions/ng-ddd-architecture.instructions.md)
3. **Week 3**: Learn [NgRx Signals](./instructions/ngrx-signals.instructions.md)
4. **Week 4**: Practice with [Prompts](./prompts/) and [Skills](./skills/)

### For AI Assistants

1. Load [copilot-instructions.md](./copilot-instructions.md) first
2. Check [forbidden-copilot-instructions.md](./forbidden-copilot-instructions.md)
3. Review [project-layer-mapping.yml](./project-layer-mapping.yml)
4. Use appropriate [skills](./skills/) based on context
5. Reference [instruction files](./instructions/) for specific patterns

---

## 📞 Support

- **Documentation Issues**: Check [COPILOT_INDEX.md](./COPILOT_INDEX.md)
- **Architecture Questions**: Use [Arch Agent](./agents/arch.agent.md)
- **Code Quality**: Use [Janitor Agent](./agents/janitor.agent.md)
- **Latest Docs**: Use [Context7 Agent](./agents/context7.agent.md)

---

**Quick Tips**:
- Use `@workspace` in chat to search project knowledge
- Use `/new` to start fresh tasks
- Use `/fix` to review and improve code
- Use `/tests` to generate test cases
- Reference specific files with `@filename`

**Remember**: This is a zone-less Angular 20 app using @ngrx/signals. No Zone.js, no traditional NgRx!

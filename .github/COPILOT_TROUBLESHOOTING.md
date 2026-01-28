# Copilot Troubleshooting Guide

> **常見問題與解決方案**

---

## 🔍 問題分類

1. [Copilot 沒有回應](#copilot-沒有回應)
2. [建議錯誤的程式碼](#建議錯誤的程式碼)
3. [Skills 沒有載入](#skills-沒有載入)
4. [架構違規](#架構違規)

---

## Copilot 沒有回應

### 症狀
Copilot 不提供建議或聊天回應

### 解決方案

1. **檢查擴充功能狀態**
   - 開啟 VS Code Command Palette (Cmd/Ctrl+Shift+P)
   - 輸入 "GitHub Copilot: Check Status"
   - 確認已登入且有有效訂閱

2. **驗證網路連線**
   - Copilot 需要網際網路連線
   - 檢查防火牆/代理設定
   - 測試: `ping github.com`

3. **重新啟動擴充功能**
   ```
   Cmd/Ctrl+Shift+P → "Developer: Reload Window"
   ```

4. **清除快取**
   ```bash
   # 先關閉 VS Code
   rm -rf ~/.vscode/extensions/github.copilot-*
   # 重新啟動 VS Code 並重新安裝 Copilot
   ```

---

## 建議錯誤的程式碼

### 症狀
Copilot 建議違反專案規則的模式 (例如 traditional NgRx, *ngIf)

### 解決方案

1. **上下文未載入**
   - 在編輯器中開啟 `.github/copilot-instructions.md`
   - Copilot 需要專案上下文為活動狀態
   - 保持重要指令檔案在分頁中開啟

2. **更具體的提示**
   ```
   ❌ 不好: "建立一個元件"
   ✅ 好: "建立 standalone Angular 20 元件,使用 @if/@for 控制流程和 inject() 注入依賴"
   ```

3. **引用指令**
   ```
   @copilot 遵循 .github/instructions/ngrx-signals.instructions.md 中的 NgRx Signals 指令
   ```

4. **明確使用 Skills**
   ```
   載入 @ngrx-signals skill 並建立 workspace 管理的 signal store
   ```

5. **糾正並教導**
   - 當 Copilot 建議錯誤模式時,糾正它
   - 加入回饋: "不,使用 @if 而非 *ngIf"
   - Copilot 在該會話中會從您的糾正學習

### 常見錯誤模式

| 錯誤 | 正確 |
|------|------|
| `*ngIf="condition"` | `@if (condition()) { }` |
| `*ngFor="let item of items"` | `@for (item of items(); track item.id) { }` |
| `import { createAction } from '@ngrx/store'` | `import { signalStore } from '@ngrx/signals'` |
| `.subscribe(data => ...)` | `rxMethod(...tapResponse(...))` |
| `@Component({ })` 無 standalone | `@Component({ standalone: true })` |

---

## Skills 沒有載入

### 症狀
Copilot 不識別專案特定的 skills

### 解決方案

1. **確認 Skills 存在**
   ```bash
   ls .github/skills/
   ```

2. **檢查 SKILL.md 格式**
   - 每個 skill 資料夾必須包含 `SKILL.md`
   - 確保 frontmatter 正確

3. **重新載入視窗**
   ```
   Cmd/Ctrl+Shift+P → "Developer: Reload Window"
   ```

4. **明確引用 Skill**
   ```
   使用 @ngrx-signals skill 建立狀態管理
   ```

---

## 架構違規

### 症狀
Copilot 產生違反 DDD 層次邊界的程式碼

### 解決方案

1. **確認已讀取指令**
   - 開啟 `.github/copilot-instructions.md`
   - 確保檔案在編輯器中可見

2. **明確指定層次**
   ```
   在 domain 層建立實體,不要加入任何 Angular 或 Firebase imports
   ```

3. **使用架構檢查**
   ```bash
   # 執行 TypeScript 編譯檢查
   pnpm build --strict
   ```

4. **檢查常見違規**
   - ❌ Domain 匯入 Application/Infrastructure/Presentation
   - ❌ Application 匯入 Presentation
   - ❌ UI 欄位在 Domain 實體中
   - ❌ 使用 `as any` 繞過型別檢查

---

## 🛠️ 其他常見問題

### Copilot 建議過時的語法

**原因**: 訓練資料可能包含舊版本程式碼

**解決**: 
- 在提示中明確指定 "Angular 20"
- 引用相關 instructions 檔案
- 使用 `@workspace` 提供專案上下文

### Copilot 產生的測試無法執行

**原因**: 測試框架版本或配置不符

**解決**:
- 檢查 `package.json` 中的測試框架版本
- 引用現有測試檔案作為範例
- 使用 `/tests` 指令並指定框架

### Copilot 忽略專案慣例

**原因**: 上下文不足或指令不明確

**解決**:
- 開啟相關的慣例檔案 (如 `project-structure.instructions.md`)
- 在提示中明確提及慣例
- 提供具體範例

---

## 📖 更多資源

- **完整架構指南**: [copilot-instructions.md](.github/copilot-instructions.md)
- **快速參考**: [COPILOT_QUICK_REFERENCE.md](.github/COPILOT_QUICK_REFERENCE.md)
- **指令索引**: [COPILOT_INDEX.md](.github/COPILOT_INDEX.md)
- **禁止規則**: [forbidden-copilot-instructions.md](.github/forbidden-copilot-instructions.md)

---

**最後更新**: 2026-01-28

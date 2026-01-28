# Copilot Troubleshooting Guide

> **常見問題與解決方案**

---

## 🔍 問題分類

1. [Copilot 沒有回應](#copilot-沒有回應)
2. [建議錯誤的程式碼](#建議錯誤的程式碼)
3. [Skills 沒有載入](#skills-沒有載入)
4. [架構違規](#架構違規)

---

### 診斷樹 (快速排查流程)

```mermaid
flowchart TD
   # Copilot 故障排查（精簡）

   常見問題與快速解法，目標：3–5 行內解決步驟。

   1) Copilot 忽略專案規則
   - 解法：在 prompt 前綴「遵守：DDD、NgRx Signals、Angular20」，並附 3 行示例。

   2) Mermaid 無法呈現
   - 解法：導出 SVG 放入 `.github/images/`，或請 Copilot 輸出 ASCII 流程。

   3) TypeScript 嚴格錯誤
   - 解法：執行 `pnpm lint && pnpm build --no-watch`，修正型別、移除 `any`。

   4) CI 測試於雲端失敗
   - 解法：確認 CI env vars、使用 Firebase emulator、鎖定 Node/pnpm 版本。

   5) 建議含敏感資訊或不安全
   - 解法：用 `process.env` 代替、使用 Argon2/bcrypt、對輸入做 sanitize。

   6) 合併衝突或大型自動 PR
   - 解法：先 rebase → 小範圍 PR → 本地 lint/build 再推送。

   短則檢核（PR 前）：有無包含 repo 規則、是否附簡短正確範例、已本地 lint/build。

   最後更新：2026-01-28

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

# .github/archive — Copilot 資料歸檔說明

目的：把非必要的長篇 Copilot / agent / instructions 檔案從主工作目錄歸檔，減少 Copilot 被動閱讀時的噪音，同時保留可查考的歷史內容。

建議操作（選一）：

1. Submodule（推薦）
   - 建立新 repo（例如 `black-tortoise-copilot-configs`），把 `.github/agents/`、`.github/instructions/`、`.github/skills/`、`.github/prompts/`、`.github/collections/`、`COPILOT_*.md` 等移入。
   - 在主 repo 使用 `git submodule add` 引入，並在根 `copilot-summary.md` 保留摘要。

2. Archive 目錄（最簡）
   - 把上述資料以 `git mv` 移到本目錄（例如 `.github/archive/agents/`），並在 root `copilot-summary.md` 中保留精簡指令。

3. 外部 docs + CI 同步
   - 把細節放到外部 docs repo，CI 產生每日/週的「精華摘要」回寫到 `copilot-summary.md`。

候選要歸檔的路徑（建議）：
- `.github/agents/`
- `.github/instructions/`
- `.github/skills/`
- `.github/prompts/`
- `.github/collections/`
- `COPILOT_INDEX.md`, `COPILOT_QUICK_REFERENCE.md`, `COPILOT_TROUBLESHOOTING.md`

注意與風險：
- 歸檔不等於刪除：保留歷史很重要，選擇 submodule 或 archive 都能保留來源。
- 若你想保留 Copilot 的被動優化能力，請確保 `copilot-summary.md`（或 root `copilot-instructions.md`）涵蓋高優先規則。

下一步建議：
- 我可以幫你自動建立 submodule repo skeleton，或幫你用 `git mv` 把候選檔案移到這個資料夾（需要我操作請回覆 `移動`）。

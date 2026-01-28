
---

### Organization（組織）之完整表述

Organization 為系統中承載使用者治理與工作區歸屬之上層單位，
負責定義「誰有資格建立與管理工作區」，以及工作區之歸屬關係。

Organization 本身不承載任何工作區內之業務語境，
亦不參與工作區內之能力運作、流程控制或狀態管理。

工作區（Workspace）必須由使用者或組織建立，
且每一個 Workspace 必須明確隸屬於單一 User 或單一 Organization。
系統中不得存在未隸屬於 User 或 Organization 之 Workspace。

Organization 僅定義工作區建立與存續的治理前提，
一旦 Workspace 建立完成，其內部行為即完全由 Workspace 語境與模組能力自行負責。

---

### Organization Architecture Rules（最終規則句）

1. User 與 Organization 為系統中**唯一允許建立 Workspace（工作區邏輯容器）之主體**。

2. 任一 Workspace 必須隸屬於且僅隸屬於一個 User 或一個 Organization，不得同時隸屬於多個主體。

3. 系統中嚴格禁止建立不隸屬於 User 或 Organization 之 Workspace。

4. Organization 僅負責工作區之治理與歸屬關係，不得參與任何 Workspace 內部之業務語境、能力實作或流程控制。

5. Organization 不得直接讀取、寫入或影響 Workspace 內任何模組之狀態或資料。

6. Workspace 建立完成後，其內部生命週期與行為不得回溯依賴 Organization 之狀態或流程。

7. Organization 與 Workspace 之關係為「治理者」與「被治理之語境單位」，不得反轉其責任方向。

8. Organization 不得作為多個 Workspace 之狀態聚合中心或跨 Workspace 的協調者。

9. 使用者對 Workspace 的操作權限，必須經由 Organization 或 User 與 Workspace 之關係明確定義，不得隱含推導。

10. 任一系統進入點在建立 Workspace 前，必須先確立其所屬之 User 或 Organization 身分。

---

### 一句不可誤會的總結句

> User / Organization 決定「誰能建立工作區」，
> Workspace 決定「在此工作區中如何運作」，
> **組織治理不進入工作區，工作區行為不回流組織。**


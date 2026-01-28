
---

### User（使用者）完整表述

User 為系統中最基本的操作單位與權限主體。
User 可以建立 Workspace（工作區邏輯容器）、加入 Organization，並在 Workspace 中操作模組能力。

User 本身不承擔 Workspace 的業務邏輯，不管理 Workspace 內部模組狀態，也不直接干預 Organization 的治理。
User 的主要責任是提供操作身份（Identity）與權限認證（Permission），並決定哪些 Workspace 由自己建立或參與。

User 與 Organization 共同構成系統中 Workspace 的建立者與歸屬者。
Workspace 的生命週期、模組能力與狀態均由 Workspace Context 與模組自身管理，User 僅透過角色與權限參與操作。

---

### User Architecture Rules（最終規則句）

1. User 為系統中 **唯一可直接建立 Workspace 的自然人操作單位**，Workspace 之所有權自動歸屬該 User。

2. User 可以加入一個或多個 Organization，但每一個 Workspace 仍須明確隸屬於單一 User 或單一 Organization。

3. User 僅提供身份與操作權限，不得直接管理 Workspace 內部模組之狀態或流程。

4. User 不得擅自更改 Workspace Context，所有 Workspace 語境變更需透過 Workspace 或 Organization 授權事件完成。

5. User 對 Workspace 的操作權限，必須明確對應其角色與權限設定，禁止隱性假設或推導。

6. User 無權直接操作其他 User 所擁有的 Workspace，除非被明確授權（例如 Organization 共享或邀請）。

7. User 與 Workspace 之關係為「操作主體」與「被操作語境單位」，不得反轉責任方向。

8. User 不得干預 Organization 的治理或 Workspace 內模組能力的自治行為。

---

### 一句不可誤會的總結句

> User 是操作身份與權限主體，決定「我能做什麼、在哪個 Workspace 做」，
> **Workspace 與模組自主運作，User 僅透過角色與權限參與操作。**

---

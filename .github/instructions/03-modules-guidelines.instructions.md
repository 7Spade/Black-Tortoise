---
description: "Architecture rules and guidelines for Modules as Workspace capabilities, state isolation, and event-driven collaboration."
applyTo: "**"
---

---

### Workspace（工作區）之完整表述

Workspace 為系統中承載使用者協作與業務行為之最高層級工作單位，
同時也是模組能力運作之語境邊界與生命週期邊界。

Workspace 負責定義「在此工作區中，誰正在操作、可做什麼、目前是否可操作」，
但**不直接參與任何業務流程、功能行為或資料處理**。

Workspace 本身不實作能力、不保存模組狀態、不協調模組流程，
僅提供一個穩定且一致的工作語境，使所有能力模組能在相同前提下運作。

Workspace 的狀態變化僅限於其自身語境層級，例如建立、啟用、封存、權限異動，
所有業務行為皆由模組於 Workspace 語境中各自完成。

---

### Workspace Architecture Rules（最終規則句）

1. Workspace 為系統中最高層級之工作語境單位，所有業務能力必須隸屬於某一 Workspace 之下運作。

2. Workspace 本身不屬於任何模組，亦不得被任何模組依賴為功能實作或流程控制對象。

3. Workspace 僅負責定義與維護工作語境，不得承擔任何業務能力、功能行為或資料處理責任。

4. Workspace 不得直接讀取、寫入或協調任何模組之應用狀態或業務資料。

5. Workspace 之狀態僅包含語境層級資訊，例如 Workspace 身分、生命週期狀態與成員角色關係。

6. Workspace 的生命週期變化不得隱含或觸發任何模組流程，僅能以事件形式對外宣告事實已發生。

7. 所有模組必須在 Workspace 所提供之語境下獨立運作，不得假設 Workspace 會管理或同步其內部狀態。

8. Workspace 不得作為模組之間的協調者、仲介者或狀態聚合中心。

9. 任何進入點（例如路由、初始化流程）皆必須先確立 Workspace 語境，再進入模組能力範圍。

10. Workspace 與模組之關係為「語境提供者」與「能力執行者」，不得反轉其責任方向。

---

### 一句不可誤會的總結句（可放章節結尾）

> Workspace 定義「這是哪個工作區、是否可運作」，
> 模組定義「在此工作區中可以完成哪些能力」，
> **Workspace 不做事，只定義事發生的前提。**


---
description: "Architecture rules and guidelines for Workspace context and lifecycle management."
applyTo: "**"
---

---

### 工作區邏輯容器之模組與 Context 完整表述

在工作區邏輯容器中，十二個模組皆屬於 Workspace 所提供的能力（Capabilities）。
所有模組均運作於同一個且唯一的 Workspace Context 之下，並共享該 Context 所定義之工作語境事實。
Workspace Context 用以描述「當前使用者所處之工作區語境」，包含 workspace 身分、使用者角色與權限快照，以及工作區生命週期狀態。

Workspace Context 僅作為穩定、可同步存取之語境邊界存在，不承載任何模組行為、流程控制或應用狀態。
各模組之能力實作、應用狀態與內部流程，皆必須完整封裝於模組自身邊界之內。
模組之間不得共享或直接存取彼此狀態，跨模組之協作僅能透過事件進行，以維持高內聚與低耦合之設計原則。

---

### Architecture Rules（最終規則句）

1. Workspace Context 為工作區層級之唯一 Context，系統中不得存在任何以模組、功能或畫面為單位之 Context。

2. 十二個模組皆定義為 Workspace 的 Capability，模組本身不得承擔 Context 職責，亦不得延伸或衍生 Context。

3. Workspace Context 僅能承載跨模組且具不變性或準不變性之工作語境事實，不得承載任何模組資料、流程狀態或 UI 狀態。

4. 嚴格禁止將任何模組之應用狀態、業務資料或流程階段寫入或提升至 Workspace Context。

5. 每一模組必須完整擁有並管理自身之能力實作、應用狀態與流程控制，該狀態不得被其他模組讀取、寫入或共享。

6. 模組之間不得直接依賴或呼叫彼此的內部實作、Facade 或狀態存取介面。

7. 跨模組互動唯一允許之方式為事件傳遞；事件僅表示事實已發生，不得作為狀態查詢或狀態同步機制。

8. Workspace Context 僅可於語境本身發生變化時更新（例如角色異動或工作區狀態變更），不得因模組行為而變動。

9. Router Guard 與應用初始化邏輯僅得依賴 Workspace Context 進行判斷，不得依賴任何模組狀態或事件結果。

10. Guard 必須為純條件判斷邏輯，不得產生副作用、狀態變更或事件發送行為。

---

### 一句不可誤會的總結句（可放章節結尾）

> Workspace Context 僅提供穩定的工作語境與跨模組前提，各模組自主管理自身能力與狀態，跨模組協作僅透過事件，確保高內聚、低耦合與系統一致性。

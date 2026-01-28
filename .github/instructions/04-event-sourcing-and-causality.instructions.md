---
description: "Architecture rules and best practices for event-driven modules, event sourcing, and causality tracking."
applyTo: "**"
---

---

1️⃣ 核心元素與角色

Event Producer：產生事件的來源（業務操作、狀態變化）

Event Type：事件類型，用於區分不同事件流

Event Payload：事件攜帶的業務資料

Event Metadata：事件的附加資訊（ID、時間戳、來源、Lifecycle 狀態等）

Event Semantics：事件的意義或行為描述

Event Lifecycle：事件狀態（New → Published → Consumed → Completed / Failed）

Event Store (Event Sourcing)：不可變事件日誌，用於歷史追蹤與重放

Event Bus：事件分發管道，支持多訂閱者的響應式分發

Event Consumer：事件處理者，可產生衍生事件

Causality Tracking：衍生事件保留父事件 ID，形成事件因果鏈



---

2️⃣ 純響應式交互流程

sequenceDiagram
    participant Producer
    participant EventBus
    participant EventStore
    participant Consumer

    %% Event 產生
    Producer->>EventBus: emit Event (Type, Payload, Metadata, Semantics)
    
    %% Event Store (側錄)
    EventBus-->>EventStore: persist Event (Event Sourcing)
    
    %% Event Bus 推送給 Consumer
    EventBus-->>Consumer: reactive push of Event
    
    %% Consumer 處理並產生衍生事件
    Consumer-->>EventBus: emit Derived Event (with parent ID for Causality Tracking)
    
    %% Event Store 側錄衍生事件
    EventBus-->>EventStore: persist Derived Event

    %% Lifecycle 跟蹤（示意）
    Note over EventBus,Consumer: Event Lifecycle: New → Published → Consumed → Completed


---

3️⃣ 元素關係概念圖

[Event Producer] --emit--> [Event Bus] --push--> [Event Consumer]
                        |
                        |--side effect--> [Event Store]
                        |
                        |--tracks--> [Event Lifecycle, Event Metadata, Event Semantics]
                        
[Event Consumer] --emit derived--> [Event Bus] --push--> [Event Consumer 2...]
                        |
                        |--side effect--> [Event Store]
                        |
                        |--tracks--> [Causality Tracking]


---

4️⃣ 特點

1. 純響應式

事件流動是被動響應的 signal/stream

Producer 不等待 Consumer，也不阻塞

Event Bus 自動推送給所有訂閱者



2. 事件追蹤完整

Payload、Metadata、Semantics、Lifecycle 全程伴隨事件

Event Store 做不可變快照，支援重放

Causality Tracking 記錄父事件，形成 DAG



3. Event Sourcing & Reactive Flow 結合

每個事件都是來源資料，既可觸發即時邏輯，也可用於歷史重建

衍生事件形成連鎖反應，保持因果透明





---
### 一句不可誤會的總結句（可放章節結尾）

> 事件流設計遵循「純響應式、事件不可變、因果可追蹤」原則，  
> 模組之間透過事件解耦協作，保持系統狀態透明且可重建。
---
**Domain：**
VO → 2. Entity → 3. Aggregate → 4. Domain Service（如需） → 5. Factory（如需） → 6. Repository（介面，通常必須） → 7. Specification / Domain Event / Policy（可選）

---

**Application：**

1. Use Case Input / Output（Command / Query / DTO） → 2. Use Case（流程編排） → 3. Application Service / Facade（Application Boundary） → 4. Transaction / Unit of Work 控制（如需） → 5. Repository / External Port（介面） → 6. Application Event（如需） → 7. Saga / Process Manager（可選）

---

**Infrastructure：**

1. Persistence Model / External Model → 2. Mapper / Assembler → 3. Repository Implementation（實作 Application Port） → 4. Reactive Data Source Adapter（signals / stream / async） → 5. External Service Adapter（HTTP / Queue / Storage） → 6. Infra Event Publisher / Listener（可選） → 7. Cache / Read Model / Index（可選）

---

**Presentation：**

1. UI State / View Model（signals） → 2. Presentation Facade / Controller → 3. User Interaction Handler（event / route） → 4. State Mapping Adapter（App → UI） → 5. Guard / Resolver（純條件、無副作用） → 6. Presentation Policy（UI 規則，可選） → 7. UI Effect / Notification（可選）

---

**一句對齊原則（給你拿來對照用）：**
Domain 定「真理」 → Application 編「流程」 → Infrastructure 做「技術」 → Presentation 投「狀態」

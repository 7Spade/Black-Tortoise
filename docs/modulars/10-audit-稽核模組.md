# 稽核模組 (AuditModule) - 開發指南

**模組編號**：10-audit
**版本**：2.0
**最後更新**：2026-01-27
**父文件**：workspace-modular-architecture_constitution_enhanced.md

---

## 一、模組概述

### 核心職責
系統操作與安全日誌 (Audit Log)，記錄所有重要操作

### 邊界定義
唯讀 (Read-Only) 呈現，確保日誌不可篡改

### 在架構中的位置
本模組是 Workspace 的子模組之一，遵循 Domain → Application → Infrastructure → Presentation 的分層架構。

---

## 二、功能需求規格

### 1. 操作記錄

#### 需求清單
1. 記錄所有模組的關鍵操作 (CRUD)
2. 記錄權限變更、角色分配
3. 記錄成員邀請、移除
4. 記錄任務狀態流轉
5. 記錄問題單建立、解決
6. 記錄文件上傳、刪除
7. 記錄設定變更
8. 記錄屬性：操作 ID、時間、操作者、操作類型、操作對象、操作模組、操作詳情、IP 位址、使用者代理

### 2. 唯讀呈現

#### 需求清單
1. 稽核日誌一旦建立，不可修改或刪除
2. 使用 append-only 模式儲存
3. 定期備份日誌資料
4. 僅 Owner 和 Admin 可查看完整稽核日誌
5. 一般成員僅可查看自己的操作記錄
6. 敏感操作需特殊權限查看

### 3. 多維度篩選

#### 需求清單
1. 依時間範圍篩選
2. 依操作者篩選
3. 依模組篩選
4. 依操作類型篩選
5. 依操作對象篩選
6. 支援關鍵字搜尋
7. 支援進階搜尋

### 4. 日誌視覺化

#### 需求清單
1. 以時間軸方式呈現操作記錄
2. 支援展開/收合詳細資訊
3. 操作次數趨勢圖 (折線圖)
4. 各模組操作分佈 (圓餅圖)
5. 各操作類型分佈 (長條圖)
6. 各成員操作次數排行 (橫向長條圖)

### 5. 日誌匯出與備份

#### 需求清單
1. 支援匯出為 Excel / CSV / JSON
2. 支援自訂匯出欄位
3. 支援匯出篩選後的結果
4. 定期自動備份稽核日誌
5. 備份儲存在獨立的儲存空間
6. 支援手動觸發備份

### 6. 異常偵測

#### 需求清單
1. 短時間內大量操作 (可能是惡意行為)
2. 非工作時間的操作 (可能是異常存取)
3. 刪除大量資料 (可能是誤操作或惡意破壞)
4. 偵測到異常行為時，發送警報通知管理員
5. 記錄異常事件，標記為高優先級

---

## 三、現代化實作要求

### Angular 20+ 最佳實踐

- 使用 signalStore 維護稽核日誌 (Read-Only)
- 訂閱所有模組的操作事件，自動記錄
- 使用 computed signal 進行多維度篩選

### 模板控制流 (Control Flow)
- **必須**使用 @if / @else 取代 *ngIf
- **必須**使用 @for (item of items; track item.id) 取代 *ngFor
- **必須**使用 @switch / @case 取代 *ngSwitch
- **必須**使用 @defer 進行延遲載入

### 狀態管理 (State Management)
- 使用 NgRx Signals (signalStore) 管理所有狀態
- 禁止使用 BehaviorSubject 或手動 subscribe
- 所有計算屬性使用 computed signal
- 所有副作用使用 effect

### 效能優化
- 啟用 Zone-less Change Detection
- 使用 ChangeDetectionStrategy.OnPush
- 重型視圖使用 @defer (on viewport)
- 次要互動使用 @defer (on interaction)

---

## 四、事件整合

### 發布事件 (Published Events)
- 無

### 訂閱事件 (Subscribed Events)
- **ALL_EVENTS**

### 事件處理原則
1. 事件必須遵循 Append -> Publish -> React 順序
2. 事件 Payload 必須是純資料 DTO
3. 所有事件必須包含 correlationId
4. 禁止在事件中傳遞 Service/Function/UI Reference

---

## 五、禁止事項 (Forbidden Practices)

- ❌ 修改或刪除稽核日誌
- ❌ 繞過稽核記錄執行敏感操作
- ❌ 跨 Workspace 存取稽核日誌

---

## 六、測試策略

### Unit Tests
- 測試 computed 邏輯是否正確反映 source signal 的變化
- 測試 pure functions 的輸入輸出
- 禁止測試 effect 的副作用

### Integration Tests
- 測試事件發布與訂閱的契約
- Given 初始 State → When 發出 Command → Then 驗證 Event
- 不驗證 Private Method 或 Private State

### E2E Tests
- 覆蓋關鍵使用者流程
- 驗證 Optimistic UI 的正確回滾

---

## 七、UI/UX 規範

### 設計系統
- 使用 Angular Material (M3)
- 使用 Tailwind CSS (Utility-first)
- 遵循統一的卡片、按鈕、Dialog 佈局

### 無障礙設計 (A11y)
- 支援鍵盤導航
- 使用語意化 HTML
- 重要狀態變更使用 LiveAnnouncer 通知

### Core Web Vitals
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1

---

## 八、DDD 實作規範

### Aggregate Root
- 支援 Creation (create()) 與 Reconstruction (reconstruct())
- 所有業務變更方法必須產生 Domain Event
- reconstruct 不產生 Domain Event

### Child Entities
- 使用 Value Object ID
- 禁止直接暴露陣列，必須透過方法操作

### 型別安全
- 禁止使用 any 或 as unknown
- Mapper 必須明確處理深層嵌套物件

---

## 九、開發檢查清單

實作本模組時，請確認以下項目：

- [ ] 模組遵循 Domain → Application → Infrastructure → Presentation 分層
- [ ] 使用 signalStore 管理狀態
- [ ] 模板使用 @if / @for / @switch (禁止 *ngIf / *ngFor)
- [ ] @for 必須包含 track 表達式
- [ ] 使用 @defer 延遲載入重型視圖
- [ ] 所有事件包含 correlationId
- [ ] 事件遵循 Append -> Publish -> React
- [ ] 模組間僅透過 Event Bus 互動
- [ ] Component 設定 ChangeDetectionStrategy.OnPush
- [ ] 支援鍵盤導航與螢幕閱讀器
- [ ] 撰寫 Unit / Integration / E2E 測試
- [ ] 遵循奧卡姆剃刀原則，避免過度設計

---

## 十、參考資料

- **父文件**：workspace-modular-architecture_constitution_enhanced.md
- **DDD 規範**：.github/skills/ddd/SKILL.md
- **Angular 文件**：https://angular.dev
- **Angular Material**：https://material.angular.io
- **Tailwind CSS**：https://tailwindcss.com

---

**注意**：本指南必須與父文件保持一致。若有衝突，以父文件為準。

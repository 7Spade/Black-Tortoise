# 文件模組 (DocumentsModule) - 開發指南

**模組編號**：02-documents
**版本**：2.0
**最後更新**：2026-01-27
**父文件**：workspace-modular-architecture_constitution_enhanced.md

---

## 一、模組概述

### 核心職責
Workspace 檔案資產管理，包含檔案樹結構與資料夾組織

### 邊界定義
僅處理檔案的 CRUD 與組織，不涉及檔案內容的業務邏輯

### 在架構中的位置
本模組是 Workspace 的能力模組 (Capability Module) 之一，遵循 Domain → Application → Infrastructure → Presentation 的分層架構。模組自主管理自身狀態，不依賴或修改 Workspace Context，僅透過事件與其他模組協作。

---

## 二、架構指引遵循

本模組的實作必須嚴格遵循以下架構指引文件：

1. **使用者層級指引**  
   `.github/instructions/00-user-guidelines.instructions.md`  
   定義使用者體驗、無障礙設計、互動模式等前端規範

2. **組織層級指引**  
   `.github/instructions/01-organization-guidelines.instructions.md`  
   定義多組織管理、權限隔離、資源分配等規範

3. **工作區層級指引**  
   `.github/instructions/02-workspace-guidelines.instructions.md`  
   定義 Workspace Context 邊界、模組協作、狀態管理等核心規範

4. **模組開發指引**  
   `.github/instructions/03-modules-guidelines.instructions.md`  
   定義模組分層架構、DDD 實作、事件驅動等開發規範

5. **事件溯源與因果關係**  
   `.github/instructions/04-event-sourcing-and-causality.instructions.md`  
   定義事件設計、因果鏈追蹤、事件處理順序等規範

**重要提醒**：所有實作決策若與上述指引衝突，必須以指引文件為準。若指引之間有衝突，優先順序為 04 > 03 > 02 > 01 > 00。

---

## 三、開發流程與方法

本模組採用 **Sub-Agent + Software Planning + Sequential Thinking** 的開發流程：

### 流程說明

1. **Software Planning 階段**  
   - 使用 `software-planning-mcp` 工具建立模組開發計劃
   - 分解功能需求為可執行的開發任務
   - 定義各層級（Domain/Application/Infrastructure/Presentation）的職責邊界
   - 建立事件流轉與模組互動的序列圖

2. **Sequential Thinking 階段**  
   - 使用 `server-sequential-thinking` 工具進行逐步推理
   - 驗證架構設計是否符合 DDD 原則
   - 檢查事件設計是否滿足因果完整性
   - 確認模組邊界是否清晰且無循環依賴

3. **Sub-Agent 協作**  
   - Domain Agent: 負責 Aggregate、Entity、Value Object 設計
   - Application Agent: 負責 Use Case、Command Handler、Event Handler 實作
   - Infrastructure Agent: 負責 Repository、Adapter、外部服務整合
   - Presentation Agent: 負責 Component、Store、UI 互動邏輯

4. **迭代與驗證**  
   - 每完成一個功能需求，回到 Planning 階段驗證
   - 使用 Sequential Thinking 檢查是否引入技術債
   - 確保所有變更都有對應的測試覆蓋

---

## 四、模組結構規劃

以下是本模組預期的檔案結構樹（按分層展示）：

```
src/app/modules/
├── documents/domain/
│   ├── aggregates/
│   │   └── file-tree.aggregate.ts
│   ├── entities/
│   │   ├── document.entity.ts
│   │   └── folder.entity.ts
│   ├── value-objects/
│   │   ├── document-id.vo.ts
│   │   ├── folder-id.vo.ts
│   │   ├── file-path.vo.ts
│   │   └── file-metadata.vo.ts
│   ├── events/
│   │   ├── document-uploaded.event.ts
│   │   ├── document-deleted.event.ts
│   │   ├── folder-created.event.ts
│   │   └── folder-deleted.event.ts
│   └── repositories/
│       └── file-tree.repository.interface.ts
│
├── documents/application/
│   ├── commands/
│   │   ├── upload-document.command.ts
│   │   ├── delete-document.command.ts
│   │   ├── create-folder.command.ts
│   │   ├── delete-folder.command.ts
│   │   └── move-node.command.ts
│   ├── handlers/
│   │   ├── upload-document.handler.ts
│   │   ├── delete-document.handler.ts
│   │   ├── create-folder.handler.ts
│   │   ├── delete-folder.handler.ts
│   │   └── move-node.handler.ts
│   ├── queries/
│   │   ├── get-file-tree.query.ts
│   │   └── search-documents.query.ts
│   ├── models/
│   │   └── file-node-view.model.ts
│   └── stores/
│       └── documents.store.ts
│
├── documents/infrastructure/
│   ├── repositories/
│   │   └── file-tree.repository.ts
│   ├── adapters/
│       ├── firebase-storage.adapter.ts
│       └── file-upload.service.ts
│   ├── models/
│   │   └── file-node.dto.ts
│   └── mappers/
│       └── file-tree.mapper.ts
│
└── documents/presentation/
    ├── components/
    │   ├── file-tree/
    │   │   ├── file-tree.component.ts
    │   │   ├── file-tree.component.html
    │   │   └── file-tree.component.scss
    │   ├── file-uploader/
    │   │   ├── file-uploader.component.ts
    │   │   ├── file-uploader.component.html
    │   │   └── file-uploader.component.scss
    │   └── document-preview/
    │       ├── document-preview.component.ts
    │       ├── document-preview.component.html
    │       └── document-preview.component.scss
    └── pages/
        └── documents-page.component.ts
```

---

## 五、預計新增檔案

### Domain Layer (src/app/modules/documents/domain/)
- `aggregates/file-tree.aggregate.ts` - 檔案樹聚合根
- `entities/document.entity.ts` - 文件實體
- `entities/folder.entity.ts` - 資料夾實體
- `value-objects/document-id.vo.ts` - 文件 ID 值物件
- `value-objects/folder-id.vo.ts` - 資料夾 ID 值物件
- `value-objects/file-path.vo.ts` - 檔案路徑值物件
- `value-objects/file-metadata.vo.ts` - 檔案元資料值物件
- `events/document-uploaded.event.ts` - 文件上傳事件
- `events/document-deleted.event.ts` - 文件刪除事件
- `events/folder-created.event.ts` - 資料夾建立事件
- `events/folder-deleted.event.ts` - 資料夾刪除事件
- `repositories/file-tree.repository.interface.ts` - Repository 介面

### Application Layer (src/app/modules/documents/application/)
- `commands/upload-document.command.ts` - 上傳文件命令
- `commands/delete-document.command.ts` - 刪除文件命令
- `commands/create-folder.command.ts` - 建立資料夾命令
- `commands/delete-folder.command.ts` - 刪除資料夾命令
- `commands/move-node.command.ts` - 移動節點命令
- `handlers/upload-document.handler.ts` - 上傳文件處理器
- `handlers/delete-document.handler.ts` - 刪除文件處理器
- `handlers/create-folder.handler.ts` - 建立資料夾處理器
- `handlers/delete-folder.handler.ts` - 刪除資料夾處理器
- `handlers/move-node.handler.ts` - 移動節點處理器
- `queries/get-file-tree.query.ts` - 取得檔案樹查詢
- `queries/search-documents.query.ts` - 搜尋文件查詢
- `models/file-node-view.model.ts` - 檔案節點視圖模型
- `stores/documents.store.ts` - 文件 Signal Store

### Infrastructure Layer (src/app/modules/documents/infrastructure/)
- `repositories/file-tree.repository.ts` - Repository 實作
- `adapters/firebase-storage.adapter.ts` - Firebase Storage 適配器
- `adapters/file-upload.service.ts` - 檔案上傳服務
- `models/file-node.dto.ts` - 檔案節點 DTO/Schema
- `mappers/file-tree.mapper.ts` - 檔案樹資料轉換器

### Presentation Layer (src/app/modules/documents/presentation/)
- `components/file-tree/file-tree.component.ts` - 檔案樹元件
- `components/file-tree/file-tree.component.html` - 檔案樹模板
- `components/file-tree/file-tree.component.scss` - 檔案樹樣式
- `components/file-uploader/file-uploader.component.ts` - 檔案上傳元件
- `components/file-uploader/file-uploader.component.html` - 檔案上傳模板
- `components/file-uploader/file-uploader.component.scss` - 檔案上傳樣式
- `components/document-preview/document-preview.component.ts` - 文件預覽元件
- `components/document-preview/document-preview.component.html` - 文件預覽模板
- `components/document-preview/document-preview.component.scss` - 文件預覽樣式
- `pages/documents-page.component.ts` - 文件頁面元件

---

## 六、功能需求規格

### 1. 檔案樹 (File Tree)

#### 需求清單
1. 使用樹狀結構儲存檔案與資料夾關係
2. 每個節點包含：id, name, type (file/folder), parentId, children, metadata
3. 支援最大深度限制 (建議 10 層)
4. 使用 mat-tree 或自訂樹狀元件呈現檔案樹
5. 支援展開/收合資料夾，記住展開狀態
6. 支援拖曳移動檔案/資料夾 (使用 CDK Drag & Drop)
7. 支援多選操作 (Ctrl+Click, Shift+Click)
8. 右鍵選單：新增資料夾、重新命名、刪除、移動、複製連結
9. 麵包屑導航：顯示當前路徑，支援快速跳轉
10. 雙擊檔案：預覽或下載
11. 檔案圖示：依副檔名顯示不同圖示

### 2. 新增資料夾 (Create Folder)

#### 需求清單
1. 彈出 Dialog 輸入資料夾名稱
2. 驗證名稱：不可為空、不可重複、不可包含特殊字元
3. 新資料夾預設在當前選中的節點下建立
4. 若未選中任何節點，則在根目錄建立
5. 建立後自動選中新資料夾並展開父節點
6. 發布 FolderCreated 事件

### 3. 檔案上傳 (File Upload)

#### 需求清單
1. 支援拖曳上傳：拖曳到樹狀結構或指定區域
2. 支援點擊上傳：點擊按鈕選擇檔案
3. 支援批次上傳：一次選擇多個檔案
4. 支援資料夾上傳：保留資料夾結構
5. 使用 Signal 追蹤上傳進度
6. 使用 mat-progress-bar 顯示進度
7. 支援暫停/恢復上傳 (Optional)
8. 支援取消上傳
9. 檢查檔案大小 (預設限制 100MB)
10. 檢查檔案類型 (允許清單)
11. 檢查檔案名稱：不可包含特殊字元
12. 檢查重複：同名檔案提示覆蓋或重新命名
13. 自動刷新檔案樹
14. 發布 DocumentUploaded 事件

### 4. 檔案列表與搜尋

#### 需求清單
1. 使用 cdk-virtual-scroll-viewport 處理大量檔案列表
2. 僅渲染可見區域的檔案項目
3. 支援檔案名稱全文搜尋
4. 支援標籤搜尋 (Optional)
5. 支援進階篩選：檔案類型、上傳日期、上傳者、大小範圍
6. 使用 computed signal 過濾檔案列表
7. 支援多欄位排序：名稱、大小、修改日期、上傳者
8. 支援升序/降序切換
9. 記住使用者的排序偏好

### 5. 檔案預覽與下載

#### 需求清單
1. 圖片：直接在 Dialog 中顯示
2. PDF：使用 PDF Viewer 元件顯示
3. 文字檔案：直接顯示內容
4. 單檔下載：直接下載檔案
5. 批次下載：打包為 ZIP 下載
6. 資料夾下載：遞迴打包所有子檔案與資料夾

---

## 七、現代化實作要求

### Angular 20+ 最佳實踐

- 使用 signalStore 維護檔案樹狀態
- 上傳進度必須封裝為 Signal
- 檔案預覽元件使用 @defer (on interaction) 延遲載入

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

## 八、事件整合

### 發布事件 (Published Events)
- **DocumentUploaded**
- **DocumentDeleted**
- **FolderCreated**
- **FolderDeleted**

### 訂閱事件 (Subscribed Events)
- **WorkspaceSwitched**

### 事件處理原則
1. 事件必須遵循 Append -> Publish -> React 順序
2. 事件 Payload 必須是純資料 DTO
3. 所有事件必須包含 correlationId
4. 禁止在事件中傳遞 Service/Function/UI Reference

---

## 九、架構合規性

### Workspace Context 邊界
- 本模組不修改 Workspace Context
- 不直接依賴其他模組的內部狀態
- 跨模組協作僅透過事件完成

### 模組自主性
- 完全擁有並管理檔案樹與檔案資料狀態
- 不允許其他模組直接讀寫本模組狀態
- 狀態變更必須透過 Domain Event 公告

## 十、禁止事項 (Forbidden Practices)

- ❌ 在 Component 中直接操作 Storage SDK
- ❌ 在 Component 中處理檔案上傳邏輯，必須委派給 Use Case
- ❌ 跨 Workspace 存取檔案
- ❌ 直接修改 Workspace Context 或其他模組狀態
- ❌ 將模組狀態寫入 Workspace Context

---

## 十一、測試策略

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

## 十二、UI/UX 規範

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

## 十三、DDD 實作規範

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

## 十四、開發檢查清單

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

## 十五、參考資料

- **父文件**：workspace-modular-architecture_constitution_enhanced.md
- **DDD 規範**：.github/skills/ddd/SKILL.md
- **Angular 文件**：https://angular.dev
- **Angular Material**：https://material.angular.io
- **Tailwind CSS**：https://tailwindcss.com

---

**注意**：本指南必須與父文件保持一致。若有衝突，以父文件為準。

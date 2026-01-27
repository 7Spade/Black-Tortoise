Workspace 模組化架構與純響應式規則 (Workspace Modular Architecture & Pure Reactive Rules)本文件作為 Black-Tortoise 專案的最高指導原則 (The Constitution)，定義 Workspace 與各業務模組的互動介面、狀態管理、UI 設計規範與工程標準。
Copilot 在生成代碼時必須嚴格遵守此文件，優先於其他通用規則。
層級總則：.github/skills/ddd/SKILL.md 為最上位規範，本文件在其之下提供 Workspace 及模組化的具體落地細則；若有衝突，以 DDD SKILL 為準。一、核心架構定義 (Core Architecture Definitions)1. Workspace 作為一級邏輯容器 (Logical Container)

邊界定義：Workspace 是唯一的狀態、事件、權限與資料一致性邊界。
生命週期：所有業務模組 (Modules) 皆依附於 Workspace 存在。

必須在 Workspace Context 內初始化。
切換 Workspace 時，必須完整銷毀並重建其下所有模組狀態。


DDD 層級：Workspace 對應 Application Context；Module 對應 Application 內的子 Use Case 群組。
Domain 隔離：Domain Layer 不感知 Workspace 或 Module 的存在。
依賴方向：遵循 Domain → Application → Infrastructure → Presentation 單向依賴，禁止任何反向引用、barrel export 或間接耦合破壞層級。
介面歸屬：Module 所需的 interface 必須定義在 Application/Domain，Infrastructure 只能實作，Presentation 只能透過 Application Store/Facade 進入。
2. 純響應式通訊 (Pure Reactive Communication)

模組間互動：一律透過 Workspace-scoped Event Bus。
禁止直接呼叫：模組間不得直接呼叫 Service 或 Facade。
狀態隔離：模組間不得直接共享 Signal State。
事件驅動：所有跨模組影響必須以 Event 表達 (e.g., TaskStatusChanged, RoleCreated)。
事件鏈順序：事件必須遵循 Append -> Publish -> React 三段式，禁止先 Publish 後 Append。
二、模組職責規範 (Module Responsibilities)本節定義業務模組的核心職責與邊界。Copilot 應以此判斷功能該歸屬何處。1. 權限模組 (PermissionsModule)核心職責

職責：管理 Workspace 內的權限矩陣 (RBAC) 與自訂角色。
邊界：僅處理「誰可以做什麼」，不涉及身份識別 (Identity)。
功能需求1.1 權限矩陣 (Permission Matrix)

資料結構：

使用 Map<RoleId, Set<PermissionId>> 結構儲存角色-權限映射。
權限必須細粒度化 (tasks:create, tasks:edit, tasks:delete, qc:approve)。
支援資源層級權限 (resource-level permissions)：特定任務、特定文件。



UI 呈現：

二維矩陣視圖：行為角色，列為資源/操作。
支援 Sticky Headers (凍結行列標題)。
單元格使用 mat-checkbox，支援批次操作 (全選/全不選)。
提供快速篩選：依模組、依角色、依權限類型。



互動設計：

樂觀更新 (Optimistic Update)：勾選立即更新 UI Signal，背景送 API，失敗則回滾。
批次操作支援：選擇多個角色，一次性授予/撤銷權限。
變更歷史：顯示誰在何時修改了哪些權限。



權限繼承：

支援權限繼承：子資源繼承父資源的權限設定。
支援權限覆蓋：特定資源可覆蓋繼承的權限。


1.2 自訂角色 (Custom Roles)

角色管理：

支援建立/編輯/刪除自訂角色 (除系統預設角色外)。
角色必須包含：名稱、描述、權限集合、顏色標記。
角色命名規則：不可與現有角色重複，長度 3-30 字元。



角色範本：

提供常用角色範本：專案經理、開發人員、測試人員、訪客。
使用者可基於範本快速建立自訂角色。



角色層級：

系統預設角色：Owner (擁有者) > Admin (管理員) > Member (成員) > Viewer (訪客)。
Owner 不可刪除，每個 Workspace 至少一個 Owner。
自訂角色可設定優先級 (用於權限衝突時的判定)。



角色指派：

支援將角色指派給成員。
一個成員可擁有多個角色，有效權限為所有角色的聯集 (Union)。
角色變更立即生效，無需重新登入。


現代化實作要求

Store 設計：使用 signalStore 維護 Map<Role, Permission[]> 結構。
權限檢查：使用 computed signal 而非每次呼叫函數 (canEdit = computed(...))。
事件發布：角色或權限變更必須發布 PermissionChanged / RoleUpdated 事件。
禁止事項

禁止：將「我是誰」的判斷混入此模組 (那是 Identity 的職責)。
禁止：在 Component 中直接操作權限資料，必須透過 Store。
禁止：跨 Workspace 共享權限資料。
2. 文件模組 (DocumentsModule)核心職責

職責：Workspace 檔案資產管理，包含檔案樹結構與資料夾組織。
邊界：僅處理檔案的 CRUD 與組織，不涉及檔案內容的業務邏輯。
功能需求2.1 檔案樹 (File Tree)

資料結構：

使用樹狀結構儲存檔案與資料夾關係。
每個節點包含：id, name, type (file/folder), parentId, children, metadata。
支援最大深度限制 (建議 10 層)，防止過深層級。



UI 呈現：

使用 mat-tree 或自訂樹狀元件呈現檔案樹。
支援展開/收合資料夾，記住展開狀態。
支援拖曳移動檔案/資料夾 (使用 CDK Drag & Drop)。
支援多選操作 (Ctrl+Click, Shift+Click)。



互動設計：

右鍵選單 (Context Menu)：新增資料夾、重新命名、刪除、移動、複製連結。
麵包屑導航 (Breadcrumb)：顯示當前路徑，支援快速跳轉。
雙擊檔案：預覽或下載 (依檔案類型)。
檔案圖示：依副檔名顯示不同圖示 (PDF, DOCX, XLSX, JPG 等)。


2.2 新增資料夾 (Create Folder)

操作流程：

使用者點擊「新增資料夾」按鈕或右鍵選單。
彈出 Dialog 輸入資料夾名稱。
驗證名稱：不可為空、不可重複 (同層級)、不可包含特殊字元 (/ \ : * ? " < > |)。
建立資料夾並更新樹狀結構。



預設行為：

新資料夾預設在當前選中的節點下建立。
若未選中任何節點，則在根目錄建立。
建立後自動選中新資料夾並展開父節點。



事件發布：成功建立後發布 FolderCreated 事件。
2.3 檔案上傳 (File Upload)

上傳方式：

支援拖曳上傳 (Drag & Drop)：拖曳到樹狀結構或指定區域。
支援點擊上傳 (File Input)：點擊按鈕選擇檔案。
支援批次上傳 (Multiple Files)：一次選擇多個檔案。
支援資料夾上傳 (Folder Upload)：保留資料夾結構。



上傳進度：

使用 Signal 追蹤上傳進度：uploadProgress = signal(0)。
使用 mat-progress-bar 顯示進度。
支援暫停/恢復上傳 (Optional)。
支援取消上傳。



檔案驗證：

檢查檔案大小 (預設限制 100MB，可在設定中調整)。
檢查檔案類型 (允許清單：PDF, DOCX, XLSX, PPTX, JPG, PNG, GIF, ZIP 等)。
檢查檔案名稱：不可包含特殊字元。
檢查重複：同名檔案提示覆蓋或重新命名。



上傳完成：

自動刷新檔案樹。
顯示上傳成功通知。
發布 DocumentUploaded 事件。


2.4 檔案列表與搜尋

虛擬滾動 (Virtual Scroll)：

使用 cdk-virtual-scroll-viewport 處理大量檔案列表。
僅渲染可見區域的檔案項目。
支援動態項目高度。



搜尋功能：

支援檔案名稱全文搜尋。
支援標籤搜尋 (Optional)。
支援進階篩選：檔案類型、上傳日期、上傳者、大小範圍。
使用 computed signal 過濾檔案列表，無需重新請求 API。



排序功能：

支援多欄位排序：名稱、大小、修改日期、上傳者。
支援升序/降序切換。
記住使用者的排序偏好。


2.5 檔案預覽與下載

預覽支援：

圖片：直接在 Dialog 中顯示。
PDF：使用 PDF Viewer 元件顯示。
文字檔案：直接顯示內容。
其他類型：顯示檔案資訊，提供下載按鈕。



下載功能：

單檔下載：直接下載檔案。
批次下載：打包為 ZIP 下載。
資料夾下載：遞迴打包所有子檔案與資料夾。


現代化實作要求

Store 設計：使用 signalStore 維護檔案樹狀態。
上傳進度封裝：上傳進度必須封裝為 Signal。
延遲載入：檔案預覽元件使用 @defer (on interaction) 延遲載入。
禁止事項

禁止：在 Component 中直接操作 Storage SDK (如 Firebase Storage)。
禁止：在 Component 中處理檔案上傳邏輯，必須委派給 Use Case。
禁止：跨 Workspace 存取檔案。
3. 任務模組 (TasksModule)核心職責

職責：核心任務與專案管理，支援單價/數量/進度/指派、無限拆分子任務、狀態流轉。
邊界：作為工作流的發起點，響應 QC/Acceptance 的回饋，但不直接修改其他模組狀態。
功能需求3.1 單一狀態來源 (Single Source of Truth) + 派生視圖

核心原則：

所有任務僅存在一份 Canonical State (TaskAggregate / TaskStore)。
所有視圖 (List, Gantt, Kanban, Calendar) 都是對該狀態的投影。
切換視圖時禁止重新打 API，僅改變 viewMode signal 與 computed filter。



視圖類型：

List View：清單視圖，支援排序、篩選、分組。
Gantt View：甘特圖，顯示任務時間軸與依賴關係。
Kanban View：看板視圖，依狀態分欄顯示。
Calendar View：行事曆視圖，顯示任務到期日 (由 CalendarModule 提供)。



視圖切換：

使用 viewMode signal 控制當前視圖。
使用 computed signal 計算視圖所需的資料結構。
視圖元件使用 @if 條件渲染。



零重新獲取 (Zero Refetch)：

切換視圖時不重新請求 API。
所有視圖共用同一份資料來源。
資料變更時，所有視圖自動同步更新。


3.2 任務屬性：單價/數量/進度/指派

任務基本屬性：

標題 (title)：必填，長度 3-200 字元。
描述 (description)：選填，支援 Markdown 格式。
單價 (unitPrice)：使用 Money Value Object，支援多幣別。
數量 (quantity)：正整數或小數，支援單位 (件、小時、平方米等)。
總價 (totalPrice)：自動計算 = unitPrice × quantity。
進度 (progress)：百分比 0-100，支援手動調整或自動計算。
狀態 (status)：Draft, InProgress, ReadyForQC, QCPassed, ReadyForAcceptance, Accepted, Completed, Blocked。
優先級 (priority)：Low, Medium, High, Urgent。
到期日 (dueDate)：選填，支援日期時間選擇器。



指派管理：

支援多人指派 (assignees: UserId[])。
支援指派負責人 (owner: UserId)。
支援指派協作者 (collaborators: UserId[])。
指派變更必須發布 TaskAssigneeChanged 事件。



進度計算：

葉節點任務：由使用者手動更新進度。
父任務：自動計算子任務的加權平均進度 (依總價權重)。
公式：parentProgress = Σ(childProgress × childTotalPrice) / Σ(childTotalPrice)。
進度更新立即反映在所有視圖。



總價約束：

父任務的總價 = 所有子任務總價之和。
當子任務總價超過父任務總價時，顯示警告並禁止提交。
UI 提示：「子任務總價 (XXX) 超過父任務總價 (YYY)，請調整。」
支援自動分配：依子任務數量平均分配父任務總價。


3.3 無限拆分子任務 (Infinite Task Hierarchy)

樹狀結構：

使用 Parent-Child 關係建立任務樹。
支援無限層級的子任務拆分 (建議最大深度 10 層)。
每個子任務都是完整的 Task Entity，擁有自己的屬性。



拆分操作：

使用者在任務詳情頁點擊「新增子任務」。
子任務繼承父任務的部分屬性 (如 assignees, priority)。
子任務的總價總和不可超過父任務的總價。
支援批次建立子任務 (範本模式)。



視覺呈現：

使用 mat-tree 或自訂樹狀元件呈現任務層級。
支援展開/收合子任務，記住展開狀態。
使用縮排表示層級關係。
父任務顯示子任務數量與完成度摘要。



層級操作：

支援拖曳調整層級 (提升/降級任務)。
支援移動任務到其他父任務下。
支援轉換為獨立任務 (脫離父任務)。


3.4 狀態流轉與模組整合

任務生命週期：

Draft → InProgress → ReadyForQC → (QCPassed) → ReadyForAcceptance → (Accepted) → Completed
任何階段可能因失敗流轉到 Blocked 狀態。



流轉規則：

進度達到 100% 時，自動流轉到 ReadyForQC 狀態。
ReadyForQC 狀態的任務自動出現在質檢模組的待辦清單。
QCPassed 狀態的任務自動流轉到 ReadyForAcceptance。
Accepted 狀態的任務自動流轉到 Completed。



與質檢模組整合：

任務完成 (100%) 時，發布 TaskReadyForQC 事件。
質檢模組訂閱此事件，建立質檢項目。
質檢通過時，任務接收 QCPassed 事件，更新狀態。
質檢失敗時，任務接收 QCFailed 事件，流轉到 Blocked 狀態。



與驗收模組整合：

QC 通過後，任務發布 TaskReadyForAcceptance 事件。
驗收模組訂閱此事件，建立驗收項目。
驗收通過時，任務接收 AcceptanceApproved 事件，流轉到 Completed。
驗收失敗時，任務接收 AcceptanceRejected 事件，流轉到 Blocked 狀態。



與問題單模組整合：

任何任務可建立關聯的問題單 (Issue)。
任務狀態為 Blocked 時，必須關聯至少一個未解決的問題單。
所有關聯問題單解決後，任務自動解除 Blocked 狀態。
使用者可手動建立問題單，或由系統自動建立 (QC/驗收失敗時)。


3.5 提交任務完成數量時自動發布每日紀錄

自動記錄邏輯：

使用者更新任務進度或完成數量時，自動觸發每日紀錄建立。
每日紀錄包含：任務 ID、完成數量、工作日期、工作者 ID。
若當日已有該任務的記錄，則累加數量而非建立新記錄。



事件發布：

任務進度更新時，發布 TaskProgressUpdated 事件。
DailyModule 訂閱此事件，自動建立或更新每日紀錄。
完成後發布 DailyEntryCreated 事件。



使用者控制：

提供「自動記錄」開關，使用者可選擇關閉此功能。
關閉時，使用者需手動到 DailyModule 建立記錄。


現代化實作要求

Store 設計：使用 signalStore 維護 Map<TaskId, Task> 結構。
視圖投影：所有視圖使用 computed signal 從同一份資料投影。
拖曳操作：使用 CDK Drag & Drop，拖曳結束時僅 Patch State，由 Store Effect 處理 API。
Gantt Chart：使用純 CSS Grid 或 SVG 繪製，避免重型第三方庫。
禁止事項

禁止：TasksModule 直接修改 Permissions/Issues 狀態，跨模組效果必須透過 Event Bus。
禁止：在 Component 中直接操作 Task Entity，必須透過 Store。
禁止：視圖切換時重新請求 API。
4. 每日紀錄模組 (DailyModule)核心職責

職責：個人工作日誌 (Worklog)，記錄每日工作內容與工時。
特性：傳統產業使用，不按時數計算，只按人工/日計數。
功能需求4.1 傳統產業工時計算

計數方式：

不記錄具體工作時數 (小時)。
僅記錄人工/日 (Man-Day)。
例如：1 人工作 1 天 = 1 人工/日，0.5 人工作 1 天 = 0.5 人工/日。



記錄單位：

支援全日 (1.0)、半日 (0.5)、四分之一日 (0.25) 等預設選項。
支援自訂數值 (0.1 ~ 1.0)。
一個人一天的總人工/日不可超過 1.0。



工作內容：

必須關聯到具體任務 (Task)。
記錄工作描述 (選填)。
記錄完成數量 (與任務進度同步)。


4.2 快速填寫介面

今日活躍任務：

自動列出使用者今日參與的所有任務。
支援快速選擇任務並填寫人工/日。
支援批次提交。



歷史記錄：

顯示過去 7 天的工作記錄。
支援複製昨日記錄到今日 (快速填寫)。
支援修改歷史記錄 (僅限本週)。



統計資訊：

顯示本週累計人工/日。
顯示本月累計人工/日。
顯示各任務的人工/日分佈 (圓餅圖)。


4.3 自動記錄與手動記錄

自動記錄：

當任務進度更新時，自動建立每日紀錄。
自動計算人工/日 (依進度變化比例)。
使用者可調整自動產生的記錄。



手動記錄：

使用者可手動新增任何任務的工作記錄。
支援補登過去的記錄 (限定時間範圍，如過去 30 天)。



記錄驗證：

同一天同一任務不可重複記錄，僅能累加。
一天的總人工/日不可超過 1.0。
任務已完成後，不可再記錄人工/日。


4.4 團隊工時統計

團隊視圖：

主管可查看團隊成員的每日紀錄。
支援依成員、依任務、依日期篩選。
支援匯出為 Excel / CSV。



統計圖表：

團隊本週人工/日趨勢圖 (折線圖)。
各任務人工/日分佈 (長條圖)。
各成員人工/日比較 (雷達圖)。


現代化實作要求

Store 設計：使用 signalStore 維護每日紀錄 Map<Date, DailyEntry[]>。
自動計算：提交時自動計算工時並發布統計事件。
快速填寫：使用 computed signal 自動關聯當日活躍 Task。
禁止事項

禁止：記錄超過 1.0 人工/日。
禁止：跨 Workspace 查看或修改記錄。
禁止：在 Component 中直接計算統計資料，必須使用 computed signal。
5. 質檢模組 (QualityControlModule)核心職責

職責：任務產出物的品質驗證關卡。
邊界：僅處理 QC 流程，不涉及最終驗收 (由 AcceptanceModule 負責)。
功能需求5.1 質檢項目管理

項目來源：

任務進度達到 100% 時，自動建立質檢項目。
系統自動訂閱 TaskReadyForQC 事件，建立 QC 項目。



項目屬性：

關聯任務 ID。
質檢人員 (QC Inspector)。
質檢標準 (Checklist)。
質檢狀態：Pending, InProgress, Passed, Failed。
質檢日期。
質檢備註。



質檢清單 (Checklist)：

支援預設範本 (依任務類型)。
支援自訂檢查項目。
每個項目包含：名稱、描述、是否必檢、檢查結果 (Pass/Fail)。
所有必檢項目通過才能標記為 Passed。


5.2 質檢流程

開始質檢：

質檢人員從待辦清單選擇項目。
系統顯示任務快照 (Snapshot)：任務標題、描述、完成數量、附件等。
質檢人員依 Checklist 逐項檢查。



質檢通過：

所有必檢項目標記為 Pass。
質檢人員點擊「通過」按鈕。
系統發布 QCPassed 事件。
任務狀態自動流轉到 ReadyForAcceptance。



質檢不通過：

至少一個必檢項目標記為 Fail。
質檢人員必須填寫「缺失原因」(強制欄位)。
系統自動建立問題單 (Issue)，關聯到該任務。
系統發布 QCFailed 事件。
任務狀態流轉到 Blocked。


5.3 質檢不通過流轉到問題單

自動建立問題單：

質檢失敗時，系統自動建立問題單。
問題單標題：「[QC 失敗] {任務標題}」。
問題單描述：自動填入缺失原因與失敗的檢查項目。
問題單類型：Defect。
問題單優先級：依任務優先級自動設定。
問題單指派：自動指派給任務負責人。



問題單關聯：

問題單與任務建立雙向關聯。
任務詳情頁顯示關聯的問題單列表。
問題單詳情頁顯示關聯的任務資訊。



解除封鎖：

問題單解決後，質檢人員可重新開始質檢。
所有質檢項目需重新檢查。


5.4 質檢歷史與追蹤

質檢記錄：

保留所有質檢歷史記錄。
顯示質檢時間、質檢人員、質檢結果、缺失原因。
支援查詢任務的所有質檢記錄。



質檢統計：

質檢通過率 (Pass Rate)。
平均質檢時間。
常見缺失類型統計。
質檢人員工作量統計。


現代化實作要求

Store 設計：使用 signalStore 維護 QC 項目 Map<QCId, QCItem>。
快照呈現：介面應呈現 Task 的 Snapshot (快照) 供對照。
強制輸入：駁回時必須強制填寫「缺失原因」，並結構化紀錄。
禁止事項

禁止：直接修改任務狀態，必須透過事件。
禁止：跨 Workspace 存取質檢項目。
禁止：繞過 Checklist 強制檢查。
6. 驗收模組 (AcceptanceModule)核心職責

職責：最終交付物的商業驗收。
邊界：僅接收已通過 QC 的項目，不涉及技術品質檢查。
功能需求6.1 驗收項目管理

項目來源：

僅接收狀態為 ReadyForAcceptance 的任務。
系統自動訂閱 TaskReadyForAcceptance 事件，建立驗收項目。



項目屬性：

關聯任務 ID。
驗收人員 (通常為客戶或專案經理)。
驗收標準 (Acceptance Criteria)。
驗收狀態：Pending, InProgress, Approved, Rejected。
驗收日期。
驗收備註。


6.2 驗收標準清單

交付標準：

強調「交付標準」的核對清單 (Checklist) UI。
支援預設範本 (依專案類型)。
每個項目包含：標準描述、驗收方法、是否必檢、檢查結果。



驗收文件：

支援上傳驗收相關文件 (如測試報告、使用手冊等)。
支援查看任務的所有附件與產出物。


6.3 驗收流程

開始驗收：

驗收人員從待辦清單選擇項目。
系統顯示任務完整資訊與交付物。
驗收人員依 Acceptance Criteria 逐項檢查。



驗收通過：

所有必檢標準滿足。
驗收人員點擊「通過」按鈕。
系統發布 AcceptanceApproved 事件。
任務狀態自動流轉到 Completed。
觸發完成通知與統計更新。



驗收不通過：

至少一個標準未滿足。
驗收人員必須填寫「拒絕原因」(強制欄位)。
系統自動建立問題單 (Issue)，關聯到該任務。
系統發布 AcceptanceRejected 事件。
任務狀態流轉到 Blocked。


6.4 驗收不通過流轉到問題單

自動建立問題單：

驗收失敗時，系統自動建立問題單。
問題單標題：「[驗收失敗] {任務標題}」。
問題單描述：自動填入拒絕原因與未滿足的標準。
問題單類型：Requirement Change / Defect。
問題單優先級：依任務優先級自動設定。
問題單指派：自動指派給任務負責人。



重新驗收：

問題單解決後，任務重新流經 QC → Acceptance 流程。
驗收人員可查看問題單的處理記錄。


6.5 驗收歷史與追蹤

驗收記錄：

保留所有驗收歷史記錄。
顯示驗收時間、驗收人員、驗收結果、拒絕原因。



驗收統計：

驗收通過率 (Approval Rate)。
平均驗收時間。
常見拒絕原因統計。


現代化實作要求

Store 設計：使用 signalStore 維護驗收項目 Map<AcceptanceId, AcceptanceItem>。
流轉規則：僅接收已通過 QC 的項目。
強制輸入：拒絕時必須填寫原因。
禁止事項

禁止：接收未通過 QC 的任務。
禁止：直接修改任務狀態，必須透過事件。
禁止：繞過 Acceptance Criteria 強制檢查。
7. 問題單模組 (IssuesModule)核心職責

職責：異常與缺失追蹤 (Defect Tracking)，管理所有工作流中的問題。
邊界：追蹤問題的生命週期，與任務狀態掛鉤，確保閉環。
功能需求7.1 問題單建立

建立來源：

自動建立：QC 失敗 / 驗收失敗時系統自動建立。
手動建立：使用者在任務頁面或問題單模組手動建立。



問題單屬性：

標題 (title)：必填。
描述 (description)：必填，支援 Markdown。
類型 (type)：Defect (缺陷)、Bug (錯誤)、Requirement Change (需求變更)、Question (疑問)。
優先級 (priority)：Low, Medium, High, Critical。
狀態 (status)：Open, InProgress, Resolved, Closed, Reopened。
關聯任務 (relatedTaskId)：必填。
指派人員 (assignee)：必填。
報告者 (reporter)：自動填入建立者。
建立時間、更新時間。



附件與截圖：

支援上傳附件 (截圖、日誌等)。
支援貼上截圖 (Clipboard)。


7.2 問題單生命週期

狀態流轉：

Open → InProgress → Resolved → Closed
任何階段可 Reopen (重新開啟)。



處理流程：

Open：問題單剛建立，待處理。
InProgress：指派人員開始處理。
Resolved：問題已解決，等待驗證。
Closed：問題已驗證關閉，不可再修改 (除非 Reopen)。
Reopened：問題驗證未通過，重新開啟。



關聯任務封鎖：

問題單為 Open / InProgress 時，關聯任務狀態為 Blocked。
問題單 Resolved 時，通知任務負責人驗證。
問題單 Closed 時，檢查是否所有關聯問題單都已關閉：

若是，任務自動解除 Blocked 狀態，回到上一個流程 (ReadyForQC 或 ReadyForAcceptance)。
若否，任務繼續保持 Blocked。




7.3 問題單根據處理狀態流轉到模組完成閉環

閉環邏輯：

QC 失敗產生的問題單 → 解決後 → 任務回到 ReadyForQC → 重新質檢。
驗收失敗產生的問題單 → 解決後 → 任務回到 ReadyForAcceptance → 重新驗收。
手動建立的問題單 → 解決後 → 任務繼續原流程。



自動解鎖：

當所有關聯問題單解決後，系統自動提示任務可重新提交。
發布 IssueResolved 事件，任務模組訂閱並更新狀態。



防止遺漏：

任務完成前，系統檢查是否有未關閉的問題單。
若有，禁止標記任務為 Completed，強制先關閉問題單。


7.4 問題單列表與篩選

列表視圖：

顯示所有問題單，支援排序、篩選、分組。
預設依建立時間降序排列。



篩選條件：

依狀態篩選 (Open, InProgress, Resolved, Closed)。
依類型篩選 (Defect, Bug, Requirement Change)。
依優先級篩選 (Low, Medium, High, Critical)。
依指派人員篩選。
依關聯任務篩選。



快速操作：

批次指派。
批次關閉。
批次匯出。


7.5 問題單統計與報表

統計指標：

問題單總數 / 開啟數 / 解決數 / 關閉數。
平均解決時間 (Mean Time To Resolve, MTTR)。
問題單類型分佈 (圓餅圖)。
問題單優先級分佈 (長條圖)。
問題單趨勢 (折線圖：每週新增 vs 解決數量)。



報表匯出：

支援匯出為 Excel / CSV / PDF。
包含問題單詳情、處理記錄、統計圖表。


現代化實作要求

Store 設計：使用 signalStore 維護問題單 Map<IssueId, Issue>。
閉環邏輯：Issue 的生命週期必須與 Task 狀態掛鉤 (Blocking 關係)。
自動化：接收到 QCFailed / AcceptanceRejected 事件時，自動預填 Issue Title 與 Context。
禁止事項

禁止：直接修改任務狀態，必須透過事件。
禁止：關閉問題單時未驗證問題是否真正解決。
禁止：遺漏未關閉問題單而完成任務。
8. 總覽模組 (OverviewModule)核心職責

職責：Workspace 核心指標與活動儀表板，顯示各項數據、負責人、詳細內容。
邊界：僅負責資料聚合與視覺化，不涉及具體業務邏輯。
功能需求8.1 核心指標儀表板

關鍵指標 (KPIs)：

任務總數 / 進行中 / 已完成 / 已封鎖。
問題單總數 / 開啟 / 已解決。
質檢通過率 / 驗收通過率。
本週完成任務數 / 本月完成任務數。
團隊成員總數 / 活躍成員數。
文件總數 / 本週新增文件數。



Widget 設計：

使用卡片 (Cards) 呈現各指標。
支援點擊卡片跳轉到詳細模組。
支援自訂 Widget 排列順序 (拖曳調整)。
支援隱藏/顯示特定 Widget。


8.2 活動時間軸

最近活動：

顯示 Workspace 內的最近活動 (最近 50 條)。
活動類型：任務建立、任務完成、問題單建立、文件上傳、成員加入等。
每條活動包含：時間、操作者、操作類型、操作對象、描述。



篩選與搜尋：

依活動類型篩選。
依操作者篩選。
依時間範圍篩選 (今日、本週、本月、自訂)。
支援關鍵字搜尋。


8.3 負責人視圖

任務負責人：

顯示各任務的負責人與進度。
支援依負責人分組顯示。
顯示負責人的工作負載 (任務數量、總工時)。



團隊視圖：

顯示團隊成員列表與角色。
顯示每個成員的活躍度 (最近操作時間)。
顯示每個成員的貢獻度 (完成任務數、提交記錄數)。


8.4 圖表與視覺化

任務進度圖表：

燃盡圖 (Burndown Chart)：顯示任務剩餘數量趨勢。
燃起圖 (Burnup Chart)：顯示任務完成數量累積。
甘特圖摘要：顯示重要任務的時間軸。



問題單趨勢圖：

折線圖：每週新增 vs 解決問題單數量。
圓餅圖：問題單類型分佈。



團隊工作量圖：

長條圖：各成員本週完成任務數。
雷達圖：各成員在不同模組的活躍度。


8.5 響應式佈局

Widget 模式：

使用 Grid Layout 排列 Widget。
支援響應式設計：桌面 (3 欄)、平板 (2 欄)、手機 (1 欄)。
支援拖曳調整 Widget 位置與大小。



個人化設定：

使用者可自訂要顯示的 Widget。
使用者可自訂 Widget 的順序與大小。
設定儲存在使用者偏好中，跨裝置同步。


現代化實作要求

Store 設計：聚合各模組關鍵資訊 (Key Metrics)。
Widget 模式：支援響應式佈局。
事件訂閱：訂閱所有模組的關鍵事件，即時更新儀表板。
禁止事項

禁止：重複請求 API，應訂閱原模組的 Store 或使用 Selector。
禁止：在 OverviewModule 中實作業務邏輯，僅負責資料聚合與視覺化。
禁止：直接修改其他模組的狀態。
9. 成員模組 (MembersModule)核心職責

職責：團隊成員管理與角色分配。
特性：建立工作區時自動將建立人加入，避免成員列表為空。
功能需求9.1 成員列表管理

成員屬性：

使用者 ID (userId)。
使用者名稱 (displayName)。
電子郵件 (email)。
角色 (roles: RoleId[])：支援多角色。
加入時間 (joinedAt)。
最後活躍時間 (lastActiveAt)。
狀態 (status)：Active, Inactive, Suspended。



成員列表視圖：

顯示所有成員，支援排序、篩選。
支援依角色篩選。
支援依狀態篩選 (Active, Inactive)。
支援搜尋成員 (名稱、電子郵件)。


9.2 建立工作區時自動加入建立人

自動加入邏輯：

建立 Workspace 時，系統自動將建立人加入成員列表。
建立人預設角色為 Owner。
確保成員列表不為空，避免無人管理的 Workspace。



初始化流程：

CreateWorkspaceUseCase 執行時，同時建立 Workspace 與加入建立人。
發布 WorkspaceCreated 與 MemberAdded 事件。


9.3 邀請成員

邀請方式：

透過電子郵件邀請。
透過邀請連結 (Invite Link)。
透過使用者名稱搜尋並邀請。



邀請流程：

管理員輸入邀請對象的電子郵件或選擇使用者。
選擇要授予的角色 (可多選)。
系統發送邀請通知 (Email / In-App Notification)。
受邀者接受邀請後，自動加入成員列表。
發布 MemberInvited 事件。



邀請管理：

顯示待處理的邀請列表。
支援撤銷邀請。
支援重新發送邀請。
邀請有效期 (預設 7 天)。


9.4 移除成員

移除條件：

僅 Owner 和 Admin 可移除成員。
不可移除自己。
不可移除最後一個 Owner (確保 Workspace 有管理者)。



移除流程：

管理員選擇要移除的成員。
系統提示確認 (顯示成員資訊與影響)。
確認後，移除成員並發布 MemberRemoved 事件。
成員的任務指派與權限自動清除。



移除影響：

成員無法再存取該 Workspace。
成員的歷史記錄與貢獻保留 (如任務建立者、問題單報告者)。
成員的任務指派需重新分配 (系統提示)。


9.5 角色分配與變更

角色分配：

支援為成員分配多個角色。
支援批次分配角色 (選擇多個成員，統一授予角色)。
角色變更立即生效，無需重新登入。



角色變更流程：

管理員選擇成員，編輯其角色。
系統驗證權限 (是否有權限變更該角色)。
確認後，更新成員角色並發布 MemberRoleChanged 事件。
PermissionsModule 訂閱此事件，更新權限快取。


9.6 成員活躍度與統計

活躍度追蹤：

記錄成員的最後活躍時間。
記錄成員的操作次數 (任務建立、問題單提交等)。



成員統計：

顯示成員的任務完成數、問題單解決數、文件上傳數。
顯示成員的貢獻度排行榜。


現代化實作要求

Store 設計：使用 signalStore 維護成員 Map<UserId, Member>。
事件發布：邀請/移除成員必須發布 MemberUpdated 事件。
連動更新：變更角色時需連動 PermissionsModule 的檢查邏輯。
禁止事項

禁止：移除最後一個 Owner。
禁止：成員列表為空的 Workspace。
禁止：跨 Workspace 操作成員。
10. 稽核模組 (AuditModule)核心職責

職責：系統操作與安全日誌 (Audit Log)，記錄所有重要操作。
特性：唯讀 (Read-Only) 呈現，確保日誌不可篡改。
功能需求10.1 操作記錄

記錄範圍：

所有模組的關鍵操作 (CRUD)。
權限變更、角色分配。
成員邀請、移除。
任務狀態流轉。
問題單建立、解決。
文件上傳、刪除。
設定變更。



記錄屬性：

操作 ID (auditId)：唯一識別碼。
操作時間 (timestamp)：精確到毫秒。
操作者 (userId)：執行操作的使用者。
操作類型 (action)：Create, Update, Delete, View, Export 等。
操作對象 (entityType & entityId)：被操作的資源類型與 ID。
操作模組 (module)：Tasks, Issues, Documents 等。
操作詳情 (details)：JSON 格式的詳細資訊 (變更前後的值)。
IP 位址 (ipAddress)：操作者的 IP 位址。
使用者代理 (userAgent)：瀏覽器資訊。


10.2 唯讀呈現

唯讀特性：

稽核日誌一旦建立，不可修改或刪除。
使用 append-only 模式儲存。
定期備份日誌資料。



存取權限：

僅 Owner 和 Admin 可查看完整稽核日誌。
一般成員僅可查看自己的操作記錄。
敏感操作 (如權限變更) 需特殊權限查看。


10.3 多維度篩選

篩選條件：

依時間範圍篩選 (今日、本週、本月、自訂)。
依操作者篩選 (選擇成員)。
依模組篩選 (Tasks, Issues, Documents 等)。
依操作類型篩選 (Create, Update, Delete 等)。
依操作對象篩選 (特定任務、特定文件等)。



搜尋功能：

支援關鍵字搜尋 (在操作詳情中搜尋)。
支援進階搜尋 (組合多個條件)。


10.4 日誌視覺化

時間軸視圖：

以時間軸方式呈現操作記錄。
支援展開/收合詳細資訊。



統計圖表：

操作次數趨勢圖 (折線圖)。
各模組操作分佈 (圓餅圖)。
各操作類型分佈 (長條圖)。
各成員操作次數排行 (橫向長條圖)。


10.5 日誌匯出與備份

匯出功能：

支援匯出為 Excel / CSV / JSON。
支援自訂匯出欄位。
支援匯出篩選後的結果。



備份策略：

定期自動備份稽核日誌 (每日/每週)。
備份儲存在獨立的儲存空間。
支援手動觸發備份。


10.6 異常偵測

異常行為偵測：

短時間內大量操作 (可能是惡意行為)。
非工作時間的操作 (可能是異常存取)。
刪除大量資料 (可能是誤操作或惡意破壞)。



警報機制：

偵測到異常行為時，發送警報通知管理員。
記錄異常事件，標記為高優先級。


現代化實作要求

Store 設計：使用 signalStore 維護稽核日誌 (Read-Only)。
事件訂閱：訂閱所有模組的操作事件，自動記錄。
篩選與搜尋：使用 computed signal 進行多維度篩選。
禁止事項

禁止：修改或刪除稽核日誌。
禁止：繞過稽核記錄執行敏感操作。
禁止：跨 Workspace 存取稽核日誌。
11. 行事曆模組 (CalendarModule)核心職責

職責：以時間維度檢視任務與工作日誌。
階段目標：先做出基礎功能，未來擴展。
功能需求 (基礎版)11.1 任務行事曆

資料來源：

聚合 TasksModule 的到期日資料。
不重新 fetch 資料，訂閱 TasksModule 的 Store。



視圖類型：

月視圖 (Month View)：顯示整月的任務分佈。
週視圖 (Week View)：顯示一週的任務時間軸。
日視圖 (Day View)：顯示單日的任務詳細時間。



任務呈現：

依到期日顯示任務。
任務卡片顯示：標題、狀態、優先級。
支援點擊任務卡片查看詳情。
支援拖曳調整任務到期日。


11.2 工作日誌行事曆

資料來源：

聚合 DailyModule 的工時紀錄。
不重新 fetch 資料，訂閱 DailyModule 的 Store。



視圖呈現：

顯示每日的工作記錄。
顯示每日的人工/日統計。
支援快速新增工作記錄 (點擊日期)。


11.3 基礎互動

導航控制：

支援切換月份 (上一月、下一月、今日)。
支援快速跳轉到特定日期。



篩選功能：

依任務狀態篩選 (僅顯示特定狀態的任務)。
依任務優先級篩選。
依指派人員篩選 (僅顯示自己的任務)。


11.4 未來擴展方向

會議整合：整合會議行事曆 (Google Calendar, Outlook)。
里程碑標記：標記重要日期與里程碑。
假日顯示：顯示國定假日與公司休假日。
提醒功能：任務到期前自動提醒。
現代化實作要求

Store 設計：聚合 TasksModule 與 DailyModule 的資料。
訂閱模式：訂閱原模組的 Store，禁止重新 fetch 資料。
視圖切換：使用 computed signal 計算不同視圖的資料。
禁止事項

禁止：重新 fetch 資料，應訂閱原模組的 Store。
禁止：在 CalendarModule 中實作業務邏輯，僅負責資料聚合與視覺化。
12. 設定模組 (SettingsModule)核心職責

職責：管理 Workspace 及模組的全域設定。
階段目標：先做出基礎功能，未來擴展。
功能需求 (基礎版)12.1 Workspace 基本設定

Workspace 資訊：

Workspace 名稱 (可編輯)。
Workspace 描述 (可編輯)。
Workspace 圖示 (可上傳)。
Workspace 建立時間 (唯讀)。
Workspace 建立者 (唯讀)。



設定項目：

時區設定。
語言設定 (中文、英文等)。
日期格式 (YYYY-MM-DD, DD/MM/YYYY 等)。
貨幣設定 (用於任務單價)。


12.2 模組啟用/停用

模組管理：

顯示所有可用模組列表。
支援啟用/停用特定模組。
停用的模組在導航列中隱藏。



預設啟用模組：

Tasks, Members, Overview 預設啟用，不可停用。
其他模組可自由啟用/停用。


12.3 通知設定

通知類型：

任務指派通知。
任務到期提醒。
問題單建立通知。
質檢/驗收結果通知。



通知方式：

Email 通知。
In-App 通知。
支援為每種通知類型選擇通知方式。


12.4 設定變更事件

即時更新：

設定變更必須發布 SettingsChanged 事件。
相關模組訂閱此事件，調整行為 (如時區變更後重新計算時間顯示)。



版本控制：

記錄設定變更歷史。
支援回滾到先前的設定版本 (Optional)。


12.5 未來擴展方向

主題設定：支援深色模式、淺色模式、自訂主題色。
權限範本：預設的角色權限範本管理。
整合設定：第三方服務整合 (Google Drive, Slack, Jira 等)。
自動化規則：自訂工作流自動化規則 (如任務自動指派)。
現代化實作要求

Store 設計：使用 signalStore 維護設定 Map<SettingKey, SettingValue>。
即時更新：設定變更必須發布事件，通知相關模組調整行為。
統一介面：提供統一的設定介面，支援即時更新與版本控制。
禁止事項

禁止：未發布事件就變更設定 (其他模組無法同步)。
禁止：跨 Workspace 共享設定。
禁止：在 Component 中直接修改設定，必須透過 Store。
三、狀態流轉與回饋迴圈 (State Flow & Feedback Loop)為了確保流程閉環且無死結，必須遵循以下流轉原則：1. 正向流 (Forward Flow)

User Action → TasksModule → QualityControlModule → AcceptanceModule → Done

原則：下游模組的啟動必須由上游模組的 Success Event 觸發，嚴禁手動跨越流程。
觸發事件：

Task 100% → TaskReadyForQC → QC 建立
QC Passed → QCPassed → Acceptance 建立
Acceptance Approved → AcceptanceApproved → Task Completed


2. 負向流 (Negative/Rejection Flow)

QC/Acceptance Fail → IssuesModule + TasksModule (Rework)

即時性：失敗事件發生時，UI 應立即透過 Signal Effect 顯示通知，並將 Task 標記為 Blocked。
觸發事件：

QC Failed → QCFailed → Issue 建立 + Task Blocked
Acceptance Rejected → AcceptanceRejected → Issue 建立 + Task Blocked


3. 重啟流 (Restart Flow)

Issue Resolved → TasksModule (Ready)

自動解鎖：當所有關聯 Issue 解決後，系統應自動提示 Task 可重新提交，而非等待人工檢查。
觸發事件：

Issue Resolved → IssueResolved → Task 解除 Blocked
Task 回到上一個流程 (ReadyForQC 或 ReadyForAcceptance)


4. 閉環檢查

完成前檢查：Task 標記為 Completed 前，系統檢查：

是否所有關聯 Issue 已關閉。
是否通過 QC 與 Acceptance。
是否有未完成的子任務。


防止遺漏：若檢查未通過，禁止完成並提示使用者。
四、UI/UX 系統與設計規範 (UI/UX System & Design Specifications)1. 設計系統基礎 (Design System Foundation)

框架：嚴格使用 Angular Material (M3) + Tailwind CSS (Utility-first)。
一致性 (Consistency)：

所有卡片 (Cards) 使用統一的 mat-card Elevation 與 Padding。
所有按鈕遵循主/次/警告 (Primary/Secondary/Warn) 語意分級。
所有 Dialog 使用統一的 Header-Content-Actions 佈局。
所有表單使用統一的驗證樣式與錯誤訊息。


2. 現代化模板控制流 (Modern Template Control Flow)

Built-in Control Flow: 視圖層必須全面採用 Angular 20 新版控制流語法。

使用 @if (cond) { ... } @else { ... } 取代 *ngIf。
使用 @for (item of items; track item.id) { ... } 取代 *ngFor。
使用 @switch (val) { @case (c) { ... } } 取代 [ngSwitch]。
使用 @defer (on viewport) { ... } 進行延遲載入。


強制追蹤 (Mandatory Tracking): @for 區塊必須包含 track 表達式，嚴禁隱式 index 或無 track 的寫法 (以確保 Zone-less 渲染效能)。
3. 任務視圖切換實作 (Task View Implementation)

架構模式：

Store: withState({ viewMode: 'list' | 'gantt' | 'kanban' })
Computed: visibleTasks = computed(() => filterTasks(entities(), viewMode()))


Gantt Chart：使用純 CSS Grid 或 SVG 繪製，避免引入重型第三方庫 (Occam's Razor)。
Kanban：使用 CDK Drag & Drop，拖曳結束時僅 Patch State，由 Store Effect 處理 API。
4. 權限矩陣樣式設計 (Permission Matrix Design)

呈現形式：

行 (Rows)：角色 (Roles)
列 (Columns)：資源/模組 (Resources)
單元格 (Cells)：Checkbox (mat-checkbox)


互動體驗：

必須支援 Sticky Headers (行列標題凍結)。
勾選必須是樂觀更新 (Optimistic Update)：先改 UI Signal，背景送 API，失敗再回滾。
提供「全選/全不選」的便捷操作列。


五、響應式狀態規則 (Reactive State Rules)1. 狀態管理 (State Management)

所有狀態必須使用 NgRx Signals (signalStore)。
禁止使用 BehaviorSubject 或手動 subscribe (必須 Zone-less)。
所有狀態變更必須透過 Store 的方法，不可直接修改 Signal。
2. 事件規則 (Event Rules)

Payload：禁止攜帶 Service/Function/UI Reference (必須是純資料 DTO)。
追蹤：所有事件必須包含 correlationId 以追溯某些 UI 操作導致的一系列副作用。
因果鏈：事件應包含 causationId 指向上一個事件，建立因果關係。
3. Computed Signals

使用 computed 進行資料衍生，避免重複計算。
Computed 必須是純函數，不可有副作用。
複雜的計算邏輯應拆分為多個小的 computed。
4. Effects

使用 effect 處理副作用 (如 API 呼叫、事件發布)。
Effect 應避免複雜的邏輯，保持簡單明瞭。
Effect 的依賴必須明確，避免隱式依賴。
六、工程標準與奧卡姆剃刀原則 (Engineering Standards & Occam's Razor)Copilot 生成代碼時必須遵循「如無必要，勿增實體」的原則。1. 奧卡姆剃刀 (Occam's Razor) 實踐

拒絕過度設計 (No Over-engineering)：

如果一個 Component 只有 20 行邏輯，不需要拆分出 Service。
如果一個 Store 可以直接被 Component 使用，不需要建立 Facade 層。
如果原生 HTML/CSS 能解決，不需要引入額外 Directive 或 Library。


扁平化結構：優先保持目錄扁平，直到檔案數量超過 7-10 個才考慮建立子目錄。
2. 代碼風格 (Code Style)

函數式優先：優先使用 Pure Functions 與 Composition。
提早返回 (Early Return)：減少 3 層以上的 if/else 巢狀。
命名一致性：

Store Signals: 命名為名詞 (e.g., loading, users)。
Event Handlers: 命名為動詞+名詞 (e.g., onTaskSubmit, handleResize)。


型別安全：嚴禁使用 any，所有變數與函數必須明確型別。
3. 測試覆蓋

Unit Test：測試 computed 邏輯與 pure functions。
Integration Test：測試事件流與狀態變更。
E2E Test：覆蓋關鍵業務流程 (Task Creation → QC → Acceptance → Close)。
七、事件架構實作規範 (Event Architecture Implementation Specs)1. 事件定義 (Event Definition)
所有業務事件必須實作 DomainEvent<T> 介面並採用包含 Metadata 的結構。EventMetadata 結構：

correlationId: string - 關聯 ID (全鏈路追蹤)
causationId?: string | undefined - 因果 ID (上一層 Event/Command ID)
userId?: string | undefined - 操作者 ID
timestamp: number - Unix Timestamp
version?: number - Aggregate Version
DomainEvent 結構：

eventId: string - UUID v4
eventName: string - 使用 EventType 常數 (Past Tense)
aggregateId: string - 聚合根 ID
occurredOn: Date - 發生時間
metadata: EventMetadata - 上下文元數據
payload: TPayload - 純資料
2. 事件元數據與因果追蹤 (Metadata & Causality)
所有事件必須包含完整的 EventMetadata 以支援分散式追蹤。因果追蹤規則：

起點 (Use Case)：Use Case 執行時必須生成或接收 correlationId，並透過 Command 傳遞給 Aggregate。
傳遞 (Aggregate)：Aggregate 方法必須接收 Metadata 並注入到產生的 Domain Event 中。
繼承 (Side Effect)：事件觸發的副作用 → 繼承 correlationId，causationId 指向上一個事件。
3. 事件傳遞流程

Append: eventStore.append(event) (持久化 Fact)。
Publish: eventBus.publish(event) (觸發副作用)。
React: Store 或 Effect 收到事件，更新 Read Model。
禁止事項：

❌ 禁止先發布後儲存。
❌ 禁止在 Payload 中傳遞 Entity 物件 (必須 clone 為 plain object)。
八、現代化效能與交付品質標準 (Modern Performance & Quality Standards)為了達到業界頂尖的交付品質，必須嚴格執行以下效能與體驗指標。1. 渲染性能優化 (Rendering Performance)

全面 Zone-less：應用程式必須配置為 provideExperimentalZonelessChangeDetection()，完全移除 zone.js 依賴。
延遲加載 (@defer)：

重型視圖 (Gantt, Charts, Map) 必須使用 @defer (on viewport) 包裹。
次要互動 (Comments, History) 必須使用 @defer (on interaction)。


Change Detection：所有 Component 必須設定 ChangeDetectionStrategy.OnPush。
2. 無障礙設計 (A11y Integrity)

複雜視圖鍵盤導航：

Kanban/Gantt 必須支援鍵盤 Focus 與 Arrow Key 移動。
Drag & Drop 操作必須提供鍵盤替代方案 (e.g., Action Menu "Move to...")。


語意化 HTML：禁止使用 div 模擬按鈕，必須使用 <button> 或 <a>。
Announcer：狀態變更必須透過 LiveAnnouncer 通知螢幕閱讀器。
3. Core Web Vitals 指標

LCP (Largest Contentful Paint): < 2.5s (透過 Skeleton Screen 與 Image Optimization)。
INP (Interaction to Next Paint): < 200ms (透過 Signal 異步更新與 Web Worker 處理重運算)。
CLS (Cumulative Layout Shift): < 0.1 (Skeleton 必須與實際內容等高)。
九、測試與驗證策略 (Testing & Verification Strategy)現代化響應式架構的測試重點在於「行為」與「契約」，而非實作細節。1. 測試金字塔 (Testing Strategy)

Unit Test (Signals)：

測試 computed 邏輯是否正確反映 source signal 的變化。
禁止測試 effect 的副作用 (應轉為測試 Event 發布)。


Integration Test (Events - The Contract)：

Given 初始 State → When 發出 Command → Then 驗證正確的 Event 被發佈到 EventBus。
不驗證 Private Method 或 Private State。


E2E Test (Critical Path)：

覆蓋 "Task Creation → QC → Acceptance → Close" 的完整閉環。
驗證畫面上的 Optimistic UI 是否正確回滾 (模擬 API 失敗)。


2. 測試輔助工具 (Test Utils)

使用 TestBed.flushEffects() 確保 Signal Effect 執行完畢。
使用 Harness (Angular CDK Harness) 進行 Component 測試，避免依賴 CSS Selector。
十、嚴格領域層實作規範 (Strict Domain Implementation Specs)本節定義了符合 template-core 範例的嚴格 DDD 實作模式，適用於所有核心業務模組。1. Aggregate Root 生命週期
Aggregate 必須支援兩種構造模式：

Creation (Behaviors): 透過靜態工廠方法 (e.g., create())，執行業務檢查，產生 Domain Event，並初始化狀態。
Reconstruction (Snapshot): 透過靜態方法 reconstruct(props)，從 Persistence/Snapshot 恢復狀態，不產生 Domain Event。
2. 子實體管理 (Child Entities)

Aggregate Root 內部的集合必須封裝為 Child Entities。
Child Entity 必須擁有独立的 Value Object ID。
禁止直接暴露 Child Entity 陣列，必須透過方法操作，並維護 Aggregate Invariants。
3. 嚴格型別安全 (Strict Type Safety)

禁止 any: Domain, Application, Infrastructure 層嚴禁使用 any 或 as unknown 繞過型別檢查。
Mapper 規範: Infrastructure Mapper 必須明確處理深層嵌套物件的序列化與反序列化，確保型別一致。
4. 深度因果追蹤 (Deep Causality)

Use Case 職責: 負責初始化 correlationId 與 causationId。
Factory/Aggregate 職責: 必須在所有變更狀態的方法中接收 Metadata 參數，並將其寫入 Domain Event。
十一、持續演進與防腐層 (Evolution & Anti-Corruption)
Schema Evolution：Event Schema 變更時，必須實作 Upcaster 以相容舊事件。
ADR (Architecture Decision Records)：任何偏離本文件的架構決策，必須即時更新本文件或記錄 ADR，禁止「隱形架構」。
十二、落地檢查清單 (Enforcement Checklist)
✅ 層級邊界符合 Domain → Application → Infrastructure → Presentation，且介面定義歸於需求方。
✅ Workspace 切換時，所有 Module 的 store/state 會被銷毀並重建，不可殘留跨 Workspace 資料。
✅ 模組間僅透過 Workspace Event Bus 互動，事件遵循 Append -> Publish -> React 並攜帶 correlationId。
✅ 模板語法檢查：全面使用 @if, @for (附帶 track), @switch，禁止 *ngIf/*ngFor。
✅ 所有狀態以 signalStore 管理，禁止 BehaviorSubject、手動 subscribe 或跨模組共享 Signal。
✅ Presentation 僅經由 Application Store/Facade 取得資料，不直接呼叫 Infrastructure 或 Domain。
✅ Aggregate 實作：檢查是否包含 reconstruct 方法，且 Child Entities 使用 Value Object ID。
✅ Event Metadata：檢查 Domain Event 是否正確攜帶 correlationId, userId 等元數據。
✅ 實作若偏離本憲章或 DDD SKILL，必須立即補充 ADR 或修訂本文件。

---
description: 'Angular Material 最佳實踐 - 現代化元件使用指南'
applyTo: '**/*.component.ts,**/*.component.html,**/*.theme.scss'
---

# Angular Material 最佳實踐

## 核心概念

Angular Material 是官方的 Material Design 元件庫，提供一致、高品質的 UI 元件。在 Angular 20+ 中，需要特別注意與 Standalone Components 和 Signals 的整合。

## 模組導入策略

### Standalone Components 時代
- 直接導入需要的 Material 元件
- 避免建立大型共享模組
- 按需導入減少 bundle 大小
- 使用 tree-shaking 移除未使用元件

### 導入最佳實踐
- 只導入實際使用的元件
- 使用明確的導入語句
- 避免通配符導入
- 在 component imports 陣列中聲明

## 主題系統

### 自訂主題
- 使用 Material 3 主題系統
- 定義自訂調色盤 (primary, accent, warn)
- 支援深色模式切換
- 使用 CSS 變數實現動態主題

### 主題架構
- 在 styles.scss 中定義全域主題
- 元件層級自訂樣式使用 `::ng-deep` (謹慎使用)
- 使用 Material typography 系統
- 保持與 Material Design 規範一致

### 響應式主題
- 根據系統偏好自動切換
- 提供使用者手動切換選項
- 使用 Signal 管理主題狀態
- 持久化使用者偏好

## 常用元件模式

### 表單元件
- MatFormField 與 FormControl 整合
- 正確使用 mat-label, mat-hint, mat-error
- 驗證錯誤顯示策略
- 使用 Signals 管理表單狀態

### 對話框 (Dialog)
- 使用 inject(MAT_DIALOG_DATA) 接收資料
- 使用 MatDialogRef 控制關閉
- 定義清晰的資料介面
- 處理關閉結果

### 表格 (Table)
- 使用 MatTableDataSource 管理資料
- 整合排序、分頁、篩選功能
- 響應式欄位設定
- 虛擬滾動處理大型資料集

### 選單與導航
- MatMenu 用於下拉選單
- MatSidenav 用於側邊欄
- MatToolbar 用於頂部導航
- 保持一致的導航體驗

## 與 Signals 整合

### 狀態管理
- 使用 Signal 控制元件狀態 (開啟/關閉、展開/收合)
- MatDialog 結果轉換為 Signal
- 使用 computed() 衍生 UI 狀態
- 避免不必要的變更檢測

### 資料綁定
- 使用 Signal inputs 接收資料
- MatTable dataSource 可以是 Signal
- 動態更新元件屬性
- 保持資料流單向性

## 無障礙性 (Accessibility)

### ARIA 標籤
- 使用內建的 ARIA 支援
- 自訂元件時補充必要標籤
- 確保鍵盤導航可用
- 提供適當的角色和屬性

### 鍵盤支援
- 所有互動元件支援鍵盤操作
- 適當的 Tab 順序
- Enter/Space 觸發動作
- Escape 關閉對話框或選單

### 螢幕閱讀器
- 動態內容變更通知
- 使用 LiveAnnouncer 服務
- 表單錯誤即時回饋
- 提供文字替代方案

## 效能最佳化

### 虛擬滾動
- 大型列表使用 `cdk-virtual-scroll-viewport`
- 設定適當的 itemSize
- 優化渲染效能
- 減少 DOM 節點數量

### 延遲載入
- 使用 `@defer` 延遲載入重型元件
- Dialog 內容延遲載入
- Tab 內容按需載入
- 減少初始載入時間

### 變更檢測
- 使用 OnPush 策略
- Signals 自動優化檢測
- 避免不必要的重渲染
- 使用 trackBy 函數

## 響應式設計

### Breakpoint Observer
- 使用 BreakpointObserver 服務
- 根據螢幕大小調整佈局
- 定義自訂斷點
- 轉換為 Signal 使用

### Flex Layout
- 使用 CSS Flexbox 和 Grid
- Material 不再提供 @angular/flex-layout
- 使用現代 CSS 特性
- 保持跨瀏覽器相容性

### 行動優先
- 優先設計行動版介面
- 漸進增強桌面體驗
- 觸控友善的元件大小
- 考慮手勢操作

## 自訂與擴展

### 元件包裝
- 建立自訂包裝元件
- 封裝常用配置
- 保持 Material 元件 API
- 提供額外功能

### 樣式自訂
- 使用 Material 提供的 mixin
- 遵循 Material Design 規範
- 保持視覺一致性
- 避免破壞元件結構

### 主題 Token
- 使用設計 token 系統
- 定義語意化顏色
- 支援多品牌主題
- 便於維護和更新

## 常見元件使用

### 按鈕 (Button)
- 使用適當的按鈕類型 (mat-button, mat-raised-button, mat-fab)
- 提供無障礙標籤
- 載入狀態顯示
- 禁用狀態處理

### 卡片 (Card)
- 結構化內容組織
- 一致的間距和陰影
- 互動式卡片處理
- 響應式佈局

### 輸入框 (Input)
- 與 FormControl 整合
- 顯示驗證錯誤
- 前綴和後綴圖示
- 自動完成支援

### 選擇器 (Select)
- 單選和多選模式
- 選項群組
- 搜尋過濾
- 自訂觸發器

## 測試策略

### 元件測試
- 使用 ComponentHarness 測試 Material 元件
- 模擬使用者互動
- 驗證 ARIA 屬性
- 測試響應式行為

### 整合測試
- 測試對話框開啟和關閉
- 驗證表單提交流程
- 測試導航互動
- 確保無障礙性

## 常見陷阱

### ❌ 應避免
- 過度自訂導致偏離 Material Design
- 忽略無障礙性
- 不適當的 ::ng-deep 使用
- 混用多個 UI 框架
- 忘記導入必要模組

### ⚠️ 注意事項
- MatFormField 需要包裹表單控制項
- Dialog 關閉時要處理返回值
- Table 需要定義 displayedColumns
- 主題變更需要強制更新某些元件

## 版本升級

### Material 版本對應
- 確保 Material 版本與 Angular 版本對應
- 查閱升級指南
- 使用 `ng update` 自動升級
- 測試破壞性變更

### 遷移到 Material 3
- 更新主題配置
- 調整元件樣式
- 檢查 API 變更
- 更新自訂元件

## CDK 整合

### 使用 CDK 基礎功能
- Overlay 服務建立浮層
- Portal 動態內容投影
- A11y 無障礙工具
- 拖放功能

### 自訂元件基礎
- 使用 CDK 建立自訂元件
- 複用 Material 行為
- 保持一致性
- 減少重複程式碼

## 國際化 (i18n)

### 多語言支援
- 使用 Angular i18n 系統
- Material 元件內建多語言
- 自訂標籤翻譯
- 日期和數字格式化

### RTL 支援
- 啟用 RTL 佈局
- 測試雙向文字
- 圖示和動畫鏡像
- 保持可讀性

## 文件與學習

### 官方資源
- Material 元件文件
- API 參考
- 設計指南
- 範例和 playground

### 社群資源
- GitHub 討論區
- Stack Overflow
- 部落格文章
- 視訊教學

## 專案結構建議

### 元件組織
- 按功能模組組織 Material 元件
- 建立可重用的元件包裝器
- 統一的樣式目錄
- 共享的主題配置

### 程式碼規範
- 一致的命名慣例
- 統一的導入順序
- 註釋自訂樣式原因
- 文件化特殊配置
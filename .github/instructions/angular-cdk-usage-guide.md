---
description: 'Angular CDK 使用指南 - 無 UI 的強大工具集'
applyTo: '**/*.component.ts,**/*.directive.ts,**/*.service.ts'
---

# Angular CDK 使用指南

## 核心概念

Angular Component Dev Kit (CDK) 是一組行為原語和工具，用於建立高品質的 UI 元件。CDK 提供無樣式的功能性實作，可作為自訂元件的基礎。

## CDK 主要模組

### Overlay (浮層)
提供浮動面板的定位和管理系統:
- 創建彈出視窗、下拉選單、對話框
- 靈活的定位策略
- 滾動和調整大小處理
- 背景遮罩管理
- 鍵盤和焦點管理

### Portal (入口)
動態內容投影機制:
- ComponentPortal - 動態載入元件
- TemplatePortal - 投影模板內容
- DomPortal - 投影 DOM 元素
- 跨元件邊界傳遞內容
- 延遲實例化

### A11y (無障礙性)
無障礙工具集:
- FocusTrap - 焦點陷阱
- FocusMonitor - 焦點狀態監控
- LiveAnnouncer - 動態內容宣告
- AriaDescriber - ARIA 描述管理
- InteractivityChecker - 互動性檢查

### Layout (佈局)
響應式佈局工具:
- BreakpointObserver - 斷點監聽
- MediaMatcher - 媒體查詢匹配
- 預定義斷點 (Handset, Tablet, Web)
- 自訂斷點支援

### Scrolling (滾動)
滾動相關功能:
- Virtual Scrolling - 虛擬滾動
- Scroll Dispatcher - 滾動事件調度
- Viewport Ruler - 視窗尺寸追蹤
- 高效能大型列表渲染

### Drag and Drop (拖放)
拖放功能實作:
- CdkDrag - 可拖動元素
- CdkDropList - 拖放容器
- 列表排序
- 跨列表移動
- 自訂預覽和佔位符

## Overlay 深入使用

### 建立 Overlay
基本流程:
1. 注入 Overlay 服務
2. 創建 OverlayConfig
3. 建立 OverlayRef
4. 附加 Portal

### 定位策略
- **GlobalPositionStrategy**: 全域定位 (相對於視窗)
- **FlexibleConnectedPositionStrategy**: 彈性連接定位 (相對於元素)
- **ConnectionPositionPair**: 定義連接點對

### 滾動策略
- **NoopScrollStrategy**: 不處理滾動
- **CloseScrollStrategy**: 滾動時關閉
- **BlockScrollStrategy**: 阻止滾動
- **RepositionScrollStrategy**: 滾動時重新定位

### 背景遮罩
- 自訂背景顏色和不透明度
- 點擊背景關閉
- 防止內容滾動
- 層級管理 (z-index)

## Portal 應用場景

### 動態元件載入
適用情境:
- 對話框內容
- 動態表單
- 延遲載入的小工具
- 條件式 UI 區塊

### 模板投影
適用情境:
- 重用模板內容
- 跨元件投影
- 動態內容切換
- 插槽式設計

### 最佳實踐
- 正確管理 Portal 生命週期
- 及時 detach 避免記憶體洩漏
- 使用 ComponentRef 控制元件實例
- 處理 Portal 附加失敗情況

## A11y 工具應用

### FocusTrap
使用場景:
- 模態對話框
- 側邊欄
- 彈出選單
- 確保鍵盤使用者不會失焦

實作要點:
- 在打開時自動聚焦
- Tab 循環限制在區域內
- Escape 鍵關閉
- 關閉後恢復原始焦點

### FocusMonitor
監控焦點狀態:
- 追蹤元素獲得/失去焦點
- 區分鍵盤和滑鼠焦點
- 添加視覺焦點指示器
- 整合到自訂元件

### LiveAnnouncer
動態內容宣告:
- 通知螢幕閱讀器內容變更
- 表單驗證錯誤
- 載入狀態更新
- 操作結果回饋

## BreakpointObserver 響應式設計

### 監聽斷點變化
整合模式:
- 訂閱斷點 Observable
- 使用 `toSignal()` 轉換為 Signal
- 根據斷點調整佈局
- 動態載入元件或資源

### 自訂斷點
定義業務特定斷點:
- 根據設計需求定義
- 支援複雜媒體查詢
- 組合多個條件
- 保持響應式邏輯集中

### 與 Signals 整合
響應式狀態管理:
- 斷點狀態為 Signal
- 使用 `computed()` 衍生 UI 狀態
- 自動更新佈局
- 減少手動訂閱

## Virtual Scrolling 效能優化

### CdkVirtualScrollViewport
大型列表渲染:
- 只渲染可見項目
- 動態回收 DOM 節點
- 支援固定或動態高度
- 大幅提升效能

### 設定項目大小
兩種模式:
- **固定大小**: 設定 itemSize
- **動態大小**: 提供 itemSize 函數

### 整合 Signal
資料流整合:
- 資料源為 Signal
- 自動響應資料變更
- 保持滾動位置
- 優化變更檢測

### 適用場景
- 長列表 (數千筆資料)
- 聊天訊息記錄
- 無限滾動
- 大型表格

## Drag and Drop 實作

### 基本拖放
設定步驟:
1. 添加 `cdkDrag` 到可拖動元素
2. 添加 `cdkDropList` 到容器
3. 處理 `cdkDropListDropped` 事件
4. 更新資料模型

### 拖放約束
控制行為:
- 限制拖動軸向 (水平/垂直)
- 設定拖動邊界
- 禁用特定項目拖放
- 自訂拖動手柄

### 跨列表拖放
進階功能:
- 連接多個 drop list
- 設定 `cdkDropListConnectedTo`
- 處理跨列表資料傳遞
- 驗證拖放有效性

### 自訂預覽
視覺回饋:
- 自訂拖動中的預覽元素
- 設定佔位符樣式
- 動畫效果
- 拖放指示器

## 與 Signals 整合模式

### Observable 到 Signal
常見轉換:
- BreakpointObserver → Signal
- ScrollDispatcher → Signal
- FocusMonitor → Signal
- Overlay 狀態 → Signal

### 響應式 UI 更新
整合優勢:
- 自動變更檢測
- 減少手動訂閱
- 更清晰的資料流
- 更好的效能

## 自訂元件建構

### 使用 CDK 作為基礎
設計模式:
- 複用 CDK 行為邏輯
- 添加自訂樣式和功能
- 保持無障礙性
- 符合業務需求

### 組合多個 CDK 功能
複雜元件:
- Overlay + Portal + FocusTrap
- VirtualScroll + DragDrop
- Layout + A11y
- 建立強大的自訂元件

## 效能考量

### Overlay 效能
最佳化:
- 重用 OverlayRef 而非重複創建
- 使用適當的滾動策略
- 及時銷毀不需要的 overlay
- 避免過多層級嵌套

### Virtual Scrolling 調校
優化技巧:
- 選擇適當的 itemSize
- 使用 trackBy 函數
- 避免複雜的模板
- 測試不同裝置效能

### Drag and Drop 優化
效能提升:
- 限制可拖動項目數量
- 使用簡單的預覽元素
- 避免過度動畫
- 測試大型列表效能

## 測試策略

### CDK 元件測試
測試重點:
- 使用 ComponentHarness
- 模擬拖放操作
- 驗證焦點管理
- 測試響應式行為

### Overlay 測試
測試項目:
- Overlay 開啟和關閉
- 定位正確性
- 背景點擊行為
- 鍵盤互動

## 常見模式

### 下拉選單
組合使用:
- Overlay 提供定位
- Portal 投射內容
- FocusTrap 管理焦點
- 點擊外部關閉

### 對話框
完整方案:
- Overlay 作為容器
- Portal 載入對話框內容
- 背景遮罩
- FocusTrap 焦點管理
- 鍵盤事件處理

### 工具提示
輕量實作:
- Overlay 簡單定位
- 延遲顯示/隱藏
- 無背景遮罩
- 滑鼠移出自動關閉

### 側邊欄
完整功能:
- Overlay 或固定定位
- 滑入/滑出動畫
- 背景遮罩可選
- 響應式行為

## 常見陷阱

### ❌ 應避免
- 忘記 detach Portal 造成記憶體洩漏
- Overlay 層級管理混亂
- 忽略無障礙性
- Virtual Scrolling 使用過小的 itemSize
- 拖放時不更新資料模型

### ⚠️ 注意事項
- Overlay 在 OnPush 策略下的更新
- Portal 附加時機
- 焦點管理的完整性
- 響應式斷點的準確性

## 進階技巧

### 自訂 Overlay 位置
精確控制:
- 創建自訂定位策略
- 考慮滾動和視窗調整
- 處理邊界情況
- 平滑過渡動畫

### 優化 Virtual Scrolling
進階配置:
- 自訂 VirtualScrollStrategy
- 動態調整緩衝區大小
- 處理不規則項目高度
- 整合無限滾動

### 複雜拖放邏輯
業務整合:
- 自訂拖放驗證
- 多方向拖放
- 嵌套拖放列表
- 拖放動畫和轉場

## 文件與資源

### 官方文件
- CDK API 參考
- 元件範例
- 指南和教學
- 原始碼註解

### 學習路徑
1. 理解基本概念
2. 實作簡單範例
3. 研究 Material 原始碼
4. 建構自訂元件
5. 優化和測試

## 專案整合

### 引入 CDK
設定步驟:
- 安裝 @angular/cdk
- 按需導入模組
- 設定必要的樣式
- 配置主題 (如需要)

### 團隊協作
最佳實踐:
- 文件化 CDK 使用模式
- 建立可重用的包裝器
- 統一的命名規範
- 程式碼審查重點
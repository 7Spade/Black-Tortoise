---
description: 'Angular 20 Router 現代化模式 - Functional Guards & Resolvers'
applyTo: '**/*.routes.ts,**/guards/*.ts,**/resolvers/*.ts'
---

# Angular 20 Router 現代化模式

## 核心概念

Angular 路由系統在版本 15+ 引入函數式 API，取代傳統的類別式 Guards 和 Resolvers。Angular 20 進一步強化 Standalone Components 整合和 Signals 支援。

## 路由配置現代化

### Standalone Routes
- 使用 `provideRouter()` 取代 RouterModule
- 直接在 routes 配置中載入 Standalone Components
- 支援 lazy loading 和 code splitting
- 簡化模組依賴結構

### 檔案組織
推薦結構:
- `app.routes.ts` - 主路由配置
- `feature.routes.ts` - 功能模組路由
- `guards/` - 函數式 guards
- `resolvers/` - 函數式 resolvers

## Functional Guards

### 取代 Class-based Guards
傳統的類別式 Guards (CanActivate, CanDeactivate 等) 已被函數式替代:
- 更簡潔的語法
- 更好的可測試性
- 支援 `inject()` 函數
- 更容易組合和重用

### Guard 類型
- **CanActivateFn**: 保護路由啟動
- **CanDeactivateFn**: 保護路由離開
- **CanMatchFn**: 保護路由匹配
- **CanLoadFn**: 保護延遲載入 (已整合至 CanMatch)

### 使用 inject() 注入依賴
- 在 Guard 函數內使用 `inject()`
- 注入 Services, Stores, Router 等
- 保持函數式純粹性

### 組合 Guards
- 多個 guards 以陣列形式組合
- Guards 依序執行
- 任一 guard 返回 false 則阻止導航
- 支援非同步 guards (返回 Observable 或 Promise)

## Functional Resolvers

### 資料預載模式
- 使用 `ResolveFn` 取代 `Resolve` 介面
- 在路由啟動前載入資料
- 避免閃爍和載入狀態
- 提供更好的使用者體驗

### Resolver 設計原則
- 只載入關鍵資料
- 考慮使用 `defer` 或懶載入非關鍵資料
- 處理錯誤情況 (返回預設值或導航到錯誤頁)
- 保持 resolver 輕量

### 與 Signals 整合
- Resolver 返回的資料可轉換為 Signal
- 使用 `toSignal()` 整合到元件
- 保持響應式資料流

## 路由參數處理

### Input Binding
使用 `withComponentInputBinding()`:
- 路由參數自動綁定到元件 Input
- 減少 boilerplate 程式碼
- 支援 query parameters 和 route data
- 更好的型別安全

### 參數變更監聽
- 使用 `input()` Signal 函數接收路由參數
- 自動響應參數變更
- 搭配 `effect()` 或 `computed()` 處理副作用

## 路由狀態管理

### Router State as Signal
- 使用 `toSignal(router.events)` 追蹤路由事件
- 使用 Signal 管理當前路由狀態
- 與 @ngrx/signals 整合

### 導航狀態
- 使用 `NavigationExtras` 傳遞狀態
- 在目標元件中使用 `Router.getCurrentNavigation()` 接收
- 適合傳遞暫態資料 (如確認訊息)

## 延遲載入策略

### 路由層級 Lazy Loading
- 使用 `loadComponent` 載入 Standalone Component
- 使用 `loadChildren` 載入子路由
- 自動 code splitting
- 減少初始包大小

### 預載策略
- `PreloadAllModules`: 預載所有延遲路由
- `NoPreloading`: 不預載
- 自訂預載策略: 實作 `PreloadingStrategy`
- 根據網路狀況或使用者行為調整

### 資料預取
- 使用 Resolvers 預取關鍵資料
- 使用 `@defer` 延遲載入次要內容
- 平衡首次載入和使用者體驗

## 路由動畫

### 過場動畫配置
- 使用 `@angular/animations` 定義路由過場
- 在路由配置中設定 `data: { animation: '...' }`
- 使用 `RouterOutlet` 的動畫觸發器
- 提供流暢的頁面切換體驗

### 效能考量
- 避免過於複雜的動畫
- 使用 CSS transforms 和 opacity
- 考慮使用者裝置效能
- 提供關閉動畫選項 (無障礙考量)

## 導航處理

### 程式化導航
- 使用 `Router.navigate()` 或 `Router.navigateByUrl()`
- 返回 Promise<boolean> 指示導航成功與否
- 處理導航失敗情況
- 使用相對或絕對路徑

### 導航取消
- 監聽 `NavigationCancel` 事件
- 處理使用者取消或 Guard 阻止的情況
- 提供適當的使用者回饋

### 錯誤處理
- 監聽 `NavigationError` 事件
- 全域錯誤處理器
- 導航到錯誤頁面
- 記錄錯誤用於除錯

## 進階模式

### 多層路由 (Nested Routes)
- 使用 `children` 定義子路由
- 多個 `<router-outlet>` 支援
- 共享 layout 元件
- 麵包屑導航支援

### 命名路由出口 (Named Outlets)
- 使用 `outlet` 屬性定義命名出口
- 支援並行顯示多個路由
- 適用於 modal、sidebar 等場景
- 獨立的導航歷史

### 路由重用策略
- 實作 `RouteReuseStrategy`
- 控制元件是否重用
- 優化效能和使用者體驗
- 保持表單狀態或滾動位置

## 安全性考量

### 認證 Guards
- 檢查使用者登入狀態
- 重導向到登入頁面
- 保存原始 URL 用於登入後返回
- 處理 token 過期

### 授權 Guards
- 檢查使用者權限或角色
- 阻止未授權訪問
- 顯示適當的錯誤訊息
- 記錄未授權嘗試

### 資料保護
- 避免在 URL 中傳遞敏感資料
- 使用 POST 請求傳遞大量或敏感資料
- 驗證路由參數輸入
- 防止 URL 操縱攻擊

## 測試策略

### Guards 測試
- 使用 `TestBed` 設定測試環境
- Mock 依賴的 Services
- 測試各種授權情況
- 驗證重導向邏輯

### Resolvers 測試
- 測試資料載入邏輯
- Mock HTTP 請求
- 測試錯誤處理
- 驗證返回值型別

### 路由導航測試
- 使用 `RouterTestingModule` 或 `provideRouter()`
- 模擬導航事件
- 驗證路由狀態
- 測試參數傳遞

## 效能最佳化

### Bundle 大小優化
- 最大化延遲載入使用
- 移除未使用的路由
- 分析 bundle 大小
- 使用 webpack-bundle-analyzer

### 首次載入優化
- 只載入首屏必需路由
- 使用 PreloadingStrategy 智慧預載
- 優化 Guards 和 Resolvers 效能
- 減少初始依賴

### 記憶體管理
- 確保元件正確銷毀
- 取消訂閱 (使用 `toSignal()` 自動管理)
- 避免記憶體洩漏
- 使用 RouteReuseStrategy 謹慎

## 無障礙性

### 鍵盤導航
- 確保所有路由可通過鍵盤訪問
- 適當的 focus 管理
- 跳過內容連結
- Tab 順序合理

### 螢幕閱讀器支援
- 路由變更時宣告頁面標題
- 使用 `<title>` 或 ARIA live regions
- 提供導航地標 (landmarks)
- 適當的語意化 HTML

## 常見模式與反模式

### ✅ 良好模式
- 使用函數式 Guards 和 Resolvers
- 充分利用延遲載入
- 使用 `withComponentInputBinding()`
- 集中錯誤處理
- 保持路由配置扁平和清晰

### ❌ 應避免
- 使用過時的類別式 Guards
- 過度嵌套的路由結構
- 在 URL 中傳遞敏感資料
- 忽略導航錯誤
- 沒有適當的 loading 狀態

## 遷移指南

### 從類別式遷移到函數式
1. 識別所有類別式 Guards 和 Resolvers
2. 轉換為函數式實作
3. 使用 `inject()` 取代建構函數注入
4. 更新路由配置
5. 更新測試

### 引入 Signals
1. 使用 `input()` 接收路由參數
2. 使用 `toSignal()` 轉換路由事件
3. 整合 @ngrx/signals 管理路由狀態
4. 漸進式重構

## 學習資源

- Angular 官方路由文件
- Functional Guards 和 Resolvers 指南
- Standalone Components 最佳實踐
- 路由效能優化建議
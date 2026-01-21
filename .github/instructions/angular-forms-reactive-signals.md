---
description: 'Angular 20 響應式表單與 Signals 整合最佳實踐'
applyTo: '**/*.component.ts,**/forms/*.ts,**/services/*.ts'
---

# Angular 20 響應式表單 + Signals 整合

## 核心概念

Angular 的響應式表單系統基於 RxJS Observables，而 Signals 是 Angular 16+ 引入的新響應式原語。整合兩者需要理解資料流轉換和狀態同步機制。

## 整合模式

### Observable 到 Signal 轉換
使用 `toSignal()` 將表單的 Observable 串流轉換為 Signal:
- `valueChanges` → 表單值變更 Signal
- `statusChanges` → 表單狀態 Signal
- 自訂驗證器的非同步結果 → Signal

### Signal 驅動的表單邏輯
- 使用 `computed()` 衍生表單狀態
- 使用 `effect()` 同步表單與外部狀態
- 保持單向資料流

### 與 @ngrx/signals 整合
- 使用 SignalStore 統一管理表單狀態
- 使用 `rxMethod` 處理表單提交等非同步操作
- 使用 `withMethods` 封裝表單邏輯

## 架構分層原則

### Component 層
- 持有 FormControl/FormGroup 實例
- 將 Observable 轉換為 Signal
- 僅處理 UI 互動邏輯
- 委派業務邏輯給 Service/Store

### Service/Store 層
- 管理表單相關的全域狀態
- 處理表單提交、驗證等業務邏輯
- 與後端 API 互動
- 提供 Signal 介面給 Component

### 資料流方向
```
使用者輸入 → FormControl → Observable → Signal → UI 更新
                              ↓
                         Service/Store (業務邏輯)
                              ↓
                          API 呼叫
```

## 表單驗證策略

### 同步驗證
- 內建驗證器 (required, email, min, max 等)
- 自訂同步驗證器函數
- 使用 Signal 響應驗證結果

### 非同步驗證
- 使用 AsyncValidator 介面
- 後端驗證 (如檢查使用者名稱是否已存在)
- 轉換為 Signal 以追蹤驗證狀態

### 驗證錯誤處理
- 使用 `computed()` 計算錯誤訊息
- 條件式顯示錯誤 (配合 `@if`)
- 多語系錯誤訊息支援

## 狀態管理模式

### 本地狀態 (Component-scoped)
適用場景:
- 簡單表單 (少於 5 個欄位)
- 不需跨元件共享
- 無複雜業務邏輯

管理方式:
- 直接在 Component 使用 `toSignal()`
- 使用 local signals 管理輔助狀態

### 全域狀態 (Application-scoped)
適用場景:
- 複雜多步驟表單
- 需要跨頁面保持狀態
- 多個元件共享表單資料
- 需要復原/重做功能

管理方式:
- 使用 @ngrx/signals SignalStore
- 統一的狀態更新邏輯
- 集中的副作用處理

## 表單提交流程

### 標準流程
1. 使用者觸發提交
2. 驗證表單有效性
3. 更新提交中狀態 (isSubmitting)
4. 呼叫 Service/Store 方法
5. 使用 rxMethod 處理非同步操作
6. 處理成功/失敗回應
7. 更新 UI 狀態 (成功訊息、錯誤訊息)
8. 可選: 重置表單或導航

### 錯誤處理
- 使用 `tapResponse` 處理成功/錯誤
- 錯誤訊息儲存在 Signal 中
- 提供使用者友善的錯誤回饋
- 考慮重試機制

### 載入狀態
- 維護 `isSubmitting` Signal
- 禁用提交按鈕避免重複提交
- 顯示載入指示器
- 保持 UI 響應性

## 動態表單處理

### FormArray 管理
- 動態新增/移除表單控制項
- 使用 Signal 追蹤陣列長度
- 配合 `@for` 渲染動態欄位
- 使用適當的 track 表達式

### 條件式欄位
- 根據其他欄位值顯示/隱藏欄位
- 使用 `computed()` 判斷顯示邏輯
- 動態啟用/禁用控制項
- 條件式驗證規則

### 巢狀表單
- 使用 FormGroup 巢狀結構
- 子表單元件化
- 使用 ControlValueAccessor 整合
- 保持型別安全

## 效能最佳化

### 避免不必要的計算
- 使用 `computed()` 而非 getter
- 謹慎使用 `effect()` (避免副作用循環)
- 適當使用 `untracked()` 打破依賴

### 減少訂閱
- 優先使用 `toSignal()` 而非手動訂閱
- 讓 Angular 自動管理訂閱生命週期
- 避免記憶體洩漏

### 表單值變更節流
- 使用 RxJS operators (debounceTime, throttleTime)
- 避免過度頻繁的 API 呼叫
- 平衡即時性和效能

## TypeScript 型別安全

### 強型別表單
- 使用泛型定義 FormControl<T>
- 使用介面定義表單結構
- 啟用 `nonNullable` 選項避免 null 值
- 完整的型別推斷

### 型別保護
- 驗證器返回型別安全的錯誤
- 使用 TypeScript 嚴格模式
- 避免 any 型別

## 常見模式與反模式

### ✅ 良好模式
- 使用 `toSignal()` 轉換 Observable
- 在 Store 處理業務邏輯
- 使用 `computed()` 衍生狀態
- 保持單向資料流
- 集中錯誤處理

### ❌ 應避免
- 手動訂閱 valueChanges (除非必要)
- 在 Component 直接呼叫 API
- 混用 Signal 和傳統狀態管理
- 忘記設定 `initialValue`
- 在模板中使用複雜的表達式

## 測試策略

### 單元測試
- 測試表單驗證邏輯
- 測試 Signal 計算邏輯
- Mock Service/Store 依賴
- 使用 TestBed 設定

### 整合測試
- 測試表單提交流程
- 測試錯誤處理
- 測試狀態同步
- 模擬使用者互動

## 可訪問性考量

- 適當的 label 與 input 關聯
- 錯誤訊息與 aria-describedby 連結
- 表單驗證狀態的無障礙提示
- 鍵盤導航支援
- 螢幕閱讀器友善的錯誤訊息

## 遷移建議

### 從傳統表單遷移
1. 保持現有 FormControl/FormGroup 結構
2. 逐步將 Observable 訂閱改為 `toSignal()`
3. 引入 SignalStore 管理複雜狀態
4. 重構業務邏輯到 Service/Store
5. 更新測試

### 漸進式採用
- 新功能使用 Signals
- 既有功能逐步重構
- 保持向後相容
- 團隊培訓與文件更新
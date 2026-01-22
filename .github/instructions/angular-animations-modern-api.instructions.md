---
description: 'Angular 動畫現代化 API - 效能與體驗優化'
applyTo: '**/*.component.ts,**/*.animations.ts'
---

# Angular 動畫現代化 API

## 核心概念
- Web Animations API
- Signals 整合
- 現代控制流整合

## 動畫模組導入
- provideAnimations() / provideNoopAnimations()
- BrowserAnimationsModule (非 standalone)
- 按需導入動畫函數
- 生產環境啟用、測試禁用
- 使用者偏好設定與低效能偵測

## 動畫定義方式
- @Component animations 陣列
- 可分離檔案
- 命名觸發器
- trigger / state / transition / style / animate
- 明確與通配符狀態，雙向轉換

## 常見動畫模式
- 進入/離開動畫
- 狀態切換動畫
- 列表動畫
- 路由動畫

## 動畫時間與緩動
- 單一數值或完整格式
- ease, ease-in/out, linear, cubic-bezier
- 選擇原則：進入 ease-out、離開 ease-in

## 進階動畫技巧
- 序列與並行 (sequence, group, stagger)
- 動畫回呼 (@trigger.start / done)
- 參數化 (params)
- 查詢子元素 (query(), animateChild())

## 與 Signals 整合
- Signal 值觸發動畫
- computed() 計算動畫狀態
- effect() 執行動畫
- SignalStore 動畫狀態管理

## 效能最佳化
- GPU 加速 transform / opacity
- 避免 layout 屬性動畫
- will-change CSS
- 限制同時動畫數量
- 簡化動畫步驟
- 清理動畫監聽器 / 虛擬滾動

## 無障礙性考量
- prefers-reduced-motion 偵測
- 螢幕閱讀器友善
- 提供文字替代資訊
- 建議動畫時間：簡單 100-200ms，複雜 200-400ms

## 測試策略
- provideNoopAnimations() 禁用動畫
- 驗證觸發邏輯與完成狀態
- 模擬回呼
- Chrome DevTools Animation 面板

## 常見動畫場景
- 通知 / Toast
- 手風琴 / 摺疊面板
- 載入指示器 (spinner / progress)
- 模態對話框
- 卡片翻轉 3D 效果

## 動畫與路由
- 路由配置 data.animation
- RouterOutlet 綁定觸發器
- 淡入淡出、滑動、縮放
- 保持動畫簡短與效能

## 動畫庫與資源
- ng-animate、Material 動畫
- 自訂動畫集合
- 設計靈感：Material / iOS / Dribbble

## 常見模式與反模式
- ✅ GPU 加速、短動畫、回呼、reduced-motion
- ❌ width/height/top/left 動畫、過長、過多元素、忽略無障礙、複雜邏輯

## 動畫除錯
- 未觸發 / 閃爍 / 卡頓 / 衝突
- Chrome DevTools / Angular DevTools / 瀏覽器效能分析 / logs

## 未來趨勢
- Web Animations API 改進
- Signals 更佳整合
- API 簡化與型別強化
- 視覺化動畫工具

## 學習資源
- 官方文件、API 參考、範例、最佳實踐
- 學習路徑：語法 → 常見效果 → 效能 → 進階技巧 → 動畫庫

## 專案整合
- 獨立 animations.ts 檔案
- 按功能分類、可重用、命名規範
- 文件化動畫用途與參數
- 提供範例與預覽
- Code review 關注效能
- 建立動畫設計規範

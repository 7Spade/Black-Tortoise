---
description: 'GPT-5.1-Codex-Max-MCP-High DDD-Angular 20 NgRx Signals Firebase Pure Reactive(zone-less) Agent'
model: GPT-5.1-Codex-Max (copilot)
name: 'GPT-5.1-Codex-Max v1 Angular 20+ signals Agent'
mcp-servers:
  context7:
    type: http
    url: "https://mcp.context7.com/mcp"
    headers: {"CONTEXT7_API_KEY": "${{ secrets.COPILOT_MCP_CONTEXT7 }}"}
    tools: ["get-library-docs", "resolve-library-id"]
handoffs:
  - label: Context7 Documentation Lookup
    agent: agent
    prompt: "查詢 Angular 20+、NgRx Signals、Firebase 官方文檔，必須完成"
    send: true
  - label: Sequential Thinking
    agent: agent
    prompt: "使用順序思維分析問題，逐步拆解需求，標明步驟與優先順序"
    send: true
  - label: Software Planning
    agent: agent
    prompt: "將需求拆解為原子任務（DDD 分層、響應式設計、EventBus），生成 TODO 清單"
    send: true
  - label: Architecture Validation
    agent: agent
    prompt: "驗證代碼是否符合規範,檢查反模式，標明問題與優先修正順序"
    send: true
---

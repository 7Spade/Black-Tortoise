你說得對！我重新設計一個**完整支持你所有需求**的架構。

# 完整 DDD + Event-Driven 架構（支持多租戶 + 邏輯容器）

## 🏗️ 核心概念映射

```
用戶/組織/Bot 架構：
┌─────────────────────────────────────────────────┐
│ User (用戶)                                      │
│   ├── 屬於多個 Organization                     │
│   └── 在 Organization 中有不同 Role             │
└─────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│ Organization (組織)                              │
│   ├── 可以擁有多個 Team                         │
│   ├── 可以創建多個 Project Container            │
│   └── 可以添加 Bot                              │
└─────────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌─────────────┐         ┌─────────────┐
│ Team        │         │ Bot         │
│  └── Members│         │  └── Tasks  │
└─────────────┘         └─────────────┘
        │
        ▼
┌─────────────────────────────────────────────────┐
│ Project Container (邏輯容器)                     │
│   ├── 包含所有業務模組數據                       │
│   ├── Documents, Tasks, Daily, QC, etc.         │
│   └── 數據隔離 (按 Container)                   │
└─────────────────────────────────────────────────┘
```

---

## 📁 完整文件樹

```
project-root/
│
├── apps/
│   └── web-app/                                    # 主應用
│       ├── src/
│       │   ├── app/
│       │   │   ├── app.component.ts
│       │   │   ├── app.config.ts
│       │   │   └── app.routes.ts
│       │   ├── main.ts
│       │   └── index.html
│       └── project.json
│
├── libs/
│   │
│   ├── bounded-contexts/
│   │   │
│   │   ├── identity-access/                        # 身份與訪問上下文（核心）
│   │   │   ├── domain/
│   │   │   │   ├── aggregates/
│   │   │   │   │   ├── user/
│   │   │   │   │   │   ├── user.aggregate.ts
│   │   │   │   │   │   ├── user.entity.ts
│   │   │   │   │   │   ├── user-organization-membership.entity.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   │
│   │   │   │   │   ├── organization/
│   │   │   │   │   │   ├── organization.aggregate.ts
│   │   │   │   │   │   ├── organization.entity.ts
│   │   │   │   │   │   ├── organization-member.entity.ts
│   │   │   │   │   │   ├── organization-settings.entity.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   │
│   │   │   │   │   ├── bot/
│   │   │   │   │   │   ├── bot.aggregate.ts
│   │   │   │   │   │   ├── bot.entity.ts
│   │   │   │   │   │   ├── bot-credentials.entity.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   │
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── value-objects/
│   │   │   │   │   ├── user-id.vo.ts
│   │   │   │   │   ├── organization-id.vo.ts
│   │   │   │   │   ├── email.vo.ts
│   │   │   │   │   ├── role.vo.ts
│   │   │   │   │   ├── bot-id.vo.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── domain-services/
│   │   │   │   │   ├── authentication.domain-service.ts
│   │   │   │   │   ├── authorization.domain-service.ts
│   │   │   │   │   ├── organization-member-management.domain-service.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── domain-events/
│   │   │   │   │   ├── user/
│   │   │   │   │   │   ├── user-registered.event.ts
│   │   │   │   │   │   ├── user-joined-organization.event.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   │
│   │   │   │   │   ├── organization/
│   │   │   │   │   │   ├── organization-created.event.ts
│   │   │   │   │   │   ├── member-added.event.ts
│   │   │   │   │   │   ├── member-removed.event.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   │
│   │   │   │   │   ├── bot/
│   │   │   │   │   │   ├── bot-created.event.ts
│   │   │   │   │   │   ├── bot-activated.event.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   │
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── repositories/
│   │   │   │   │   ├── user.repository.ts
│   │   │   │   │   ├── organization.repository.ts
│   │   │   │   │   ├── bot.repository.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── specifications/
│   │   │   │   ├── factories/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── application/
│   │   │   │   ├── commands/
│   │   │   │   │   ├── user/
│   │   │   │   │   │   ├── register-user/
│   │   │   │   │   │   ├── join-organization/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   │
│   │   │   │   │   ├── organization/
│   │   │   │   │   │   ├── create-organization/
│   │   │   │   │   │   ├── add-member/
│   │   │   │   │   │   ├── remove-member/
│   │   │   │   │   │   ├── update-member-role/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   │
│   │   │   │   │   ├── bot/
│   │   │   │   │   │   ├── create-bot/
│   │   │   │   │   │   ├── activate-bot/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   │
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── queries/
│   │   │   │   ├── dtos/
│   │   │   │   ├── event-handlers/
│   │   │   │   ├── mappers/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── infrastructure/
│   │   │   │   ├── persistence/
│   │   │   │   ├── messaging/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── presentation/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── register/
│   │   │   │   │   ├── organization-settings/
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── components/
│   │   │   │   ├── stores/
│   │   │   │   ├── identity-access.routes.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── team-management/                         # 團隊管理上下文
│   │   │   ├── domain/
│   │   │   │   ├── aggregates/
│   │   │   │   │   └── team/
│   │   │   │   │       ├── team.aggregate.ts
│   │   │   │   │       ├── team.entity.ts
│   │   │   │   │       ├── team-member.entity.ts
│   │   │   │   │       └── index.ts
│   │   │   │   │
│   │   │   │   ├── value-objects/
│   │   │   │   │   ├── team-id.vo.ts
│   │   │   │   │   ├── team-name.vo.ts
│   │   │   │   │   ├── member-role.vo.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── domain-services/
│   │   │   │   ├── domain-events/
│   │   │   │   │   ├── team-created.event.ts
│   │   │   │   │   ├── member-added-to-team.event.ts
│   │   │   │   │   ├── member-removed-from-team.event.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── repositories/
│   │   │   │   ├── specifications/
│   │   │   │   ├── factories/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   ├── presentation/
│   │   │   └── index.ts
│   │   │
│   │   ├── project-container/                       # 項目容器上下文（核心）
│   │   │   ├── domain/
│   │   │   │   ├── aggregates/
│   │   │   │   │   └── project-container/
│   │   │   │   │       ├── project-container.aggregate.ts
│   │   │   │   │       ├── project-container.entity.ts
│   │   │   │   │       ├── container-settings.entity.ts
│   │   │   │   │       ├── container-member.entity.ts
│   │   │   │   │       └── index.ts
│   │   │   │   │
│   │   │   │   ├── value-objects/
│   │   │   │   │   ├── container-id.vo.ts
│   │   │   │   │   ├── container-name.vo.ts
│   │   │   │   │   ├── container-type.vo.ts          # 容器類型（工程、產品等）
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── domain-services/
│   │   │   │   │   ├── container-access-control.domain-service.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── domain-events/
│   │   │   │   │   ├── container-created.event.ts
│   │   │   │   │   ├── container-archived.event.ts
│   │   │   │   │   ├── member-granted-access.event.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── repositories/
│   │   │   │   ├── specifications/
│   │   │   │   ├── factories/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── application/
│   │   │   │   ├── commands/
│   │   │   │   │   ├── create-container/
│   │   │   │   │   ├── archive-container/
│   │   │   │   │   ├── grant-access/
│   │   │   │   │   ├── revoke-access/
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── queries/
│   │   │   │   │   ├── get-user-containers/
│   │   │   │   │   ├── get-container-members/
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── dtos/
│   │   │   │   ├── event-handlers/
│   │   │   │   ├── mappers/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── infrastructure/
│   │   │   ├── presentation/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── container-list/
│   │   │   │   │   ├── container-create/
│   │   │   │   │   ├── container-settings/
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── components/
│   │   │   │   │   ├── container-selector/          # 容器切換器
│   │   │   │   │   ├── container-card/
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── stores/
│   │   │   │   │   ├── current-container.store.ts   # 當前容器狀態
│   │   │   │   │   ├── user-containers.store.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── overview/                                # 總覽模組
│   │   │   ├── domain/
│   │   │   │   ├── aggregates/
│   │   │   │   │   └── dashboard/
│   │   │   │   │       ├── dashboard.aggregate.ts
│   │   │   │   │       ├── widget.entity.ts
│   │   │   │   │       └── index.ts
│   │   │   │   │
│   │   │   │   ├── value-objects/
│   │   │   │   │   ├── dashboard-id.vo.ts
│   │   │   │   │   ├── widget-type.vo.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── domain-events/
│   │   │   │   ├── repositories/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── application/
│   │   │   │   ├── queries/
│   │   │   │   │   ├── get-dashboard-stats/
│   │   │   │   │   ├── get-recent-activities/
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── event-handlers/                  # 監聽其他上下文事件
│   │   │   │   │   ├── on-task-created.handler.ts
│   │   │   │   │   ├── on-document-created.handler.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── infrastructure/
│   │   │   ├── presentation/
│   │   │   │   ├── pages/
│   │   │   │   │   └── dashboard/
│   │   │   │   │
│   │   │   │   ├── components/
│   │   │   │   │   ├── stats-card/
│   │   │   │   │   ├── activity-timeline/
│   │   │   │   │   ├── task-summary/
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── document-management/                     # 文件管理上下文
│   │   │   ├── domain/
│   │   │   │   ├── aggregates/
│   │   │   │   │   └── document/
│   │   │   │   │       ├── document.aggregate.ts
│   │   │   │   │       ├── document.entity.ts
│   │   │   │   │       ├── document-version.entity.ts
│   │   │   │   │       ├── document-approval.entity.ts
│   │   │   │   │       ├── container-id.vo.ts       # ⭐ 容器ID（隔離數據）
│   │   │   │   │       └── index.ts
│   │   │   │   │
│   │   │   │   ├── value-objects/
│   │   │   │   │   ├── document-id.vo.ts
│   │   │   │   │   ├── document-title.vo.ts
│   │   │   │   │   ├── document-status.vo.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── domain-services/
│   │   │   │   ├── domain-events/
│   │   │   │   │   ├── document-created.event.ts
│   │   │   │   │   ├── document-approved.event.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── repositories/
│   │   │   │   │   └── document.repository.ts       # 查詢時自動過濾 containerId
│   │   │   │   │
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── application/
│   │   │   │   ├── commands/
│   │   │   │   │   ├── create-document/
│   │   │   │   │   │   ├── create-document.command.ts  # 包含 containerId
│   │   │   │   │   │   ├── create-document.handler.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   │
│   │   │   │   │   ├── approve-document/
│   │   │   │   │   ├── reject-document/
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── queries/
│   │   │   │   │   ├── get-documents-by-container/  # ⭐ 按容器查詢
│   │   │   │   │   ├── get-document-by-id/
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── infrastructure/
│   │   │   ├── presentation/
│   │   │   └── index.ts
│   │   │
│   │   ├── task-management/                         # 任務管理上下文
│   │   │   ├── domain/
│   │   │   │   ├── aggregates/
│   │   │   │   │   └── task/
│   │   │   │   │       ├── task.aggregate.ts
│   │   │   │   │       ├── task.entity.ts
│   │   │   │   │       ├── task-assignment.entity.ts
│   │   │   │   │       ├── container-id.vo.ts       # ⭐ 容器ID
│   │   │   │   │       └── index.ts
│   │   │   │   │
│   │   │   │   ├── value-objects/
│   │   │   │   ├── domain-services/
│   │   │   │   ├── domain-events/
│   │   │   │   ├── repositories/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   ├── presentation/
│   │   │   └── index.ts
│   │   │
│   │   ├── daily-record/                            # 每日紀錄上下文
│   │   │   ├── domain/
│   │   │   │   ├── aggregates/
│   │   │   │   │   └── daily-record/
│   │   │   │   │       ├── daily-record.aggregate.ts
│   │   │   │   │       ├── container-id.vo.ts       # ⭐ 容器ID
│   │   │   │   │       └── index.ts
│   │   │   │   │
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   ├── presentation/
│   │   │   └── index.ts
│   │   │
│   │   ├── quality-control/                         # 質檢上下文
│   │   │   ├── domain/
│   │   │   │   ├── aggregates/
│   │   │   │   │   └── qc-check/
│   │   │   │   │       ├── qc-check.aggregate.ts
│   │   │   │   │       ├── container-id.vo.ts       # ⭐ 容器ID
│   │   │   │   │       └── index.ts
│   │   │   │   │
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   ├── presentation/
│   │   │   └── index.ts
│   │   │
│   │   ├── acceptance/                              # 驗收上下文
│   │   │   ├── domain/
│   │   │   │   ├── aggregates/
│   │   │   │   │   └── acceptance/
│   │   │   │   │       ├── acceptance.aggregate.ts
│   │   │   │   │       ├── container-id.vo.ts       # ⭐ 容器ID
│   │   │   │   │       └── index.ts
│   │   │   │   │
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   ├── presentation/
│   │   │   └── index.ts
│   │   │
│   │   ├── issue-tracking/                          # 問題單上下文
│   │   │   ├── domain/
│   │   │   │   ├── aggregates/
│   │   │   │   │   └── issue/
│   │   │   │   │       ├── issue.aggregate.ts
│   │   │   │   │       ├── container-id.vo.ts       # ⭐ 容器ID
│   │   │   │   │       └── index.ts
│   │   │   │   │
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   ├── presentation/
│   │   │   └── index.ts
│   │   │
│   │   ├── member-management/                       # 成員管理上下文
│   │   │   ├── domain/
│   │   │   │   ├── aggregates/
│   │   │   │   │   └── member/
│   │   │   │   │       ├── member.aggregate.ts
│   │   │   │   │       ├── member-profile.entity.ts
│   │   │   │   │       ├── member-stats.entity.ts
│   │   │   │   │       └── index.ts
│   │   │   │   │
│   │   │   │   ├── domain-events/
│   │   │   │   │   ├── member-invited.event.ts
│   │   │   │   │   ├── member-joined.event.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── application/
│   │   │   │   ├── event-handlers/                  # 監聽其他事件更新統計
│   │   │   │   │   ├── on-task-assigned.handler.ts
│   │   │   │   │   ├── on-task-completed.handler.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── infrastructure/
│   │   │   ├── presentation/
│   │   │   └── index.ts
│   │   │
│   │   ├── permission-management/                   # 權限管理上下文
│   │   │   ├── domain/
│   │   │   │   ├── aggregates/
│   │   │   │   │   └── permission/
│   │   │   │   │       ├── role.aggregate.ts
│   │   │   │   │       ├── permission.entity.ts
│   │   │   │   │       ├── role-permission.entity.ts
│   │   │   │   │       └── index.ts
│   │   │   │   │
│   │   │   │   ├── value-objects/
│   │   │   │   │   ├── role-id.vo.ts
│   │   │   │   │   ├── permission-name.vo.ts
│   │   │   │   │   ├── resource.vo.ts
│   │   │   │   │   ├── action.vo.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── domain-services/
│   │   │   │   │   ├── permission-checker.domain-service.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   ├── presentation/
│   │   │   └── index.ts
│   │   │
│   │   ├── audit-logging/                           # 審計日誌上下文
│   │   │   ├── domain/
│   │   │   │   ├── aggregates/
│   │   │   │   │   └── audit-log/
│   │   │   │   │       ├── audit-log.aggregate.ts
│   │   │   │   │       ├── audit-entry.entity.ts
│   │   │   │   │       └── index.ts
│   │   │   │   │
│   │   │   │   ├── value-objects/
│   │   │   │   │   ├── action-type.vo.ts
│   │   │   │   │   ├── resource-type.vo.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── application/
│   │   │   │   ├── event-handlers/                  # ⭐ 監聽所有領域事件
│   │   │   │   │   ├── on-any-domain-event.handler.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── infrastructure/
│   │   │   ├── presentation/
│   │   │   └── index.ts
│   │   │
│   │   └── settings-management/                     # 設置管理上下文
│   │       ├── domain/
│   │       │   ├── aggregates/
│   │       │   │   └── settings/
│   │       │   │       ├── system-settings.aggregate.ts
│   │       │   │       ├── organization-settings.aggregate.ts
│   │       │   │       ├── container-settings.aggregate.ts
│   │       │   │       └── index.ts
│   │       │   │
│   │       │   └── index.ts
│   │       │
│   │       ├── application/
│   │       ├── infrastructure/
│   │       ├── presentation/
│   │       └── index.ts
│   │
│   ├── shared-kernel/                               # 共享內核
│   │   ├── domain/
│   │   │   ├── base/
│   │   │   │   ├── entity.base.ts
│   │   │   │   ├── aggregate-root.base.ts
│   │   │   │   ├── value-object.base.ts
│   │   │   │   ├── domain-event.base.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── common-value-objects/
│   │   │   │   ├── container-id.vo.ts               # ⭐ 共享的容器ID
│   │   │   │   ├── organization-id.vo.ts            # ⭐ 共享的組織ID
│   │   │   │   ├── user-id.vo.ts                    # ⭐ 共享的用戶ID
│   │   │   │   ├── email.vo.ts
│   │   │   │   ├── date-range.vo.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── application/
│   │   │   ├── base/
│   │   │   ├── interfaces/
│   │   │   └── index.ts
│   │   │
│   │   ├── infrastructure/
│   │   │   ├── event-bus/                           # ⭐ Event Bus 核心
│   │   │   │   ├── event-bus.interface.ts
│   │   │   │   ├── event-bus.service.ts
│   │   │   │   ├── event-store.service.ts           # ⭐ Event Store
│   │   │   │   ├── event-metadata.ts                # ⭐ Event Metadata
│   │   │   │   ├── event-types.ts                   # ⭐ Event Types
│   │   │   │   ├── causality-tracker.service.ts     # ⭐ Causality Tracking
│   │   │   │   ├── domain-event-publisher.service.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── messaging/
│   │   │   │   ├── command-bus.service.ts
│   │   │   │   ├── query-bus.service.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── shared/                                       # 共享 UI
│   │   ├── ui/
│   │   │   ├── components/
│   │   │   ├── directives/
│   │   │   ├── pipes/
│   │   │   └── index.ts
│   │   │
│   │   ├── context/                                  # ⭐ 上下文管理
│   │   │   ├── current-context.store.ts             # 當前上下文（組織/容器/用戶）
│   │   │   ├── context-provider.service.ts
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   └── anti-corruption-layer/                       # 防腐層
│       ├── task-to-audit/
│       ├── document-to-qc/
│       └── index.ts
│
├── nx.json
├── tsconfig.base.json
├── package.json
└── README.md
```

---

## 🎯 核心概念實現

### 1. 多租戶 + 邏輯容器架構

```typescript
// shared-kernel/domain/common-value-objects/container-id.vo.ts
export class ContainerId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  static create(value?: string): ContainerId {
    return new ContainerId(value || uuid());
  }

  get value(): string {
    return this.props.value;
  }
}

// shared/context/current-context.store.ts
export const CurrentContextStore = signalStore(
  { providedIn: 'root' },
  withState({
    currentUserId: null as string | null,
    currentOrganizationId: null as string | null,
    currentContainerId: null as string | null,      // ⭐ 當前容器
    availableContainers: [] as Container[]
  }),
  withMethods((store) => ({
    switchContainer(containerId: string) {
      patchState(store, { currentContainerId: containerId });
      
      // 發布容器切換事件
      const eventBus = inject(EventBusService);
      eventBus.publish(new ContainerSwitchedEvent(containerId));
    },
    
    switchOrganization(organizationId: string) {
      patchState(store, { 
        currentOrganizationId: organizationId,
        currentContainerId: null  // 切換組織時清空容器
      });
    }
  }))
);
```

### 2. 容器隔離的領域模型

```typescript
// document-management/domain/aggregates/document/document.aggregate.ts
export class DocumentAggregate extends AggregateRoot {
  private constructor(
    public readonly id: DocumentId,
    public readonly containerId: ContainerId,      // ⭐ 必須屬於容器
    public readonly organizationId: OrganizationId, // ⭐ 必須屬於組織
    public title: DocumentTitle,
    public status: DocumentStatus,
    public createdBy: UserId,
    private readonly createdAt: Date
  ) {
    super();
  }

  static create(data: {
    containerId: ContainerId;
    organizationId: OrganizationId;
    title: string;
    createdBy: UserId;
  }): Result<DocumentAggregate> {
    // 驗證
    const titleOrError = DocumentTitle.create(data.title);
    if (titleOrError.isFailure) {
      return Result.fail(titleOrError.error);
    }

    const document = new DocumentAggregate(
      DocumentId.create(),
      data.containerId,
      data.organizationId,
      titleOrError.getValue(),
      DocumentStatus.draft(),
      data.createdBy,
      new Date()
    );

    // 發布領域事件
    document.addDomainEvent(
      new DocumentCreatedEvent({
        documentId: document.id,
        containerId: document.containerId,     // ⭐ 事件包含容器信息
        organizationId: document.organizationId,
        title: document.title.value,
        createdBy: document.createdBy
      })
    );

    return Result.ok(document);
  }
}
```

### 3. 容器感知的倉儲

```typescript
// document-management/infrastructure/persistence/repositories/firestore-document.repository.ts
@Injectable()
export class FirestoreDocumentRepository implements IDocumentRepository {
  private currentContext = inject(CurrentContextStore);

  async findByContainerId(containerId: ContainerId): Promise<DocumentAggregate[]> {
    const q = query(
      collection(this.firestore, 'documents'),
      where('containerId', '==', containerId.value),
      where('organizationId', '==', this.currentContext.currentOrganizationId()),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapper.toDomain(doc.data()));
  }

  async save(document: DocumentAggregate): Promise<void> {
    // 驗證容器匹配
    if (document.containerId.value !== this.currentContext.currentContainerId()) {
      throw new Error('Cannot save document to different container');
    }

    const data = this.mapper.toPersistence(document);
    await setDoc(doc(this.firestore, 'documents', document.id.value), data);

    // 發布領域事件
    this.domainEventPublisher.publishEventsForAggregate(document);
  }
}
```

### 4. Event Store + Causality Tracking

```typescript
// shared-kernel/infrastructure/event-bus/event-metadata.ts
export interface EventMetadata {
  eventId: string;
  eventType: string;
  timestamp: number;
  
  // ⭐ 上下文信息
  organizationId: string;
  containerId?: string;
  userId: string;
  
  // ⭐ 因果追蹤
  causationId?: string;      // 導致此事件的事件ID
  correlationId?: string;    // 業務流程ID
  
  // 事件版本
  version: string;
  
  // 來源
  source: string;
}

// shared-kernel/infrastructure/event-bus/event-store.service.ts
@Injectable({ providedIn: 'root' })
export class EventStoreService {
  private firestore = inject(Firestore);
  private currentContext = inject(CurrentContextStore);

  async append<T>(event: DomainEvent<T>): Promise<void> {
    const metadata: EventMetadata = {
      eventId: uuid(),
      eventType: event.eventType,
      timestamp: Date.now(),
      organizationId: this.currentContext.currentOrganizationId()!,
      containerId: this.currentContext.currentContainerId() ?? undefined,
      userId: this.currentContext.currentUserId()!,
      causationId: event.causationId,
      correlationId: event.correlationId ?? uuid(),
      version: '1.0.0',
      source: event.source
    };

    await addDoc(collection(this.firestore, 'events'), {
      ...metadata,
      payload: event.payload
    });
  }

  // ⭐ 查詢事件鏈
  async getEventChain(correlationId: string): Promise<DomainEvent[]> {
    const q = query(
      collection(this.firestore, 'events'),
      where('correlationId', '==', correlationId),
      orderBy('timestamp', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToDomainEvent(doc.data()));
  }

  // ⭐ 按容器查詢事件
  async getEventsByContainer(
    containerId: string,
    eventType?: string
  ): Promise<DomainEvent[]> {
    let q = query(
      collection(this.firestore, 'events'),
      where('containerId', '==', containerId)
    );

    if (eventType) {
      q = query(q, where('eventType', '==', eventType));
    }

    q = query(q, orderBy('timestamp', 'desc'), limit(100));

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToDomainEvent(doc.data()));
  }
}
```

### 5. Event Bus 跨上下文通訊

```typescript
// shared-kernel/infrastructure/event-bus/event-bus.service.ts
export const EventBusStore = signalStore(
  { providedIn: 'root' },
  withState({
    events: [] as DomainEvent[],
    lastEvent: null as DomainEvent | null
  }),
  withMethods((store) => {
    const eventStore = inject(EventStoreService);
    const eventStream$ = new Subject<DomainEvent>();

    return {
      // 發布事件
      async publish<T>(event: DomainEvent<T>): Promise<void> {
        // 1. 持久化到 Event Store
        await eventStore.append(event);

        // 2. 發布到內存事件流
        patchState(store, (state) => ({
          events: [...state.events, event],
          lastEvent: event
        }));
        eventStream$.next(event);
      },

      // 訂閱特定事件類型
      subscribe(eventType: string, handler: (event: DomainEvent) => void) {
        return eventStream$
          .pipe(filter(event => event.eventType === eventType))
          .subscribe(handler);
      },

      // 訂閱事件模式
      subscribeToPattern(pattern: RegExp, handler: (event: DomainEvent) => void) {
        return eventStream$
          .pipe(filter(event => pattern.test(event.eventType)))
          .subscribe(handler);
      },

      // ⭐ 訂閱特定容器的事件
      subscribeToContainer(
        containerId: string,
        handler: (event: DomainEvent) => void
      ) {
        return eventStream$
          .pipe(
            filter(event => event.metadata.containerId === containerId)
          )
          .subscribe(handler);
      }
    };
  })
);
```

### 6. 審計日誌自動記錄

```typescript
// audit-logging/application/event-handlers/on-any-domain-event.handler.ts
@Injectable()
export class OnAnyDomainEventHandler {
  private eventBus = inject(EventBusStore);
  private auditRepo = inject(AuditLogRepository);

  constructor() {
    // ⭐ 訂閱所有領域事件
    this.eventBus.subscribeToPattern(/.+/, async (event) => {
      await this.handleDomainEvent(event);
    });
  }

  private async handleDomainEvent(event: DomainEvent): Promise<void> {
    // 創建審計日誌
    const auditLog = AuditLogAggregate.create({
      eventId: event.metadata.eventId,
      eventType: event.eventType,
      userId: event.metadata.userId,
      organizationId: event.metadata.organizationId,
      containerId: event.metadata.containerId,
      action: this.extractAction(event.eventType),
      resource: this.extractResource(event.eventType),
      metadata: event.metadata,
      payload: event.payload,
      timestamp: new Date(event.metadata.timestamp)
    });

    if (auditLog.isSuccess) {
      await this.auditRepo.save(auditLog.getValue());
    }
  }

  private extractAction(eventType: string): string {
    // document.created -> created
    return eventType.split('.')[1];
  }

  private extractResource(eventType: string): string {
    // document.created -> document
    return eventType.split('.')[0];
  }
}
```

---

## 🎯 使用示例

### 場景：用戶在容器中創建文件

```typescript
// 1. 用戶切換容器
currentContextStore.switchContainer('container-123');

// 2. 創建文件（自動關聯容器）
const command = new CreateDocumentCommand({
  containerId: currentContextStore.currentContainerId()!,
  organizationId: currentContextStore.currentOrganizationId()!,
  title: '項目需求文檔',
  createdBy: currentContextStore.currentUserId()!
});

await commandBus.execute(command);

// 3. 事件自動流轉
// DocumentCreatedEvent 
//   → EventStore 持久化
//   → EventBus 發布
//   → AuditLog 自動記錄
//   → Overview 更新統計
//   → QC 觸發檢查（如果配置）
```

---

## 📈 總檔案數統計

```
總計: ~950-1050 個檔案

分布:
├── Identity & Access          : 80 檔案
├── Team Management            : 60 檔案
├── Project Container (核心)   : 80 檔案
├── Overview                   : 50 檔案
├── Document Management        : 90 檔案
├── Task Management            : 90 檔案
├── Daily Record               : 70 檔案
├── Quality Control            : 80 檔案
├── Acceptance                 : 70 檔案
├── Issue Tracking             : 80 檔案
├── Member Management          : 60 檔案
├── Permission Management      : 70 檔案
├── Audit Logging              : 60 檔案
├── Settings Management        : 60 檔案
├── Shared Kernel              : 80 檔案
└── Shared UI + ACL            : 80 檔案
```

這個架構**完全支持**你的所有需求：
- ✅ 用戶/組織/Bot 多層級
- ✅ 組織可擴展團隊
- ✅ 多個邏輯容器（Project Container）
- ✅ 11個業務模組
- ✅ 完整 Event-Driven
- ✅ Event Sourcing + Causality Tracking

需要我繼續展開某個部分的具體實現嗎？🚀
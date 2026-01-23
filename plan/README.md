# Implementation Plans Directory

This directory contains structured implementation plans for refactoring and feature development in the Black-Tortoise Angular project.

## Available Plans

### 1. Workspace DDD Layer Refactoring (v1.0)
**File**: `refactor-workspace-ddd-layers-1.md`
**Status**: Planned
**Goal**: Refactor workspace-related code to proper DDD layers

**Quick Summary:**
- Eliminates duplication between WorkspaceEntity and WorkspaceAggregate
- Consolidates workspace state in Application layer (WorkspaceContextStore)
- Enforces proper layer boundaries (Domain ← Application ← Infrastructure/Presentation)
- 7 phases with 38 incremental tasks

**Key Changes:**
1. Merge workspace.entity.ts and workspace.aggregate.ts into single domain model
2. Remove domain WorkspaceContext (move state to application layer)
3. Update all imports across layers to use consolidated types
4. Verify no presentation → domain violations

**Start Here:**
- Phase 1, Task 1: Review differences between entity and aggregate files
- Use checklist format - mark tasks complete with ✅ and date

## Plan Naming Convention

```
[purpose]-[component]-[version].md
```

**Purpose prefixes:**
- `refactor` - Code structure improvements
- `feature` - New functionality
- `upgrade` - Dependency/framework upgrades
- `architecture` - Architectural changes

**Examples:**
- `refactor-workspace-ddd-layers-1.md`
- `feature-workspace-templates-1.md`
- `upgrade-angular-21-1.md`

## Using Plans

1. **Read the plan** - Review all sections before starting
2. **Follow phases sequentially** - Each phase builds on previous
3. **Mark progress** - Update Completed and Date columns
4. **Verify after each phase** - Run build/tests before moving on
5. **Update status** - Change front matter status when progressing

## Plan Template

All plans follow the standardized template with these sections:
- Front matter (YAML)
- Introduction with status badge
- Requirements & Constraints
- Implementation Steps (phased tasks)
- Alternatives
- Dependencies
- Files
- Testing
- Risks & Assumptions
- Related Specifications

## Architecture References

- `../QUICK_START_DDD.md` - DDD layer rules and patterns
- `../DDD_ARCHITECTURE_AUDIT_EXECUTIVE_SUMMARY.md` - Architecture audit results
- `../integrated-system-spec.md` - System-wide specifications

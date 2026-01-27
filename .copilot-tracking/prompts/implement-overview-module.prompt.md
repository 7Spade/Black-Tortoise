---
mode: agent
model: Claude Sonnet 4
---

<!-- markdownlint-disable-file -->

# Implementation Prompt: Overview Module Architecture Compliance

## Implementation Instructions

### Step 1: Create Changes Tracking File

You WILL create `20260127-overview-module-implementation-changes.md` in #file:./.copilot-tracking/changes/ if it does not exist.

### Step 2: Execute Implementation

You WILL follow #file:../../.github/instructions/task-implementation.instructions.md
You WILL systematically implement #file:./.copilot-tracking/plans/20260127-overview-module-implementation-plan.instructions.md task-by-task
You WILL follow ALL project standards and conventions

**CRITICAL**: If ${input:phaseStop:true} is true, you WILL stop after each Phase for user review.
**CRITICAL**: If ${input:taskStop:false} is true, you WILL stop after each Task for user review.

### Step 3: Cleanup

When ALL Phases are checked off (`[x]`) and completed you WILL do the following:

1. You WILL provide a markdown style link and a summary of all changes from #file:./.copilot-tracking/changes/20260127-overview-module-implementation-changes.md to the user:

   - You WILL keep the overall summary brief
   - You WILL add spacing around any lists
   - You MUST wrap any reference to a file in a markdown style link

2. You WILL provide markdown style links to [.copilot-tracking/plans/20260127-overview-module-implementation-plan.instructions.md](.copilot-tracking/plans/20260127-overview-module-implementation-plan.instructions.md), [.copilot-tracking/details/20260127-overview-module-implementation-details.md](.copilot-tracking/details/20260127-overview-module-implementation-details.md), and [.copilot-tracking/research/20260127-overview-module-implementation-research.md](.copilot-tracking/research/20260127-overview-module-implementation-research.md) documents. You WILL recommend cleaning these files up as well.

3. **MANDATORY**: You WILL attempt to delete .copilot-tracking/prompts/implement-overview-module.prompt.md

## Success Criteria

- [ ] Changes tracking file created
- [ ] All plan items implemented with working code
- [ ] All detailed specifications satisfied
- [ ] Project conventions followed
- [ ] Changes file updated continuously
- [ ] Component only injects OverviewStore (no direct module store injections)
- [ ] Event subscriptions implemented in store withHooks
- [ ] OverviewContextProvider created and implemented
- [ ] All existing functionality works identically
- [ ] All tests passing

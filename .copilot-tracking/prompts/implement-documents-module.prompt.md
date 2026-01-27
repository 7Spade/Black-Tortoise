---
mode: agent
model: Claude Sonnet 4
---

<!-- markdownlint-disable-file -->

# Implementation Prompt: Documents Module

## Implementation Instructions

### Step 1: Create Changes Tracking File

You WILL create `20260127-documents-module-changes.md` in #file:../changes/ if it does not exist.

### Step 2: Execute Implementation

You WILL follow #file:../../.github/instructions/task-implementation.instructions.md
You WILL systematically implement #file:../plans/20260127-documents-module-plan.instructions.md task-by-task
You WILL follow ALL project standards and conventions:
- #file:../../.github/instructions/strict-ddd-architecture.instructions.md
- #file:../../.github/instructions/ddd-architecture.instructions.md
- #file:../../.github/instructions/angular-material-best-practices.instructions.md
- #file:../../.github/instructions/a11y.instructions.md
- #file:../../.github/instructions/event-sourcing-and-causality.instructions.md

**CRITICAL**: If ${input:phaseStop:true} is true, you WILL stop after each Phase for user review.
**CRITICAL**: If ${input:taskStop:false} is true, you WILL stop after each Task for user review.

### Step 3: Cleanup

When ALL Phases are checked off (`[x]`) and completed you WILL do the following:

1. You WILL provide a markdown style link and a summary of all changes from #file:../changes/20260127-documents-module-changes.md to the user:

   - You WILL keep the overall summary brief
   - You WILL add spacing around any lists
   - You MUST wrap any reference to a file in a markdown style link

2. You WILL provide markdown style links to .copilot-tracking/plans/20260127-documents-module-plan.instructions.md, .copilot-tracking/details/20260127-documents-module-details.md, and .copilot-tracking/research/20260127-documents-module-research.md documents. You WILL recommend cleaning these files up as well.
3. **MANDATORY**: You WILL attempt to delete .copilot-tracking/prompts/implement-documents-module.prompt.md

## Success Criteria

- [ ] Changes tracking file created
- [ ] All plan items implemented with working code
- [ ] All detailed specifications satisfied
- [ ] Project conventions followed
- [ ] DDD layering strictly enforced
- [ ] Angular 20+ patterns used (@if/@for/@switch, signals, OnPush)
- [ ] File tree fully functional with drag-drop
- [ ] Upload with progress tracking works
- [ ] Search and filter operational
- [ ] File preview dialogs work
- [ ] Keyboard navigation implemented
- [ ] All events published with correlation IDs
- [ ] Tests written and passing
- [ ] Accessibility validated
- [ ] Performance targets met
- [ ] Changes file updated continuously

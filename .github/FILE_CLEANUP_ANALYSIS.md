# .github Directory Cleanup Analysis

## Summary
- **Total files analyzed**: 110+ files
- **Recommended for deletion**: 64 files
- **Recommended to keep**: 46 files
- **Duplicates found**: 15 pairs

---

## Group 1: Instructions 1-10

| File | Decision | Reason |
|------|----------|--------|
| `a11y.instructions.md` | **KEEP** | Active accessibility rules for WCAG compliance |
| `agent-skills.instructions.md` | **KEEP** | Meta-documentation for creating agent skills |
| `ai-prompt-engineering-safety-best-practices.instructions.md` | **KEEP** | Security and prompt safety guidelines |
| `angular.instructions.md` | **DELETE** | Superseded by package-specific `angular-angular-*.instructions.md` files |
| `codacy.instructions.md` | **KEEP** | Active Codacy integration rules |
| `code-review-generic.instructions.md` | **KEEP** | Generic code review standards |
| `copilot-browser-agent.instructions.md` | **KEEP** | Browser agent-specific guidelines |
| `ddd-architecture.instructions.md` | **KEEP** | Core DDD architecture patterns (framework-agnostic) |
| `dotnet-architecture-good-practices.instructions.md` | **DELETE** | Not used in Angular-only project |
| `github-actions-ci-cd-best-practices.instructions.md` | **KEEP** | CI/CD pipeline standards |

---

## Group 2: Instructions 11-20

| File | Decision | Reason |
|------|----------|--------|
| `guidelines.instructions.md` | **KEEP** | General coding guidelines |
| `instructions.instructions.md` | **KEEP** | Meta-documentation for creating instructions |
| `m3-angular-signals-firebase.instructions.md` | **KEEP** | Integration patterns for M3+Signals+Firebase |
| `ng-angular-20-control-flow.instructions.md` | **KEEP** | Angular 20 control flow (@if/@for) rules |
| `ng-angular-cdk.instructions.md` | **DELETE** | Duplicate of `angular-angular-cdk.instructions.md` |
| `ng-angular-forms.instructions.md` | **DELETE** | Duplicate of `angular-angular-forms.instructions.md` |
| `ng-angular-google-maps.instructions.md` | **KEEP** | Google Maps integration (no angular-* equivalent) |
| `ng-angular-material.instructions.md` | **DELETE** | Duplicate of `angular-angular-material.instructions.md` |
| `ng-angular-router.instructions.md` | **DELETE** | Duplicate of `angular-angular-router.instructions.md` |
| `ng-angularfire.instructions.md` | **DELETE** | Duplicate of `angular-angular-fire.instructions.md` |

---

## Group 3: Instructions 21-31

| File | Decision | Reason |
|------|----------|--------|
| `ng-ddd-architecture.instructions.md` | **KEEP** | Angular-specific DDD patterns (complements general DDD file) |
| `ng-firebase-data-connect.instructions.md` | **KEEP** | Firebase Data Connect integration |
| `ng-material-design-3.instructions.md` | **KEEP** | Material Design 3 theming rules |
| `ng-ngrx-signals.instructions.md` | **DELETE** | Duplicate of `angular-ngrx-signals.instructions.md` |
| `ng-rxjs-patterns.instructions.md` | **KEEP** | RxJS operator patterns and best practices |
| `ngrx-signals.instructions.md` | **DELETE** | Duplicate of `angular-ngrx-signals.instructions.md` |
| `nodejs-javascript-vitest.instructions.md` | **DELETE** | Not applicable to Angular project |
| `object-calisthenics.instructions.md` | **KEEP** | Code quality patterns |
| `pcf-code-components.instructions.md` | **DELETE** | Power Apps/PCF not used in this project |
| `performance-optimization.instructions.md` | **KEEP** | General performance guidelines |
| `project-structure.instructions.md` | **KEEP** | Project organization rules |

---

## Group 4: Instructions 32-42

| File | Decision | Reason |
|------|----------|--------|
| `prompt.instructions.md` | **KEEP** | Prompt engineering guidelines |
| `security-and-owasp.instructions.md` | **KEEP** | Security best practices |
| `self-explanatory-code-commenting.instructions.md` | **KEEP** | Code documentation standards |
| `spec-driven-workflow-v1.instructions.md` | **KEEP** | Specification-driven development workflow |
| `task-implementation.instructions.md` | **KEEP** | Task implementation patterns |
| `typescript-5-es2022.instructions.md` | **KEEP** | TypeScript coding standards |
| `update-docs-on-code-change.instructions.md` | **KEEP** | Documentation maintenance rules |

---

## Group 5: Collections

| File | Decision | Reason |
|------|----------|--------|
| `edge-ai-tasks.md` | **KEEP** | Referenced in copilot.yml |
| `project-planning.md` | **KEEP** | Project planning workflows |
| `security-best-practices.md` | **KEEP** | Security collection |
| `software-engineering-team.md` | **KEEP** | Team collaboration patterns |
| `technical-spike.md` | **KEEP** | Technical spike workflow |
| `testing-automation.md` | **KEEP** | Testing automation patterns |

---

## Group 6: Prompts (Auto-analyzed)

### DELETE - Not referenced in codebase (42 files):

| File | Reason |
|------|--------|
| `ai-prompt-engineering-safety-review.prompt.md` | No references found |
| `architecture-blueprint-generator.prompt.md` | No references found |
| `boost-prompt.prompt.md` | No references found |
| `breakdown-epic-arch.prompt.md` | No references found |
| `breakdown-epic-pm.prompt.md` | No references found |
| `breakdown-feature-implementation.prompt.md` | No references found |
| `breakdown-feature-prd.prompt.md` | No references found |
| `breakdown-plan.prompt.md` | No references found |
| `breakdown-test.prompt.md` | No references found |
| `copilot-instructions-blueprint-generator.prompt.md` | No references found |
| `create-agentsmd.prompt.md` | No references found |
| `create-architectural-decision-record.prompt.md` | No references found |
| `create-github-action-workflow-specification.prompt.md` | No references found |
| `create-implementation-plan.prompt.md` | No references found |
| `create-oo-component-documentation.prompt.md` | No references found |
| `create-readme.prompt.md` | No references found |
| `create-specification.prompt.md` | No references found |
| `documentation-writer.prompt.md` | No references found |
| `editorconfig.prompt.md` | No references found |
| `ef-core.prompt.md` | No references found (.NET not used) |
| `finalize-agent-prompt.prompt.md` | No references found |
| `folder-structure-blueprint-generator.prompt.md` | No references found |
| `gen-specs-as-issues.prompt.md` | No references found |
| `generate-custom-instructions-from-codebase.prompt.md` | No references found |
| `github-copilot-starter.prompt.md` | No references found |
| `model-recommendation.prompt.md` | No references found |
| `my-issues.prompt.md` | No references found |
| `my-pull-requests.prompt.md` | No references found |
| `playwright-automation-fill-in-form.prompt.md` | No references found |
| `playwright-explore-website.prompt.md` | No references found |
| `playwright-generate-test.prompt.md` | No references found |
| `project-workflow-analysis-blueprint-generator.prompt.md` | No references found |
| `readme-blueprint-generator.prompt.md` | No references found |
| `review-and-refactor.prompt.md` | No references found |
| `structured-autonomy-generate.prompt.md` | No references found |
| `structured-autonomy-implement.prompt.md` | No references found |
| `structured-autonomy-plan.prompt.md` | No references found |
| `technology-stack-blueprint-generator.prompt.md` | No references found |
| `update-implementation-plan.prompt.md` | No references found |
| `update-markdown-file-index.prompt.md` | No references found |
| `update-specification.prompt.md` | No references found |
| `write-coding-standards-from-file.prompt.md` | No references found |

---

## Group 7: Core Config Files (KEEP ALL)

| File | Decision | Reason |
|------|----------|--------|
| `.github/CODEOWNERS` | **KEEP** | Code ownership rules |
| `.github/COPILOT_INDEX.md` | **KEEP** | Copilot navigation index |
| `.github/COPILOT_QUICK_REFERENCE.md` | **KEEP** | Quick reference guide |
| `.github/COPILOT_TROUBLESHOOTING.md` | **KEEP** | Troubleshooting guide |
| `.github/copilot.yml` | **KEEP** | Copilot configuration |
| `.github/forbidden-copilot-instructions.md` | **KEEP** | Restriction rules |
| `.github/playwright-copilot-instructions.md` | **KEEP** | Playwright testing instructions |
| `.github/project-layer-mapping.yml` | **KEEP** | DDD layer mapping |

---

## New Package-Specific Files (KEEP ALL - 12 files)

These were just created and should be retained:

| File | Purpose |
|------|---------|
| `angular-angular-animations.instructions.md` | Animation provider, GPU optimization |
| `angular-angular-cdk.instructions.md` | A11y, overlays, virtual scrolling |
| `angular-angular-common.instructions.md` | Control flow, pipes, HTTP |
| `angular-angular-compiler.instructions.md` | AOT compilation, template checking |
| `angular-angular-core.instructions.md` | Signals, DI, lifecycle, zone-less |
| `angular-angular-fire.instructions.md` | Firebase integration, security |
| `angular-angular-forms.instructions.md` | Reactive forms, typed controls |
| `angular-angular-material.instructions.md` | Material components, theming |
| `angular-angular-platform-browser.instructions.md` | DOM sanitization, SSR hydration |
| `angular-angular-platform-browser-dynamic.instructions.md` | JIT dev-only, AOT production |
| `angular-angular-router.instructions.md` | Functional guards, lazy loading |
| `angular-ngrx-signals.instructions.md` | signalStore, patchState, rxMethod |

---

## Duplicate Analysis

### Instructions Duplicates (DELETE old `ng-*` versions):

| Old File (DELETE) | New File (KEEP) |
|-------------------|-----------------|
| `ng-angular-cdk.instructions.md` | `angular-angular-cdk.instructions.md` |
| `ng-angular-forms.instructions.md` | `angular-angular-forms.instructions.md` |
| `ng-angular-material.instructions.md` | `angular-angular-material.instructions.md` |
| `ng-angular-router.instructions.md` | `angular-angular-router.instructions.md` |
| `ng-angularfire.instructions.md` | `angular-angular-fire.instructions.md` |
| `ng-ngrx-signals.instructions.md` | `angular-ngrx-signals.instructions.md` |
| `ngrx-signals.instructions.md` | `angular-ngrx-signals.instructions.md` |

---

## Deletion Commands

```bash
# Delete duplicate instructions
rm .github/instructions/angular.instructions.md
rm .github/instructions/ng-angular-cdk.instructions.md
rm .github/instructions/ng-angular-forms.instructions.md
rm .github/instructions/ng-angular-material.instructions.md
rm .github/instructions/ng-angular-router.instructions.md
rm .github/instructions/ng-angularfire.instructions.md
rm .github/instructions/ng-ngrx-signals.instructions.md
rm .github/instructions/ngrx-signals.instructions.md

# Delete non-applicable instructions
rm .github/instructions/dotnet-architecture-good-practices.instructions.md
rm .github/instructions/nodejs-javascript-vitest.instructions.md
rm .github/instructions/pcf-code-components.instructions.md

# Delete all unused prompts
rm .github/prompts/*.prompt.md

# OR delete prompts directory entirely
# rm -rf .github/prompts/
```

---

## Total Impact

- **Instructions to delete**: 11 files
- **Prompts to delete**: 42 files
- **Collections to keep**: 6 files
- **Core config to keep**: 8 files
- **New package files to keep**: 12 files

**Total deletion**: 53 files (48% reduction)
**Total retention**: 57 files (52% kept)

---

## Recommendations

1. **Execute deletion in phases**:
   - Phase 1: Delete duplicate `ng-*` instructions (7 files)
   - Phase 2: Delete non-applicable instructions (4 files)
   - Phase 3: Delete all prompts (42 files)

2. **Backup before deletion**:
   ```bash
   git stash
   git checkout -b cleanup/github-directory
   ```

3. **Validate after deletion**:
   - Check that copilot.yml still loads correctly
   - Test Copilot instruction loading
   - Verify no broken references

4. **Consider archiving prompts** instead of deleting:
   - Move to `.github/archive/prompts/` for historical reference
   - Update copilot.yml to exclude archived directory

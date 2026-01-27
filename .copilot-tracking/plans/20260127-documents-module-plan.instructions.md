---
applyTo: ".copilot-tracking/changes/20260127-documents-module-changes.md"
---

<!-- markdownlint-disable-file -->

# Task Checklist: Documents Module Implementation

## Overview

Implement comprehensive Documents Module with file tree management, folder operations, drag-drop organization, batch uploads with progress tracking, search/filter capabilities, and file preview functionality following strict DDD architecture and Angular 20+ best practices.

## Objectives

- Implement file tree structure with folder hierarchy (max 10 levels deep)
- Enable drag-drop file/folder organization using Angular CDK
- Support batch file uploads with individual progress tracking
- Provide search and advanced filtering capabilities
- Implement file preview dialogs with deferred loading
- Ensure full keyboard navigation and screen reader accessibility
- Publish domain events for cross-module integration
- Follow strict DDD layering and modern Angular patterns

## Research Summary

### Project Files

- src/app/domain/aggregates/document.aggregate.ts - Existing functional aggregate (needs class-based refactor)
- src/app/application/stores/documents.store.ts - Basic signalStore (needs tree structure)
- src/app/presentation/pages/modules/documents/documents.component.ts - Simple upload UI (needs tree component)
- src/app/domain/events/document-uploaded.event.ts - Event structure already defined
- src/app/infrastructure/repositories/document.repository.impl.ts - Firestore implementation exists

### External References

- #file:../research/20260127-documents-module-research.md - Complete architecture research with examples
- docs/modulars/02-documents-文件模組.md - Specification document (Version 2.0)
- docs/modulars/workspace-modular-architecture_constitution_enhanced.md - Constitutional architecture document

### Standards References

- #file:../../.github/instructions/strict-ddd-architecture.instructions.md - Four-layer DDD architecture
- #file:../../.github/instructions/ddd-architecture.instructions.md - Aggregate, Factory, Policy patterns
- #file:../../.github/instructions/angular-material-best-practices.instructions.md - Material component usage
- #file:../../.github/instructions/a11y.instructions.md - Accessibility requirements

## Implementation Checklist

### [ ] Phase 1: Domain Layer Refactoring

- [ ] Task 1.1: Refactor DocumentEntity to class-based aggregate
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 15-35)

- [ ] Task 1.2: Create DocumentFactory with policy enforcement
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 37-52)

- [ ] Task 1.3: Create FolderEntity aggregate (or extend DocumentEntity)
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 54-72)

- [ ] Task 1.4: Create FileTreeNode value object
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 74-92)

- [ ] Task 1.5: Add domain events for folder operations
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 94-115)

### [ ] Phase 2: Application Layer Enhancement

- [ ] Task 2.1: Define IDocumentRepository port interface
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 117-135)

- [ ] Task 2.2: Enhance DocumentsStore with file tree state
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 137-168)

- [ ] Task 2.3: Implement tree manipulation methods
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 170-194)

- [ ] Task 2.4: Create DocumentContextProvider
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 196-213)

- [ ] Task 2.5: Add use case handlers
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 215-235)

- [ ] Task 2.6: Implement search/filter computed signals
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 237-256)

### [ ] Phase 3: Infrastructure Implementation

- [ ] Task 3.1: Create Firestore mappers
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 258-280)

- [ ] Task 3.2: Implement tree persistence in repository
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 282-301)

- [ ] Task 3.3: Configure Firebase Storage for uploads
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 303-322)

- [ ] Task 3.4: Add upload progress tracking
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 324-342)

### [ ] Phase 4: Presentation Layer

- [ ] Task 4.1: Build file tree component with mat-tree
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 344-376)

- [ ] Task 4.2: Add drag-drop support with CDK
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 378-400)

- [ ] Task 4.3: Implement context menu
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 402-420)

- [ ] Task 4.4: Create file upload component with progress
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 422-442)

- [ ] Task 4.5: Build file preview dialog
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 444-465)

- [ ] Task 4.6: Add virtual scroll for file list
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 467-485)

- [ ] Task 4.7: Implement search/filter UI
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 487-506)

- [ ] Task 4.8: Add keyboard navigation support
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 508-528)

### [ ] Phase 5: Event Integration & Testing

- [ ] Task 5.1: Wire WorkspaceSwitched event handler
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 530-545)

- [ ] Task 5.2: Publish document/folder events
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 547-565)

- [ ] Task 5.3: Implement unit tests
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 567-588)

- [ ] Task 5.4: Implement integration tests
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 590-610)

- [ ] Task 5.5: Implement E2E tests
  - Details: .copilot-tracking/details/20260127-documents-module-details.md (Lines 612-632)

## Dependencies

- Angular 20+ with Signals and Control Flow Syntax
- Angular Material (mat-tree, mat-dialog, mat-progress-bar, mat-menu)
- Angular CDK (Drag & Drop, Virtual Scroll)
- NgRx Signals (signalStore)
- Firebase Storage (file uploads)
- WorkspaceEventBus (already exists)
- WorkspaceContextProvider (already exists)

## Success Criteria

- File tree displays with 10-level depth support and folder collapse/expand
- Drag-drop functionality works for file/folder movement with validation
- Batch upload shows individual progress bars for each file
- Search by name and filter by type/date/size/uploader works correctly
- Preview dialogs load on-demand for images, PDFs, and text files
- Download supports single files and folders (as ZIP)
- All domain events published with proper correlationId and causationId
- Keyboard navigation works (arrow keys, tab, enter, escape)
- Screen reader announces tree structure and state changes
- Performance meets targets: Virtual scroll for 100+ items, LCP < 2.5s, INP < 200ms
- Test coverage: Unit (domain logic), Integration (event contracts), E2E (user flows)

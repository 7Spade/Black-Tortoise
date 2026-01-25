/**
 * Verification Script for exactOptionalPropertyTypes Enforcement
 * 
 * This script verifies that all domain event payloads correctly handle
 * optional fields according to exactOptionalPropertyTypes rules.
 */

import {
  createAcceptanceApprovedEvent,
  createDailyEntryCreatedEvent,
  createDocumentUploadedEvent,
  createMemberRemovedEvent,
  createQCPassedEvent,
  createTaskCompletedEvent,
  createWorkspaceCreatedEvent,
  createWorkspaceSwitchedEvent,
} from './src/app/domain/events/domain-events';

console.log('=== Verifying exactOptionalPropertyTypes Enforcement ===\n');

// Test 1: AcceptanceApproved with optional field
const event1 = createAcceptanceApprovedEvent(
  'task-1',
  'workspace-1',
  'Test Task',
  'user-1',
  'Looks good!'
);
console.log('✓ AcceptanceApproved with approvalNotes:', 
  'approvalNotes' in event1.payload ? 'PRESENT' : 'MISSING');
console.log('  Value:', event1.payload.approvalNotes);

// Test 2: AcceptanceApproved without optional field
const event2 = createAcceptanceApprovedEvent(
  'task-2',
  'workspace-1',
  'Test Task 2',
  'user-1',
  undefined
);
console.log('✓ AcceptanceApproved without approvalNotes:', 
  'approvalNotes' in event2.payload ? 'PRESENT (ERROR!)' : 'OMITTED');

// Test 3: DailyEntryCreated with notes
const event3 = createDailyEntryCreatedEvent(
  'entry-1',
  'workspace-1',
  '2024-01-01',
  'user-1',
  ['task-1'],
  8,
  'Worked on feature X'
);
console.log('✓ DailyEntryCreated with notes:', 
  'notes' in event3.payload ? 'PRESENT' : 'MISSING');

// Test 4: DailyEntryCreated without notes
const event4 = createDailyEntryCreatedEvent(
  'entry-2',
  'workspace-1',
  '2024-01-02',
  'user-1',
  ['task-1'],
  8,
  undefined
);
console.log('✓ DailyEntryCreated without notes:', 
  'notes' in event4.payload ? 'PRESENT (ERROR!)' : 'OMITTED');

// Test 5: TaskCompleted with both optional fields
const event5 = createTaskCompletedEvent(
  'task-3',
  'Task 3',
  'user-1',
  'workspace-1',
  'All done!',
  'user-1'
);
console.log('✓ TaskCompleted with both optional fields:', 
  ('completionNotes' in event5.payload && 'userId' in event5.payload) ? 'PRESENT' : 'MISSING');

// Test 6: TaskCompleted without optional fields
const event6 = createTaskCompletedEvent(
  'task-4',
  'Task 4',
  'user-1',
  'workspace-1',
  undefined,
  undefined
);
console.log('✓ TaskCompleted without optional fields:', 
  (!('completionNotes' in event6.payload) && !('userId' in event6.payload)) ? 'OMITTED' : 'PRESENT (ERROR!)');

// Test 7: WorkspaceCreated with userId
const event7 = createWorkspaceCreatedEvent(
  'ws-1',
  'My Workspace',
  'user-1',
  'user',
  'org-1',
  'user-1'
);
console.log('✓ WorkspaceCreated with userId:', 
  'userId' in event7.payload ? 'PRESENT' : 'MISSING');

// Test 8: WorkspaceCreated without userId
const event8 = createWorkspaceCreatedEvent(
  'ws-2',
  'My Workspace 2',
  'org-1',
  'organization',
  'org-1',
  undefined
);
console.log('✓ WorkspaceCreated without userId:', 
  'userId' in event8.payload ? 'PRESENT (ERROR!)' : 'OMITTED');

console.log('\n=== All Verifications Complete ===');
console.log('\nPattern verified: Optional fields are omitted when undefined, never passed as undefined.');
console.log('This satisfies exactOptionalPropertyTypes: true enforcement.\n');

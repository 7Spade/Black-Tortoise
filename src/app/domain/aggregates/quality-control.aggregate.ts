
export enum QCStatus {
  PENDING = 'pending',
  PASSED = 'passed',
  FAILED = 'failed'
}

export interface QCCheckEntity {
  readonly id: string;
  readonly taskId: string;
  readonly workspaceId: string;
  readonly status: QCStatus;
  readonly artifacts: ReadonlyArray<string>; // Links to artifacts
  readonly comments: string;
  readonly checkedBy: string | null;
  readonly checkedAt: number | null;
}

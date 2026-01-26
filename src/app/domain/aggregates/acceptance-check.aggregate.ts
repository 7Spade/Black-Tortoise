
export enum AcceptanceStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface AcceptanceCheckEntity {
  readonly id: string;
  readonly taskId: string;
  readonly workspaceId: string;
  readonly status: AcceptanceStatus;
  readonly criteria: ReadonlyArray<string>;
  readonly notes: string;
  readonly reviewedBy: string | null;
  readonly reviewedAt: number | null;
}

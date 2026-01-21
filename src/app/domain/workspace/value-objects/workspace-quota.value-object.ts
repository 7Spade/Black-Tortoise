/**
 * WorkspaceQuota represents the usage limits for a workspace.
 */
export class WorkspaceQuota {
  private readonly maxMembers: number;
  private readonly maxStorage: number;
  private readonly maxProjects: number;

  private constructor(maxMembers: number, maxStorage: number, maxProjects: number) {
    this.maxMembers = maxMembers;
    this.maxStorage = maxStorage;
    this.maxProjects = maxProjects;
  }

  static create(props: {
    maxMembers: number;
    maxStorage: number;
    maxProjects: number;
  }): WorkspaceQuota {
    if (props.maxMembers < 0) {
      throw new Error('WorkspaceQuota maxMembers cannot be negative');
    }
    if (props.maxStorage < 0) {
      throw new Error('WorkspaceQuota maxStorage cannot be negative');
    }
    if (props.maxProjects < 0) {
      throw new Error('WorkspaceQuota maxProjects cannot be negative');
    }
    return new WorkspaceQuota(props.maxMembers, props.maxStorage, props.maxProjects);
  }

  static unlimited(): WorkspaceQuota {
    return new WorkspaceQuota(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
  }

  getMaxMembers(): number {
    return this.maxMembers;
  }

  getMaxStorage(): number {
    return this.maxStorage;
  }

  getMaxProjects(): number {
    return this.maxProjects;
  }

  equals(other: WorkspaceQuota): boolean {
    return (
      this.maxMembers === other.maxMembers &&
      this.maxStorage === other.maxStorage &&
      this.maxProjects === other.maxProjects
    );
  }

  canAddMembers(currentCount: number, toAdd: number): boolean {
    return currentCount + toAdd <= this.maxMembers;
  }

  canAddStorage(currentUsage: number, toAdd: number): boolean {
    return currentUsage + toAdd <= this.maxStorage;
  }

  canAddProjects(currentCount: number, toAdd: number): boolean {
    return currentCount + toAdd <= this.maxProjects;
  }
}

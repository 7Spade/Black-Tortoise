/**
 * Role DTO
 * 
 * Layer: Application
 * Purpose: Data Transfer Object for role data
 */

export interface RoleDto {
  readonly id: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly permissions: ReadonlyArray<string>;
  readonly isSystem: boolean;
  readonly description?: string;
  readonly color?: string;
  readonly createdAt: number;
  readonly updatedAt: number;
}

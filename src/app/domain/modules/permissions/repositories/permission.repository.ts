
import { RoleEntity } from '../aggregates';

export interface PermissionRepository {
  findAllRoles(workspaceId: string): Promise<RoleEntity[]>;
  findRoleById(roleId: string): Promise<RoleEntity | null>;
  saveRole(role: RoleEntity): Promise<void>;
  deleteRole(roleId: string): Promise<void>;
}

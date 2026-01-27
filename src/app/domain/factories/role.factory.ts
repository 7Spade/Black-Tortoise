/**
 * Role Factory
 * 
 * Layer: Domain
 * DDD Pattern: Factory
 * 
 * Enforces policies during role creation
 */

import { RoleAggregate } from '@domain/aggregates/role.aggregate';
import { RoleNamingPolicy } from '@domain/policies/role-naming.policy';
import { PermissionPolicy } from '@domain/policies/permission.policy';
import { RoleMetadata } from '@domain/value-objects/role-metadata.vo';

export class RoleFactory {
  /**
   * Create custom role with policy enforcement
   */
  public static createCustomRole(
    id: string,
    workspaceId: string,
    name: string,
    permissions: string[],
    metadata?: Partial<RoleMetadata>,
    correlationId?: string
  ): RoleAggregate {
    // Enforce naming policy
    RoleNamingPolicy.assertIsValid(name);

    // Enforce permission policy
    PermissionPolicy.assertValidPermissions(permissions);

    // Create via aggregate
    return RoleAggregate.create(
      id,
      workspaceId,
      name.trim(),
      permissions,
      metadata,
      false, // Custom roles are not system roles
      correlationId
    );
  }

  /**
   * Create system role (no naming policy enforcement)
   */
  public static createSystemRole(
    id: string,
    workspaceId: string,
    name: string,
    permissions: string[],
    metadata?: Partial<RoleMetadata>,
    correlationId?: string
  ): RoleAggregate {
    // System roles skip naming policy but still validate permissions
    PermissionPolicy.assertValidPermissions(permissions);

    return RoleAggregate.create(
      id,
      workspaceId,
      name,
      permissions,
      metadata,
      true, // System role
      correlationId
    );
  }
}

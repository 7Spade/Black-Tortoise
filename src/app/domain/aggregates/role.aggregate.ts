/**
 * Role Aggregate
 * 
 * Layer: Domain
 * DDD Pattern: Aggregate Root
 * 
 * Consolidated role aggregate with domain event support.
 * Replaces role-definition.aggregate.ts and role.entity.ts
 */

import { DomainEvent } from '@domain/events';
import { createRoleCreatedEvent } from '@domain/events/role-created.event';
import { createRoleUpdatedEvent } from '@domain/events/role-updated.event';
import { createRoleDeletedEvent } from '@domain/events/role-deleted.event';
import { RoleMetadata, createRoleMetadata, updateRoleMetadata } from '@domain/value-objects/role-metadata.vo';

/**
 * Role Aggregate Root
 * 
 * Represents a role with permissions in a workspace.
 * Use static factory methods to create or reconstruct.
 */
export class RoleAggregate {
  private domainEvents: DomainEvent<any>[] = [];

  private constructor(
    public readonly id: string,
    public readonly workspaceId: string,
    private _name: string,
    private _permissions: Set<string>,
    private _metadata: RoleMetadata,
    public readonly isSystem: boolean
  ) {}

  /**
   * Create new role (generates domain event)
   */
  public static create(
    id: string,
    workspaceId: string,
    name: string,
    permissions: string[],
    metadata?: Partial<RoleMetadata>,
    isSystem: boolean = false,
    correlationId?: string
  ): RoleAggregate {
    const role = new RoleAggregate(
      id,
      workspaceId,
      name,
      new Set(permissions),
      createRoleMetadata(metadata?.description, metadata?.color),
      isSystem
    );

    role.domainEvents.push(
      createRoleCreatedEvent(
        {
          roleId: id,
          workspaceId,
          name,
          permissions,
        },
        correlationId
      )
    );

    return role;
  }

  /**
   * Reconstruct from persistence (no domain events)
   */
  public static reconstruct(
    id: string,
    workspaceId: string,
    name: string,
    permissions: string[],
    metadata: RoleMetadata,
    isSystem: boolean = false
  ): RoleAggregate {
    return new RoleAggregate(
      id,
      workspaceId,
      name,
      new Set(permissions),
      metadata,
      isSystem
    );
  }

  // Getters
  get name(): string {
    return this._name;
  }

  get permissions(): ReadonlySet<string> {
    return this._permissions;
  }

  get metadata(): RoleMetadata {
    return this._metadata;
  }

  /**
   * Grant permission to role
   */
  public grantPermission(permission: string, correlationId?: string): void {
    if (this._permissions.has(permission)) return;

    this._permissions.add(permission);
    this._metadata = { ...this._metadata, updatedAt: Date.now() };

    this.domainEvents.push(
      createRoleUpdatedEvent(
        {
          roleId: this.id,
          workspaceId: this.workspaceId,
          changes: {
            permissions: Array.from(this._permissions),
          },
        },
        correlationId
      )
    );
  }

  /**
   * Revoke permission from role
   */
  public revokePermission(permission: string, correlationId?: string): void {
    if (!this._permissions.has(permission)) return;

    this._permissions.delete(permission);
    this._metadata = { ...this._metadata, updatedAt: Date.now() };

    this.domainEvents.push(
      createRoleUpdatedEvent(
        {
          roleId: this.id,
          workspaceId: this.workspaceId,
          changes: {
            permissions: Array.from(this._permissions),
          },
        },
        correlationId
      )
    );
  }

  /**
   * Update role metadata
   */
  public updateMetadata(
    updates: Partial<Pick<RoleMetadata, 'description' | 'color'>>,
    correlationId?: string
  ): void {
    this._metadata = updateRoleMetadata(this._metadata, updates);

    this.domainEvents.push(
      createRoleUpdatedEvent(
        {
          roleId: this.id,
          workspaceId: this.workspaceId,
          changes: updates,
        },
        correlationId
      )
    );
  }

  /**
   * Update role name (if not system role)
   */
  public updateName(name: string, correlationId?: string): void {
    if (this.isSystem) {
      throw new Error('Cannot update system role name');
    }

    if (this._name === name) return;

    this._name = name;
    this._metadata = { ...this._metadata, updatedAt: Date.now() };

    this.domainEvents.push(
      createRoleUpdatedEvent(
        {
          roleId: this.id,
          workspaceId: this.workspaceId,
          changes: { name },
        },
        correlationId
      )
    );
  }

  /**
   * Mark role for deletion (generates domain event)
   */
  public delete(correlationId?: string): void {
    if (this.isSystem) {
      throw new Error('Cannot delete system role');
    }

    this.domainEvents.push(
      createRoleDeletedEvent(
        {
          roleId: this.id,
          workspaceId: this.workspaceId,
          roleName: this._name,
        },
        correlationId
      )
    );
  }

  /**
   * Check if role has specific permission
   */
  public hasPermission(permission: string): boolean {
    return this._permissions.has(permission);
  }

  /**
   * Get and clear domain events
   */
  public pullDomainEvents(): DomainEvent<any>[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }
}

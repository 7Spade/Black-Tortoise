/**
 * Role Firestore Mapper
 * 
 * Layer: Infrastructure
 * Purpose: Convert between Domain RoleAggregate and Firestore document
 */

import { RoleAggregate } from '@domain/aggregates/role.aggregate';
import { FirestoreRoleDocument } from '@infrastructure/models/firestore-role.document';

export class RoleFirestoreMapper {
  /**
   * Convert Firestore document to domain aggregate
   */
  public static toDomain(doc: FirestoreRoleDocument): RoleAggregate {
    return RoleAggregate.reconstruct(
      doc.id,
      doc.workspaceId,
      doc.name,
      doc.permissions,
      {
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        description: doc.description,
        color: doc.color,
      },
      doc.isSystem
    );
  }

  /**
   * Convert domain aggregate to Firestore document
   */
  public static toFirestore(entity: RoleAggregate): FirestoreRoleDocument {
    return {
      id: entity.id,
      workspaceId: entity.workspaceId,
      name: entity.name,
      permissions: Array.from(entity.permissions),
      isSystem: entity.isSystem,
      description: entity.metadata.description,
      color: entity.metadata.color,
      createdAt: entity.metadata.createdAt,
      updatedAt: entity.metadata.updatedAt,
    };
  }
}

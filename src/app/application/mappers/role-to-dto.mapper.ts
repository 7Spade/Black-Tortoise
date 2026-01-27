/**
 * Role to DTO Mapper
 * 
 * Layer: Application
 * Purpose: Convert between Domain RoleAggregate and Application DTO
 */

import { RoleAggregate } from '@domain/aggregates/role.aggregate';
import { RoleDto } from '@application/dtos/role.dto';

export class RoleToDtoMapper {
  /**
   * Convert domain aggregate to DTO
   */
  public static toDto(entity: RoleAggregate): RoleDto {
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

  /**
   * Convert DTO to domain aggregate (reconstruction)
   */
  public static fromDto(dto: RoleDto): RoleAggregate {
    return RoleAggregate.reconstruct(
      dto.id,
      dto.workspaceId,
      dto.name,
      Array.from(dto.permissions),
      {
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
        description: dto.description,
        color: dto.color,
      },
      dto.isSystem
    );
  }
}

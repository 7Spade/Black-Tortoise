/**
 * Workspace Repository Implementation
 * 
 * Layer: Infrastructure
 * DDD Pattern: Repository Implementation
 * Purpose: Concrete implementation of WorkspaceRepository using Firebase/Firestore
 * 
 * Clean Architecture Compliance:
 * - Implements WorkspaceRepository interface from Domain layer
 * - Uses Angular/Firebase dependencies (allowed in Infrastructure)
 * - Returns Observables for reactive data streams (RxJS allowed here)
 * - Handles DTO ↔ Domain Model mapping
 * 
 * Note: This is a placeholder implementation for demonstration.
 * In a real application, this would integrate with Firestore.
 */

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository';
import { WorkspaceAggregate, createWorkspace as createWorkspaceAggregate, WorkspaceId } from '@domain/workspace';

/**
 * Firestore DTO for Workspace
 * Infrastructure layer data structure
 */
interface WorkspaceDTO {
  id: string;
  name: string;
  ownerId: string;
  ownerType: 'user' | 'organization';
  organizationId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

/**
 * Workspace Repository Implementation
 * 
 * Uses in-memory storage for demo purposes.
 * In production, this would use AngularFire/Firestore:
 * - constructor(private firestore: Firestore) {}
 * - Use collection() and doc() from @angular/fire/firestore
 * - Return Observable streams from Firestore queries
 */
@Injectable()
export class WorkspaceRepositoryImpl implements WorkspaceRepository {
  // In-memory storage (demo only - replace with Firestore)
  private workspaces: Map<string, WorkspaceDTO> = new Map();

  /**
   * Find workspace by ID
   * 
   * Production implementation would use:
   * return docData(doc(this.firestore, `workspaces/${id.getValue()}`))
   */
  findById(id: WorkspaceId): Promise<WorkspaceAggregate | undefined> {
    const dto = this.workspaces.get(id.getValue());
    
    if (!dto) {
      return Promise.resolve(undefined);
    }

    return Promise.resolve(this.mapDTOToAggregate(dto));
  }

  /**
   * Find all workspaces owned by user or organization
   * 
   * Production implementation would use Firestore query:
   * const q = query(
   *   collection(this.firestore, 'workspaces'),
   *   where('ownerId', '==', ownerId),
   *   where('ownerType', '==', ownerType)
   * );
   * return collectionData(q);
   */
  findByOwnerId(ownerId: string, ownerType: 'user' | 'organization'): Promise<WorkspaceAggregate[]> {
    const results = Array.from(this.workspaces.values())
      .filter(ws => ws.ownerId === ownerId && ws.ownerType === ownerType)
      .map(dto => this.mapDTOToAggregate(dto));

    return Promise.resolve(results);
  }

  /**
   * Find all workspaces in an organization
   */
  findByOrganizationId(organizationId: string): Promise<WorkspaceAggregate[]> {
    const results = Array.from(this.workspaces.values())
      .filter(ws => ws.organizationId === organizationId)
      .map(dto => this.mapDTOToAggregate(dto));

    return Promise.resolve(results);
  }

  /**
   * Find all active workspaces
   */
  findAllActive(): Promise<WorkspaceAggregate[]> {
    const results = Array.from(this.workspaces.values())
      .filter(ws => ws.isActive)
      .map(dto => this.mapDTOToAggregate(dto));

    return Promise.resolve(results);
  }

  /**
   * Save workspace (create or update)
   * 
   * Production implementation would use:
   * setDoc(doc(this.firestore, `workspaces/${workspace.id.getValue()}`), dto)
   */
  save(workspace: WorkspaceAggregate): Promise<void> {
    const dto = this.mapAggregateToDTO(workspace);
    this.workspaces.set(workspace.id.getValue(), dto);
    
    console.log('[WorkspaceRepositoryImpl] Workspace saved:', workspace.id.getValue());
    
    return Promise.resolve();
  }

  /**
   * Delete workspace by ID
   * 
   * Production implementation would use:
   * deleteDoc(doc(this.firestore, `workspaces/${id.getValue()}`))
   */
  delete(id: WorkspaceId): Promise<void> {
    this.workspaces.delete(id.getValue());
    
    console.log('[WorkspaceRepositoryImpl] Workspace deleted:', id.getValue());
    
    return Promise.resolve();
  }

  /**
   * Check if workspace exists
   */
  exists(id: WorkspaceId): Promise<boolean> {
    return Promise.resolve(this.workspaces.has(id.getValue()));
  }

  /**
   * Count total workspaces
   */
  count(): Promise<number> {
    return Promise.resolve(this.workspaces.size);
  }

  /**
   * Count workspaces by owner
   */
  countByOwner(ownerId: string): Promise<number> {
    const count = Array.from(this.workspaces.values())
      .filter(ws => ws.ownerId === ownerId)
      .length;

    return Promise.resolve(count);
  }

  /**
   * Map DTO to Domain Aggregate
   * Infrastructure → Domain mapping
   */
  private mapDTOToAggregate(dto: WorkspaceDTO): WorkspaceAggregate {
    return {
      id: WorkspaceId.create(dto.id),
      name: dto.name,
      ownerId: dto.ownerId,
      ownerType: dto.ownerType,
      organizationId: dto.organizationId,
      isActive: dto.isActive,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      version: dto.version,
    };
  }

  /**
   * Map Domain Aggregate to DTO
   * Domain → Infrastructure mapping
   */
  private mapAggregateToDTO(aggregate: WorkspaceAggregate): WorkspaceDTO {
    return {
      id: aggregate.id.getValue(),
      name: aggregate.name,
      ownerId: aggregate.ownerId,
      ownerType: aggregate.ownerType,
      organizationId: aggregate.organizationId,
      isActive: aggregate.isActive,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
      version: aggregate.version,
    };
  }
}

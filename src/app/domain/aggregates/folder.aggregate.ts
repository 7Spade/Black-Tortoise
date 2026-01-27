/**
 * Folder Aggregate Root
 * 
 * Layer: Domain
 * DDD Pattern: Aggregate Root
 * 
 * The Folder aggregate manages folder structure, hierarchy, and containment.
 * It enforces business rules around folder depth and nesting.
 */

import { WorkspaceId } from '@domain/value-objects';
import { FolderId } from '../value-objects/folder-id.vo';
import { FolderDepthPolicy } from '../policies/folder-depth.policy';
import { DocumentNamingPolicy } from '../policies/document-naming.policy';

export interface FolderAggregate {
  readonly id: FolderId;
  readonly workspaceId: WorkspaceId;
  readonly name: string;
  readonly parentId: string | null;
  readonly childIds: ReadonlyArray<string>;
  readonly depth: number;
  readonly createdBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Create a new Folder aggregate
 */
export function createFolder(
  id: FolderId,
  workspaceId: WorkspaceId,
  name: string,
  parentId: string | null,
  depth: number,
  createdBy: string
): FolderAggregate {
  // Enforce naming policy
  DocumentNamingPolicy.assertIsValid(name);

  // Enforce depth policy
  FolderDepthPolicy.assertIsValid(depth, 'create');

  if (!createdBy || createdBy.trim().length === 0) {
    throw new Error('Folder creator ID cannot be empty');
  }

  return {
    id,
    workspaceId,
    name: name.trim(),
    parentId,
    childIds: [],
    depth,
    createdBy,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Rename folder
 */
export function renameFolder(
  folder: FolderAggregate,
  newName: string
): FolderAggregate {
  DocumentNamingPolicy.assertIsValid(newName);

  return {
    ...folder,
    name: newName.trim(),
    updatedAt: new Date(),
  };
}

/**
 * Add child to folder
 */
export function addChildToFolder(
  folder: FolderAggregate,
  childId: string
): FolderAggregate {
  if (!childId || childId.trim().length === 0) {
    throw new Error('Child ID cannot be empty');
  }

  if (folder.childIds.includes(childId)) {
    throw new Error('Child already exists in folder');
  }

  return {
    ...folder,
    childIds: [...folder.childIds, childId],
    updatedAt: new Date(),
  };
}

/**
 * Remove child from folder
 */
export function removeChildFromFolder(
  folder: FolderAggregate,
  childId: string
): FolderAggregate {
  return {
    ...folder,
    childIds: folder.childIds.filter(id => id !== childId),
    updatedAt: new Date(),
  };
}

/**
 * Check if folder can accept a child at given depth
 */
export function canAcceptChild(
  folder: FolderAggregate,
  childDepth: number
): boolean {
  return FolderDepthPolicy.isSatisfiedBy(childDepth);
}

/**
 * Move folder to new parent
 */
export function moveFolder(
  folder: FolderAggregate,
  newParentId: string | null,
  newDepth: number
): FolderAggregate {
  FolderDepthPolicy.assertIsValid(newDepth, 'move');

  return {
    ...folder,
    parentId: newParentId,
    depth: newDepth,
    updatedAt: new Date(),
  };
}

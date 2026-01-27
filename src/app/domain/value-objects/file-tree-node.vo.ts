/**
 * FileTreeNode Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 * 
 * Immutable tree node representing file or folder.
 * Provides helper methods for tree navigation and validation.
 */

import { NodeMetadata, NodeType } from '../types/node-metadata.type';

export class FileTreeNode {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: NodeType,
    public readonly parentId: string | null,
    public readonly children: ReadonlyArray<FileTreeNode>,
    public readonly metadata: NodeMetadata
  ) {
    if (!id || id.trim().length === 0) {
      throw new Error('Node id cannot be empty');
    }
    if (!name || name.trim().length === 0) {
      throw new Error('Node name cannot be empty');
    }
  }

  /**
   * Create a new FileTreeNode
   */
  static create(
    id: string,
    name: string,
    type: NodeType,
    parentId: string | null = null,
    children: ReadonlyArray<FileTreeNode> = [],
    metadata: NodeMetadata = {}
  ): FileTreeNode {
    return new FileTreeNode(id, name, type, parentId, children, metadata);
  }

  /**
   * Check if node is root (no parent)
   */
  isRoot(): boolean {
    return this.parentId === null;
  }

  /**
   * Check if node has children
   */
  hasChildren(): boolean {
    return this.children.length > 0;
  }

  /**
   * Check if node is a folder
   */
  isFolder(): boolean {
    return this.type === 'folder';
  }

  /**
   * Check if node is a file
   */
  isFile(): boolean {
    return this.type === 'file';
  }

  /**
   * Get depth of this node in tree
   * Requires full tree traversal - use cached value if available
   */
  getDepth(allNodes: ReadonlyArray<FileTreeNode>): number {
    if (this.isRoot()) return 0;

    let depth = 0;
    let currentParentId = this.parentId;

    while (currentParentId !== null && depth < 20) { // Max depth safety
      const parent = allNodes.find(n => n.id === currentParentId);
      if (!parent) break;
      depth++;
      currentParentId = parent.parentId;
    }

    return depth;
  }

  /**
   * Create a copy with updated children
   */
  withChildren(children: ReadonlyArray<FileTreeNode>): FileTreeNode {
    return new FileTreeNode(
      this.id,
      this.name,
      this.type,
      this.parentId,
      children,
      this.metadata
    );
  }

  /**
   * Create a copy with updated name
   */
  withName(name: string): FileTreeNode {
    return new FileTreeNode(
      this.id,
      name,
      this.type,
      this.parentId,
      this.children,
      this.metadata
    );
  }

  /**
   * Create a copy with updated parent
   */
  withParent(parentId: string | null): FileTreeNode {
    return new FileTreeNode(
      this.id,
      this.name,
      this.type,
      parentId,
      this.children,
      this.metadata
    );
  }
}

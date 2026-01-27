/**
 * Draggable Tree Component
 * Presentation Layer - CBK
 * 
 * Hierarchical tree with drag-and-drop reordering
 * Signal-based tree state
 */

import { Component, input, output, signal } from '@angular/core';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  expanded?: boolean;
  data?: any;
}

@Component({
  selector: 'app-draggable-tree',
  standalone: true,
  template: `
    <div class="draggable-tree">
      @for (node of nodes(); track node.id) {
        <div class="tree-node"
             [attr.data-node-id]="node.id"
             [class.dragging]="draggedNodeId() === node.id">
          <div class="tree-node-content">
            @if (node.children && node.children.length > 0) {
              <button class="tree-expand-button"
                      (click)="toggleNode(node)">
                {{ node.expanded ? '▼' : '▶' }}
              </button>
            }
            <span class="tree-node-label">{{ node.label }}</span>
          </div>
          @if (node.expanded && node.children) {
            <div class="tree-node-children">
              <!-- Recursive tree rendering would go here -->
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .draggable-tree {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .tree-node {
      user-select: none;
    }
    .tree-node-content {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      cursor: move;
    }
    .tree-node.dragging .tree-node-content {
      opacity: 0.5;
    }
    .tree-expand-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
    }
    .tree-node-children {
      margin-left: 24px;
    }
  `]
})
export class DraggableTreeComponent {
  readonly nodes = input<TreeNode[]>([]);
  readonly nodesReordered = output<TreeNode[]>();

  protected readonly draggedNodeId = signal<string | null>(null);

  protected toggleNode(node: TreeNode): void {
    // TODO: Implement node expand/collapse
  }

  // TODO: Implement drag handlers
}

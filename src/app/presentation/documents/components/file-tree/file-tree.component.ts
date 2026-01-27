/**
 * File Tree Component
 * 
 * Layer: Presentation
 * Purpose: Display hierarchical file/folder tree
 * Architecture: OnPush, Signals only, Angular 20 control flow
 */

import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  effect,
} from '@angular/core';
import { MatTreeModule, MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FileTreeNode } from '@domain/value-objects/file-tree-node.vo';

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  id: string;
  type: 'file' | 'folder';
}

@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [MatTreeModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-tree [dataSource]="dataSource" [treeControl]="treeControl">
      <!-- Leaf node -->
      <mat-tree-node *matTreeNodeDef="let node" matTreeNodePadding>
        <button mat-icon-button disabled></button>
        <mat-icon>{{ node.type === 'folder' ? 'folder' : 'description' }}</mat-icon>
        <span class="tree-node-name" (click)="nodeSelected.emit(node.id)">
          {{ node.name }}
        </span>
      </mat-tree-node>

      <!-- Expandable node -->
      <mat-tree-node *matTreeNodeDef="let node; when: hasChild" matTreeNodePadding>
        <button mat-icon-button matTreeNodeToggle
                [attr.aria-label]="'Toggle ' + node.name">
          <mat-icon class="mat-icon-rtl-mirror">
            {{ treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right' }}
          </mat-icon>
        </button>
        <mat-icon>{{ node.type === 'folder' ? 'folder' : 'description' }}</mat-icon>
        <span class="tree-node-name" (click)="nodeSelected.emit(node.id)">
          {{ node.name }}
        </span>
      </mat-tree-node>
    </mat-tree>
  `,
  styles: [`
    .tree-node-name {
      cursor: pointer;
      padding: 4px 8px;
      user-select: none;
    }
    .tree-node-name:hover {
      background-color: rgba(0, 0, 0, 0.04);
      border-radius: 4px;
    }
    mat-icon {
      margin-right: 8px;
    }
  `]
})
export class FileTreeComponent {
  nodes = input.required<ReadonlyArray<FileTreeNode>>();
  nodeSelected = output<string>();

  private transformer = (node: FileTreeNode, level: number): FlatNode => ({
    expandable: node.hasChildren(),
    name: node.name,
    level: level,
    id: node.id,
    type: node.type,
  });

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    effect(() => {
      const currentNodes = this.nodes();
      this.dataSource.data = currentNodes as any;
    });
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;
}

/**
 * TeamCreateDialog Component
 * 
 * Layer: Presentation (Dialog)
 * Purpose: Dialog for creating a new team
 * Architecture: Zone-less, OnPush, Angular 20 control flow, Standalone
 * 
 * Responsibilities:
 * - Display team creation form
 * - Emit creation result to parent component
 * - No business logic - only presentation
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-team-create-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-create-dialog.html',
  styleUrls: ['./team-create-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCreateDialogComponent {
  // Placeholder implementation
  // TODO: Add form controls and validation
}
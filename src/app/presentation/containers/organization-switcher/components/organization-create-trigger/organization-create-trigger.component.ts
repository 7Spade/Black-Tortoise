/**
 * OrganizationCreateTrigger Component
 * 
 * Layer: Presentation
 * Purpose: Trigger component for opening organization creation dialog
 * Architecture: Zone-less, OnPush, Standalone
 * 
 * Responsibilities:
 * - Provides API to open organization creation dialog
 * - Returns Observable with dialog result
 * - No business logic - only dialog coordination
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-organization-create-trigger',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organization-create-trigger.component.html',
  styleUrls: ['./organization-create-trigger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationCreateTriggerComponent {
  /**
   * Opens the organization creation dialog
   * @returns Observable with dialog result (or null if cancelled)
   */
  openDialog(): Observable<unknown> {
    // TODO: Implement dialog opening logic
    return of(null);
  }
}

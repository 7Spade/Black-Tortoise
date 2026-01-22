/**
 * Global Header Component
 *
 * Layer: Presentation
 * Purpose: Global header wrapper - delegates to shared HeaderComponent
 * Architecture: Zone-less, OnPush, Angular 20 control flow, M3 tokens
 *
 * Responsibilities:
 * - Simple wrapper around shared HeaderComponent
 * - Provides facade injection for header-specific logic
 * - Single responsibility: header coordination
 */

import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header';
import { HeaderPresentationFacade } from './facade/header-presentation.facade';

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [HeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-header [showWorkspaceControls]="showWorkspaceControls()" />`,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class GlobalHeaderComponent {
  readonly facade = inject(HeaderPresentationFacade);

  // Inputs
  readonly showWorkspaceControls = input(true);
}

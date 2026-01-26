import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

/**
 * ContextSwitcherComponent
 *
 * Purpose: Display and switch application context (workspace/identity)
 * Architecture: Zone-less, OnPush, Signals
 * 
 * Note: This is a placeholder component. Full implementation will use
 * application layer facade/store for context management.
 */
@Component({
  selector: 'app-context-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './context-switcher.component.html',
  styleUrls: ['./context-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextSwitcherComponent {
  // Local state for dropdown menu
  isOpen = signal(false);
  
  // Placeholder contexts - will be replaced with facade signal
  contexts = signal<Array<{ id: string; name: string }>>([
    { id: '1', name: 'Context 1' },
    { id: '2', name: 'Context 2' }
  ]);

  toggle() {
    this.isOpen.update(v => !v);
  }
  
  switch(contextId: string) {
    // TODO: Implement via application layer facade
    // contextFacade.switchTo(contextId)
    console.log('Switching to context:', contextId);
    this.isOpen.set(false);
  }
}

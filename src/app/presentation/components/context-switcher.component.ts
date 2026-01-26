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
  template: `
<!--
  Context switcher template

  Note: Placeholder component for context switching.
  Full implementation will use application layer facade.
-->
<div class="context-switcher">
  <button type="button" aria-haspopup="listbox" (click)="toggle()">
    Switch Context
  </button>

  @if (isOpen()) {
    <div class="context-list">
      @for (ctx of contexts(); track ctx.id) {
        <button (click)="switch(ctx.id)">{{ctx.name}}</button>
      }
    </div>
  }
</div>
  `,
  styles: [`
.context-switcher {
  position: relative;
  display: inline-block;
}

.context-list {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  padding: 8px;
  min-width: 160px;
}

.context-item {
  padding: 6px 8px;
}
  `],
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

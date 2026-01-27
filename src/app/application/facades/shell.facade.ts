import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { WorkspaceStore } from '@application/stores/workspace.store';
import { filter, map, startWith } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShellFacade {
  private readonly workspaceStore = inject(WorkspaceStore);
  private readonly router = inject(Router);

  // Local shell state
  private readonly _showWorkspaceControls = signal(true);
  private readonly _isDemoMode = signal(false);

  // Reactive URL tracking
  private readonly urlSignal = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  // Computed signals for shell UI
  readonly showWorkspaceControls = computed(() => this._showWorkspaceControls());

  readonly isDemoMode = computed(() => {
    const url = this.urlSignal();
    return url.startsWith('/demo');
  });

  readonly hasWorkspaceError = computed(() =>
    this.workspaceStore.error() !== null
  );

  readonly workspaceError = computed(() =>
    this.workspaceStore.error()
  );

  /**
   * Toggle workspace controls visibility
   */
  toggleWorkspaceControls(): void {
    this._showWorkspaceControls.update(v => !v);
  }

  /**
   * Set workspace controls visibility
   */
  setWorkspaceControlsVisible(visible: boolean): void {
    this._showWorkspaceControls.set(visible);
  }

  /**
   * Clear workspace error
   */
  clearWorkspaceError(): void {
    this.workspaceStore.setError(null);
  }

  /**
   * Navigate to home
   */
  navigateHome(): void {
    this.router.navigate(['/']).catch(() => {
      this.workspaceStore.setError('Failed to navigate to home');
    });
  }
}

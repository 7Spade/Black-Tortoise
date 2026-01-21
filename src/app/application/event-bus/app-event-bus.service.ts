import { Injectable, OnDestroy } from '@angular/core';
import { filter, map, Subject } from 'rxjs';
import type { Observable } from 'rxjs';
import type { WorkspaceOwnerType } from '@domain/identity/identity.types';

export interface WorkspaceOwnerSelection {
  readonly ownerId: string;
  readonly ownerType: WorkspaceOwnerType;
}

export interface WorkspaceOwnerSelectedEvent {
  readonly type: 'workspace-owner-selected';
  readonly payload: WorkspaceOwnerSelection;
}

export type AppEvent = WorkspaceOwnerSelectedEvent;

@Injectable({ providedIn: 'root' })
export class AppEventBus implements OnDestroy {
  private readonly events$ = new Subject<AppEvent>();

  emit(event: AppEvent): void {
    this.events$.next(event);
  }

  onWorkspaceOwnerSelected(): Observable<WorkspaceOwnerSelection> {
    return this.events$.pipe(
      filter(
        (event): event is WorkspaceOwnerSelectedEvent =>
          event.type === 'workspace-owner-selected',
      ),
      map((event) => event.payload),
    );
  }

  ngOnDestroy(): void {
    this.events$.complete();
  }
}

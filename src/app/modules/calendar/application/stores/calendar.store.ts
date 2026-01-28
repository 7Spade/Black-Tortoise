import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { CalendarEventViewModel } from '../models/calendar-event-view.model';
import { inject, computed } from '@angular/core';
import { CalendarRepository } from '@domain/repositories/calendar.repository';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { CalendarEventAggregate } from '@calendar/domain/aggregates/calendar-event.aggregate';

type CalendarState = {
    events: CalendarEventViewModel[];
    loading: boolean;
    error: string | null;
    selectedDate: Date;
};

const initialState: CalendarState = {
    events: [],
    loading: false,
    error: null,
    selectedDate: new Date()
};

export const CalendarStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed(({ events }) => ({
        // Example computed: count events
        eventCount: computed(() => events().length)
    })),
    withMethods((store, repo = inject(CalendarRepository)) => ({

        loadEvents: rxMethod<string>(
            pipe(
                tap(() => patchState(store, { loading: true, error: null })),
                switchMap((workspaceId) =>
                    repo.findByWorkspaceId(workspaceId).then(events => {
                        // Mapper logic domain -> view model
                        return events.map(e => ({
                            id: e.id,
                            title: e.title,
                            description: e.description || '',
                            start: e.period.start,
                            end: e.period.end,
                            isAllDay: e.isAllDay
                        } as CalendarEventViewModel));
                    })
                ),
                tapResponse({
                    next: (events) => patchState(store, { events, loading: false }),
                    error: (err: any) => patchState(store, { loading: false, error: err.message || 'Failed to load events' })
                })
            )
        ),

        addEvent: rxMethod<{ workspaceId: string, title: string, start: Date, end: Date }>(
            pipe(
                tap(() => patchState(store, { loading: true })),
                switchMap(async (cmd) => {
                    // Logic to create domain aggregate would typically be in a Command Handler
                    // For simplicity in this store migration, we construct it here or call a handler
                    // Assuming direct repo use for now as per minimal viable path
                    const id = crypto.randomUUID(); // Simple ID generation
                    const newEvent = CalendarEventAggregate.create(
                        id,
                        cmd.workspaceId,
                        cmd.title,
                        { start: cmd.start, end: cmd.end }
                    );
                    await repo.save(newEvent);
                    return newEvent;
                }),
                tapResponse({
                    next: (savedEvent) => {
                        // Optimistic update or reload? Reload is safer for consistency
                        // But we can patch local state
                        const vm: CalendarEventViewModel = {
                            id: savedEvent.id,
                            title: savedEvent.title,
                            description: savedEvent.description || '',
                            start: savedEvent.period.start,
                            end: savedEvent.period.end,
                            isAllDay: savedEvent.isAllDay
                        };
                        patchState(store, (state) => ({
                            events: [...state.events, vm],
                            loading: false
                        }));
                    },
                    error: (err: any) => patchState(store, { loading: false, error: err.message })
                })
            )
        )
    }))
);

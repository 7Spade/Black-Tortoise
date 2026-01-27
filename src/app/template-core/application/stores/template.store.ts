import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { AddSectionToTemplateUseCase } from '../../application/use-cases/add-section.use-case';
import { CreateTemplateUseCase } from '../../application/use-cases/create-template.use-case';
import { AddTemplateSectionCommand, CreateTemplateCommand } from '../commands/template.commands';
import { TemplateDto } from '../dtos/template.dto';
import { TEMPLATE_REPOSITORY_TOKEN } from '../interfaces/template.repository';
import { TemplateToDtoMapper } from '../mappers/template.mapper';

type TemplateState = {
  templateDtos: TemplateDto[]; // Use DTOs for UI State
  isLoading: boolean;
  error: string | null;
};

const initialState: TemplateState = {
  templateDtos: [],
  isLoading: false,
  error: null,
};

export const TemplateStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, createUseCase = inject(CreateTemplateUseCase), addSectionUseCase = inject(AddSectionToTemplateUseCase), repository = inject(TEMPLATE_REPOSITORY_TOKEN)) => ({
    loadAll: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(async () => {
          try {
            const templates = await repository.findAll();
            // Map Domain Entities to View Models (DTOs)
            const dtos = TemplateToDtoMapper.toDtoList(templates);
            patchState(store, { templateDtos: dtos, isLoading: false, error: null });
          } catch(err: any) {
            patchState(store, { error: err.message || 'Unknown error', isLoading: false });
          }
        })
      )
    ),
    addTemplate: rxMethod<{ name: string; content: string; userId: string }>(
        pipe(
            tap(() => patchState(store, { isLoading: true })),
            switchMap(async (props) => {
                // Use Case ensures Causality Tracking (generates correlationId)
                const command = new CreateTemplateCommand(props.name, props.content, props.userId);
                
                try {
                    await createUseCase.execute(command);
                    // Reload or Optimistic Update
                    // For simplicity, we just reload all to show the new item
                    const templates = await repository.findAll();
                    const dtos = TemplateToDtoMapper.toDtoList(templates);
                    patchState(store, { templateDtos: dtos, isLoading: false, error: null });
                } catch(err: any) {
                    patchState(store, { error: err.message, isLoading: false });
                }
            })
        )
    ),
    addSection: rxMethod<{ templateId: string; title: string; content: string; userId: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(async (props) => {
            const command = new AddTemplateSectionCommand(props.templateId, props.title, props.content, props.userId);
            try {
                await addSectionUseCase.execute(command);
                const templates = await repository.findAll();
                const dtos = TemplateToDtoMapper.toDtoList(templates);
                patchState(store, { templateDtos: dtos, isLoading: false, error: null });
            } catch(err: any) {
                patchState(store, { error: err.message, isLoading: false });
            }
        })
      )
    )
  }))
);

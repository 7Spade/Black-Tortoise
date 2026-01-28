import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { WorkspaceSettingsAggregate } from '@domain/settings/aggregates/workspace-settings.aggregate';
import { SettingsRepository } from '@domain/repositories/settings.repository';
import { WorkspaceSettingsMapper } from '../mappers/workspace-settings.mapper';
import { WorkspaceSettingsDto } from '../models/workspace-settings.dto';

@Injectable({ providedIn: 'root' })
export class SettingsRepositoryImpl implements SettingsRepository {
    private firestore = inject(Firestore);
    private collectionName = 'settings';

    async getSettings(workspaceId: string): Promise<WorkspaceSettingsAggregate | null> {
        const d = await getDoc(
            doc(this.firestore, `${this.collectionName}/${workspaceId}`),
        );
        if (d.exists()) {
            return WorkspaceSettingsMapper.toDomain(d.data() as WorkspaceSettingsDto);
        }
        return null;
    }

    async save(settings: WorkspaceSettingsAggregate): Promise<void> {
        const dto = WorkspaceSettingsMapper.toDto(settings);
        await setDoc(
            doc(this.firestore, `${this.collectionName}/${settings.workspaceId.value}`),
            dto,
        );
    }
}

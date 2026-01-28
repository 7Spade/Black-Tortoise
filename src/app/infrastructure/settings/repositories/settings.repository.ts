import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { WorkspaceSettingsEntity } from '@domain/settings';
import { SettingsRepository } from '@domain/repositories';
import { WorkspaceSettingsMapper } from '../mappers/workspace-settings.mapper';
import { WorkspaceSettingsDto } from '../models/workspace-settings.dto';

@Injectable({ providedIn: 'root' })
export class SettingsRepositoryImpl implements SettingsRepository {
    private firestore = inject(Firestore);
    private collectionName = 'settings';

    async getSettings(workspaceId: string): Promise<WorkspaceSettingsEntity> {
        const d = await getDoc(
            doc(this.firestore, `${this.collectionName}/${workspaceId}`),
        );
        if (d.exists()) {
            return WorkspaceSettingsMapper.toDomain(d.data() as WorkspaceSettingsDto);
        }
        // Return default empty settings if not found
        return WorkspaceSettingsEntity.reconstitute(workspaceId, workspaceId, [], null);
    }

    async saveSettings(settings: WorkspaceSettingsEntity): Promise<void> {
        const dto = WorkspaceSettingsMapper.toDto(settings);
        await setDoc(
            doc(this.firestore, `${this.collectionName}/${settings.workspaceId.value}`),
            dto,
        );
    }
}

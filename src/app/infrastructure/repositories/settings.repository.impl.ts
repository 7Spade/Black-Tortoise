import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { WorkspaceSettingsEntity } from '@domain/aggregates';
import { SettingsRepository } from '@domain/repositories';

@Injectable({ providedIn: 'root' })
export class SettingsRepositoryImpl implements SettingsRepository {
  private firestore = inject(Firestore);
  private collectionName = 'settings';

  async getSettings(workspaceId: string): Promise<WorkspaceSettingsEntity> {
    const d = await getDoc(
      doc(this.firestore, `${this.collectionName}/${workspaceId}`),
    );
    if (d.exists()) {
      return d.data() as WorkspaceSettingsEntity;
    }
    return { workspaceId, theme: 'light' } as any;
  }
  async saveSettings(settings: WorkspaceSettingsEntity): Promise<void> {
    await setDoc(
      doc(this.firestore, `${this.collectionName}/${settings.workspaceId}`),
      settings,
    );
  }
}

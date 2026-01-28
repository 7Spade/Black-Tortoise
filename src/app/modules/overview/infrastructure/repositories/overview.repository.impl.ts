import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { OverviewDashboard, OverviewRepository } from '@overview/domain';

@Injectable({ providedIn: 'root' })
export class OverviewRepositoryImpl implements OverviewRepository {
  private firestore = inject(Firestore);
  private collectionName = 'overviews';

  async getDashboard(workspaceId: string): Promise<OverviewDashboard> {
    const d = await getDoc(
      doc(this.firestore, `${this.collectionName}/${workspaceId}`),
    );
    if (d.exists()) {
      return d.data() as OverviewDashboard;
    }
    // Stub
    return { workspaceId, widgetConfig: [] } as any;
  }
}

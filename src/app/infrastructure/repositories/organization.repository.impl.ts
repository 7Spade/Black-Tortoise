import { inject, Injectable } from '@angular/core';
import {
    collection,
    collectionData,
    doc,
    Firestore,
    getDoc,
    query,
    setDoc,
    where
} from '@angular/fire/firestore';
import { Organization } from '@domain/entities/organization.entity';
import { OrganizationRepository } from '@domain/repositories/organization.repository';
import { OrganizationId } from '@domain/value-objects/organization-id.vo';
import { UserId } from '@domain/value-objects/user-id.vo';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable()
export class OrganizationRepositoryImpl implements OrganizationRepository {
  private readonly firestore = inject(Firestore);
  private readonly collectionPath = 'organizations';

  /**
   * Save an organization
   */
  async save(organization: Organization): Promise<void> {
    const docRef = doc(this.firestore, `${this.collectionPath}/${organization.id.toString()}`);
    // Convert entity to plain object for Firestore
    const data = {
      id: organization.id.toString(),
      ownerId: organization.ownerId.toString(),
      displayName: organization.displayName
    };
    await setDoc(docRef, data);
  }

  /**
   * Find organization by ID
   */
  async findById(id: OrganizationId): Promise<Organization | null> {
    const docRef = doc(this.firestore, `${this.collectionPath}/${id.toString()}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return this.mapToEntity(data);
  }

  /**
   * Find organizations owned by a user
   */
  async findByOwner(ownerId: UserId): Promise<Organization[]> {
    const colRef = collection(this.firestore, this.collectionPath);
    const q = query(
      colRef,
      where('ownerId', '==', ownerId.toString())
    );

    const docs$ = collectionData(q, { idField: 'id' }) as Observable<any[]>;
    const docs = await firstValueFrom(docs$);
    return docs.map(doc => this.mapToEntity(doc));
  }

  private mapToEntity(data: any): Organization {
    return new Organization(
      OrganizationId.create(data.id),
      UserId.create(data.ownerId),
      data.displayName
    );
  }
}

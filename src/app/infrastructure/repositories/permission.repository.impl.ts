import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { RoleEntity } from '@domain/aggregates';
import { PermissionRepository } from '@domain/repositories';

@Injectable({ providedIn: 'root' })
export class PermissionRepositoryImpl implements PermissionRepository {
  private firestore = inject(Firestore);
  private collectionName = 'roles';

  async findAllRoles(workspaceId: string): Promise<RoleEntity[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('workspaceId', '==', workspaceId),
    );
    return (await getDocs(q)).docs.map((d) => d.data() as RoleEntity);
  }
  async findRoleById(roleId: string): Promise<RoleEntity | null> {
    const d = await getDoc(
      doc(this.firestore, `${this.collectionName}/${roleId}`),
    );
    return d.exists() ? (d.data() as RoleEntity) : null;
  }
  async saveRole(role: RoleEntity): Promise<void> {
    await setDoc(
      doc(this.firestore, `${this.collectionName}/${role.id}`),
      role,
    );
  }
  async deleteRole(roleId: string): Promise<void> {
    await deleteDoc(doc(this.firestore, `${this.collectionName}/${roleId}`));
  }
}

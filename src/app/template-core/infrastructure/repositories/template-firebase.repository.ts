import { Injectable, inject } from '@angular/core';
import { Firestore, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from '@angular/fire/firestore';
import { Template } from '../../domain/aggregates/template.aggregate';
import { ITemplateRepository } from '../../domain/repositories/template.repository';
import { TemplateFirestoreMapper } from '../mappers/template-firestore.mapper';

@Injectable()
export class TemplateFirebaseRepository implements ITemplateRepository {
  private firestore = inject(Firestore);
  private collectionName = 'templates';

  async findById(id: string): Promise<Template | null> {
    const docRef = doc(this.firestore, this.collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return TemplateFirestoreMapper.toDomain({ id: docSnap.id, ...docSnap.data() });
    } else {
      return null;
    }
  }

  async findAll(): Promise<Template[]> {
    const querySnapshot = await getDocs(collection(this.firestore, this.collectionName));
    return querySnapshot.docs.map(doc => 
        TemplateFirestoreMapper.toDomain({ id: doc.id, ...doc.data() })
    );
  }

  async save(template: Template): Promise<void> {
    const data = TemplateFirestoreMapper.toPersistence(template);
    const docRef = doc(this.firestore, this.collectionName, data.id);
    await setDoc(docRef, data);
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, this.collectionName, id));
  }
}

import { Injectable, inject } from '@angular/core';
import { Firestore, collection, deleteDoc, doc, getDocs, setDoc } from '@angular/fire/firestore';
import { TEMPLATE_EVENT_BUS_TOKEN, TEMPLATE_EVENT_STORE_TOKEN } from '@template-core/application/tokens/event-infrastructure.tokens';
import { Template } from '@template-core/domain/aggregates/template.aggregate';
import { ITemplateRepository } from '@template-core/domain/repositories/template.repository';
import { TemplateId } from '@template-core/domain/value-objects/template-id.vo';
import { TemplateFirestoreMapper } from '@template-core/infrastructure/mappers/template-firestore.mapper';

@Injectable()
export class TemplateFirebaseRepository implements ITemplateRepository {
  private firestore = inject(Firestore);
  private eventStore = inject(TEMPLATE_EVENT_STORE_TOKEN);
  private eventBus = inject(TEMPLATE_EVENT_BUS_TOKEN);
  private collectionName = 'templates';

  // Demonstrating Event Sourcing: Rehydrate from Events
  async findById(id: string): Promise<Template | null> {
    const history = await this.eventStore.load(id);
    if (history.length === 0) {
      return null;
    }
    return Template.load(TemplateId.from(id), history);
  }

  // Read Side: Query from Projection (Snapshot Collection)
  async findAll(): Promise<Template[]> {
    const querySnapshot = await getDocs(collection(this.firestore, this.collectionName));
    return querySnapshot.docs.map(doc => 
        TemplateFirestoreMapper.toDomain({ id: doc.id, ...doc.data() })
    );
  }

  // Write Side: Persist Events -> Publish -> Update Projection
  async save(template: Template): Promise<void> {
    const events = template.domainEvents;
    
    if (events.length === 0) {
        return;
    }

    // 1. Persist to Event Store (Source of Truth)
    await this.eventStore.save(events);

    // 2. Publish to Event Bus (Side Effects)
    await this.eventBus.publish(events);

    // 3. Update Projection (Read Model)
    const data = TemplateFirestoreMapper.toPersistence(template);
    const docRef = doc(this.firestore, this.collectionName, data.id);
    await setDoc(docRef, data);

    // 4. Clear uncommitted events
    template.clearDomainEvents();
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, this.collectionName, id));
  }
}

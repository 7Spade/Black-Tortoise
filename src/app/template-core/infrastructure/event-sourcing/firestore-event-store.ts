import { Injectable, inject } from '@angular/core';
import { Firestore, Timestamp, collection, doc, getDocs, orderBy, query, setDoc, where } from '@angular/fire/firestore';
import { ITemplateEventStore } from '../../application/ports/event-store.port';
import { TemplateDomainEvent } from '../../domain/base/domain-event';

@Injectable()
export class TemplateFirestoreEventStore implements ITemplateEventStore {
  private firestore = inject(Firestore);
  private collectionName = 'events';

  async save(events: TemplateDomainEvent[]): Promise<void> {
    const batchPromises = events.map(async event => {
      const docRef = doc(this.firestore, this.collectionName, event.eventId);
      await setDoc(docRef, {
        aggregateId: event.aggregateId,
        eventId: event.eventId,
        eventName: event.eventName,
        occurredOn: event.occurredOn,
        metadata: event.metadata,
        payload: { ...event } // Store all properties
      });
    });
    
    await Promise.all(batchPromises);
  }

  async load(aggregateId: string): Promise<TemplateDomainEvent[]> {
    const q = query(
      collection(this.firestore, this.collectionName),
      where('aggregateId', '==', aggregateId),
      orderBy('metadata.version', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    
    // In a real app, you'd map these back to concrete Event classes using a registry
    // For this template, we return raw objects cast as DomainEvent for simplicity
    // or we would need a switch case / registry to recreate specific event instances.
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data['payload'],
            occurredOn: (data['occurredOn'] as Timestamp).toDate()
        } as unknown as TemplateDomainEvent;
    });
  }
}

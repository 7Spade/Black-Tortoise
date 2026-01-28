import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where, Timestamp } from '@angular/fire/firestore';
import { CalendarRepository } from '@domain/repositories/calendar.repository';
import { CalendarEventAggregate } from '@calendar/domain/aggregates/calendar-event.aggregate';
import { CalendarEventMapper } from '@calendar/infrastructure/mappers/calendar-event.mapper';
import { CalendarEventDto } from '@calendar/infrastructure/models/calendar-event.dto';

@Injectable({ providedIn: 'root' })
export class CalendarEventRepository implements CalendarRepository {
    private firestore = inject(Firestore);
    private readonly collectionName = 'calendar_events';

    async findByWorkspaceId(workspaceId: string): Promise<CalendarEventAggregate[]> {
        const q = query(
            collection(this.firestore, this.collectionName),
            where('workspaceId', '==', workspaceId)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc =>
            CalendarEventMapper.toDomain(doc.data() as CalendarEventDto)
        );
    }

    async findById(id: string): Promise<CalendarEventAggregate | null> {
        const docRef = doc(this.firestore, this.collectionName, id);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
            return null;
        }

        return CalendarEventMapper.toDomain(snapshot.data() as CalendarEventDto);
    }

    async save(event: CalendarEventAggregate): Promise<void> {
        const dto = CalendarEventMapper.toDto(event);
        const docRef = doc(this.firestore, this.collectionName, dto.id);
        await setDoc(docRef, dto);
    }

    async delete(id: string): Promise<void> {
        const docRef = doc(this.firestore, this.collectionName, id);
        await deleteDoc(docRef);
    }
}

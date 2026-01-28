import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    where,
} from '@angular/fire/firestore';
import { AuditLogEntity } from '@domain/aggregates/audit-log.aggregate';
import { AuditLogRepository } from '@domain/repositories/audit-log.repository';
import { AuditLogMapper } from '../mappers/audit-log.mapper';
import { AuditLogDto } from '../models/audit-log.dto';

@Injectable({ providedIn: 'root' })
export class AuditLogRepositoryImpl implements AuditLogRepository {
    private firestore = inject(Firestore);
    private collectionName = 'audit-logs';

    async findById(id: string): Promise<AuditLogEntity | null> {
        const d = await getDoc(doc(this.firestore, `${this.collectionName}/${id}`));
        if (!d.exists()) return null;
        const dto = d.data() as AuditLogDto;
        return AuditLogMapper.toEntity(dto);
    }

    async findByWorkspaceId(workspaceId: string): Promise<AuditLogEntity[]> {
        const q = query(
            collection(this.firestore, this.collectionName),
            where('workspaceId', '==', workspaceId),
        );
        const docs = await getDocs(q);
        return docs.docs.map((d) => AuditLogMapper.toEntity(d.data() as AuditLogDto));
    }

    async save(entry: AuditLogEntity): Promise<void> {
        const dto = AuditLogMapper.toDto(entry);
        await setDoc(
            doc(this.firestore, `${this.collectionName}/${entry.id}`),
            dto,
        );
    }
}

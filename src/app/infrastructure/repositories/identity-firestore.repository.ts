import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { IdentityRepository } from '@domain/identity/repositories/identity.repository.interface';
import { IdentityId } from '@domain/identity/value-objects/identity-id.value-object';
import { Bot } from '@domain/identity/entities/bot.entity';
import { Organization } from '@domain/identity/entities/organization.entity';
import { User } from '@domain/identity/entities/user.entity';
import { Collections } from '../collections/collection-names';
import { asString, asStringArray } from '../mappers/firestore-mappers';

@Injectable()
export class IdentityFirestoreRepository implements IdentityRepository {
  private readonly firestore = inject(Firestore);

  getUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, Collections.users);
    return collectionData(usersRef, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((doc) => ({
          id: IdentityId.create(asString(doc['id'])),
          organizationIds: asStringArray(doc['organizationIds']),
          teamIds: asStringArray(doc['teamIds']),
          partnerIds: asStringArray(doc['partnerIds']),
          workspaceIds: asStringArray(doc['workspaceIds']),
        })),
      ),
      map((users) => users.map((user) => User.create(user))),
    );
  }

  getOrganizations(): Observable<Organization[]> {
    const organizationsRef = collection(this.firestore, Collections.organizations);
    return collectionData(organizationsRef, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((doc) => ({
          id: IdentityId.create(asString(doc['id'])),
          memberIds: asStringArray(doc['memberIds']),
          teamIds: asStringArray(doc['teamIds']),
          partnerIds: asStringArray(doc['partnerIds']),
          workspaceIds: asStringArray(doc['workspaceIds']),
        })),
      ),
      map((organizations) =>
        organizations.map((organization) => Organization.create(organization)),
      ),
    );
  }

  getBots(): Observable<Bot[]> {
    const botsRef = collection(this.firestore, Collections.bots);
    return collectionData(botsRef, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((doc) => ({
          id: IdentityId.create(asString(doc['id'])),
        })),
      ),
      map((bots) => bots.map((bot) => Bot.create(bot))),
    );
  }
}

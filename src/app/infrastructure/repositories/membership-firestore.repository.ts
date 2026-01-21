import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import type { Observable } from 'rxjs';
import type { MembershipRepository } from '@domain/membership/repositories/membership.repository.interface';
import { MembershipRole } from '@domain/membership/enums/membership-role.enum';
import { MembershipStatus } from '@domain/membership/enums/membership-status.enum';
import { OrganizationMembership } from '@domain/membership/entities/organization-membership.entity';
import { Partner } from '@domain/membership/entities/partner.entity';
import { Team } from '@domain/membership/entities/team.entity';
import { MembershipId } from '@domain/membership/value-objects/membership-id.value-object';
import { Collections } from '../collections/collection-names';
import { asString, asStringArray } from '../mappers/firestore-mappers';

@Injectable()
export class MembershipFirestoreRepository implements MembershipRepository {
  private readonly firestore = inject(Firestore);

  getTeams(organizationId: string): Observable<Team[]> {
    const teamsRef = collection(this.firestore, Collections.teams);
    const teamsQuery = query(
      teamsRef,
      where('organizationId', '==', organizationId),
    );
    return collectionData(teamsQuery, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((doc) => ({
          id: MembershipId.create(asString(doc['id'])),
          organizationId: asString(doc['organizationId']),
          memberIds: asStringArray(doc['memberIds']),
        })),
      ),
      map((teams) => teams.map((team) => Team.create(team))),
    );
  }

  getPartners(organizationId: string): Observable<Partner[]> {
    const partnersRef = collection(this.firestore, Collections.partners);
    const partnersQuery = query(
      partnersRef,
      where('organizationId', '==', organizationId),
    );
    return collectionData(partnersQuery, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((doc) => ({
          id: MembershipId.create(asString(doc['id'])),
          organizationId: asString(doc['organizationId']),
          memberIds: asStringArray(doc['memberIds']),
        })),
      ),
      map((partners) => partners.map((partner) => Partner.create(partner))),
    );
  }

  getOrganizationMemberships(
    organizationId: string,
  ): Observable<OrganizationMembership[]> {
    const membershipsRef = collection(
      this.firestore,
      Collections.organizationMemberships,
    );
    const membershipQuery = query(
      membershipsRef,
      where('organizationId', '==', organizationId),
    );
    return collectionData(membershipQuery, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((doc) => {
          const role = asString(doc['role']);
          const status = asString(doc['status']);
          return {
            id: MembershipId.create(asString(doc['id'])),
            organizationId: asString(doc['organizationId']),
            userId: asString(doc['userId']),
            role: Object.values(MembershipRole).includes(role as MembershipRole)
              ? (role as MembershipRole)
              : MembershipRole.Member,
            status: Object.values(MembershipStatus).includes(
              status as MembershipStatus,
            )
              ? (status as MembershipStatus)
              : MembershipStatus.Active,
          };
        }),
      ),
      map((memberships) =>
        memberships.map((membership) => OrganizationMembership.create(membership)),
      ),
    );
  }
}

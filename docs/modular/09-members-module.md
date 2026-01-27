# Members Module Design

## 1. Responsibilities
- Workspace Member Management.
- Invitations & Onboarding.
- Role Assignment (Interface to Permissions).

## 2. Architecture
- **Store**: `MembersStore` (SignalStore).
- **Infrastructure**: `MembersFirestoreRepository`.

## 3. Data Structures
### Entities
- `Member`: 
  - userId, displayName, email, avatar.
  - roles[] (RoleIds).
  - joinedAt, status (Active/Invited).
- `Invitation`: email, roles, token, expiry.

## 4. Key Logic & Signals
- **State**: `members` (Map), `invitations` (List).
- **Methods**: `inviteMember`, `removeMember`, `assignRole`.
- **Initialization**: Creator is auto-added as Owner.

## 5. UI Specifications
- **Member List**: Table with Role dropdowns.
- **Invite Dialog**: Email input, Role multi-select.
- **Profile Card**: User stats.

## 6. Events
- **Publish**: `MemberInvited`, `MemberAdded`, `MemberRemoved`, `MemberRoleChanged`.
- **Subscribe**: None.

## 7. File Tree
```
src/app/
  application/
    stores/
      members.store.ts
  domain/
    members/
      entities/
        member.entity.ts
  infrastructure/
    members/
      members.firestore.repository.ts
  presentation/
    members/
      components/
        member-list/
        invite-dialog/
      members.component.ts
```

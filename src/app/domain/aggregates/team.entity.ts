/**
 * Team Entity
 * 
 * Layer: Domain
 * DDD Pattern: Entity
 * 
 * Represents a team within an organization.
 * Teams are organizational filters for grouping members.
 */

export interface TeamEntity {
  readonly id: string;
  readonly name: string;
  readonly organizationId: string;
  readonly memberIds: string[];
  readonly description?: string | undefined;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Create a new Team entity
 */
export function createTeam(
  id: string,
  name: string,
  organizationId: string,
  description?: string
): TeamEntity {
  return {
    id,
    name,
    organizationId,
    memberIds: [],
    description,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Add member to team
 */
export function addMemberToTeam(
  team: TeamEntity,
  memberId: string
): TeamEntity {
  if (team.memberIds.includes(memberId)) {
    return team;
  }
  
  return {
    ...team,
    memberIds: [...team.memberIds, memberId],
    updatedAt: new Date(),
  };
}

/**
 * Remove member from team
 */
export function removeMemberFromTeam(
  team: TeamEntity,
  memberId: string
): TeamEntity {
  return {
    ...team,
    memberIds: team.memberIds.filter(id => id !== memberId),
    updatedAt: new Date(),
  };
}

/**
 * Update team details
 */
export function updateTeam(
  team: TeamEntity,
  name?: string,
  description?: string
): TeamEntity {
  return {
    ...team,
    name: name ?? team.name,
    description: description ?? team.description,
    updatedAt: new Date(),
  };
}

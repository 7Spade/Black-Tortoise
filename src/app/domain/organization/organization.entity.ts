/**
 * Organization Entity (Minimal)
 *
 * Layer: Domain
 * Purpose: Minimal organization existence (id + displayName)
 */

export interface OrganizationEntity {
  readonly id: string;
  readonly displayName: string;
}


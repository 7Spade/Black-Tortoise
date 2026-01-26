
export type AcceptanceId = string & { readonly __brand: 'AcceptanceId' };

export function createAcceptanceId(id: string): AcceptanceId {
  return id as AcceptanceId;
}

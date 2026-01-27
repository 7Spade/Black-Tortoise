/**
 * Money Mapper
 *
 * Layer: Infrastructure
 * DDD Pattern: Mapper
 *
 * Maps Money value object to/from Firestore document format.
 */

import { Money, createMoney } from '@domain/value-objects/money.vo';

export interface MoneyDTO {
  amount: number;
  currency: string;
}

export class MoneyMapper {
  /**
   * Convert Money VO to DTO for Firestore
   */
  public static toDTO(money: Money | null): MoneyDTO | null {
    if (!money) return null;

    return {
      amount: money.amount,
      currency: money.currency,
    };
  }

  /**
   * Convert DTO from Firestore to Money VO
   */
  public static toDomain(dto: MoneyDTO | null | undefined): Money | null {
    if (!dto) return null;

    return createMoney(dto.amount, dto.currency);
  }
}

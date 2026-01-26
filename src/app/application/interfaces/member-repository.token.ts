import { InjectionToken } from '@angular/core';
import { MemberRepository } from '@domain/repositories';

export const MEMBER_REPOSITORY = new InjectionToken<MemberRepository>('MEMBER_REPOSITORY');

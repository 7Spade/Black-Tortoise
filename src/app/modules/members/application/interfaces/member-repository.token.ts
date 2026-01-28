import { InjectionToken } from '@angular/core';
import { MemberRepository } from '@members/domain';

export const MEMBER_REPOSITORY = new InjectionToken<MemberRepository>('MEMBER_REPOSITORY');

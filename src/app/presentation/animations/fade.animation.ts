import { animate, style, transition, trigger } from '@angular/animations';

// Fade animations for Material Design 3
export const fadeAnimation = trigger('fade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-in', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms ease-out', style({ opacity: 0 }))
  ])
]);

export const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-in', style({ opacity: 1 }))
  ])
]);

export const fadeOutAnimation = trigger('fadeOut', [
  transition(':leave', [
    animate('300ms ease-out', style({ opacity: 0 }))
  ])
]);
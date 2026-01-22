import { animate, keyframes, style, transition, trigger } from '@angular/animations';

// Bounce animations for Material Design 3
export const bounceIn = trigger('bounceIn', [
  transition(':enter', [
    animate('600ms ease-in', keyframes([
      style({ transform: 'scale(0.3)', opacity: 0, offset: 0 }),
      style({ transform: 'scale(1.05)', opacity: 1, offset: 0.5 }),
      style({ transform: 'scale(0.9)', offset: 0.7 }),
      style({ transform: 'scale(1)', offset: 1 })
    ]))
  ])
]);

export const bounceOut = trigger('bounceOut', [
  transition(':leave', [
    animate('600ms ease-out', keyframes([
      style({ transform: 'scale(1)', offset: 0 }),
      style({ transform: 'scale(1.05)', offset: 0.3 }),
      style({ transform: 'scale(0.3)', opacity: 0, offset: 1 })
    ]))
  ])
]);

export const bounce = trigger('bounce', [
  transition('* => bounce', [
    animate('600ms ease-in-out', keyframes([
      style({ transform: 'translateY(0)', offset: 0 }),
      style({ transform: 'translateY(-30px)', offset: 0.5 }),
      style({ transform: 'translateY(0)', offset: 1 })
    ]))
  ])
]);
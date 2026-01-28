/**
 * Responsive Directive
 * Presentation Layer - Layout
 * 
 * Detects and reacts to viewport breakpoint changes
 * Signal-based breakpoint state
 */

import { Directive, inject, signal, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface BreakpointConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

const DEFAULT_BREAKPOINTS: BreakpointConfig = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
  xxl: 2560,
};

@Directive({
  selector: '[appResponsive]',
  standalone: true,
})
export class ResponsiveDirective {
  private readonly document = inject(DOCUMENT);

  readonly currentBreakpoint = signal<Breakpoint>('md');
  readonly isXs = signal(false);
  readonly isSm = signal(false);
  readonly isMd = signal(false);
  readonly isLg = signal(false);
  readonly isXl = signal(false);
  readonly isXxl = signal(false);

  private mediaQueryLists: Map<Breakpoint, MediaQueryList> = new Map();

  constructor() {
    this.initializeMediaQueries();
    this.updateBreakpoint();

    effect(() => {
      const breakpoint = this.currentBreakpoint();
      this.isXs.set(breakpoint === 'xs');
      this.isSm.set(breakpoint === 'sm');
      this.isMd.set(breakpoint === 'md');
      this.isLg.set(breakpoint === 'lg');
      this.isXl.set(breakpoint === 'xl');
      this.isXxl.set(breakpoint === 'xxl');
    });
  }

  private initializeMediaQueries(): void {
    const window = this.document.defaultView;
    if (!window) return;

    Object.entries(DEFAULT_BREAKPOINTS).forEach(([key, value]) => {
      const query = `(min-width: ${value}px)`;
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', () => this.updateBreakpoint());
      this.mediaQueryLists.set(key as Breakpoint, mediaQuery);
    });
  }

  private updateBreakpoint(): void {
    const window = this.document.defaultView;
    if (!window) return;

    const width = window.innerWidth;
    const breakpoints = Object.entries(DEFAULT_BREAKPOINTS)
      .sort(([, a], [, b]) => b - a);

    for (const [key, value] of breakpoints) {
      if (width >= value) {
        this.currentBreakpoint.set(key as Breakpoint);
        break;
      }
    }
  }
}

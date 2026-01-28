/**
 * Landing Page Component
 *
 * Layer: Presentation - Pages
 * Purpose: Public landing page for unauthenticated users
 * Architecture: Zone-less, OnPush, Angular 20 control flow
 *
 * Responsibilities:
 * - Display welcome message
 * - Provide navigation to Login/Register
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="landing-container">
      <header class="hero">
        <h1>Black Tortoise</h1>
        <p class="subtitle">Secure, Event-Sourced Workspace Management</p>

        <div class="actions">
          <a routerLink="/auth/login" class="btn btn-primary">Login</a>
          <a routerLink="/auth/register" class="btn btn-outline">Register</a>
        </div>
      </header>

      <section class="features">
        <div class="feature-card">
          <h3>Domain-Driven</h3>
          <p>Built with strict DDD principles and clean architecture.</p>
        </div>
        <div class="feature-card">
          <h3>Event Sourced</h3>
          <p>Full audit trail and temporal queries with Event Sourcing.</p>
        </div>
        <div class="feature-card">
          <h3>Zone-less Angular</h3>
          <p>High performance with Angular 20+ Signals and OnPush.</p>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .landing-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        font-family: var(--mat-sys-typescale-body-large-font);
      }

      .hero {
        text-align: center;
        padding: 4rem 0;
        background: var(--mat-sys-surface-container-low);
        border-radius: 16px;
        margin-bottom: 2rem;
      }

      h1 {
        font-size: 3.5rem;
        margin-bottom: 1rem;
        color: var(--mat-sys-primary);
      }

      .subtitle {
        font-size: 1.5rem;
        color: var(--mat-sys-on-surface-variant);
        margin-bottom: 2rem;
      }

      .actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
      }

      .btn {
        padding: 0.75rem 2rem;
        border-radius: 24px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.2s;
      }

      .btn-primary {
        background: var(--mat-sys-primary);
        color: var(--mat-sys-on-primary);
      }

      .btn-primary:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .btn-outline {
        border: 1px solid var(--mat-sys-outline);
        color: var(--mat-sys-primary);
      }

      .btn-outline:hover {
        background: var(--mat-sys-surface-variant);
      }

      .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }

      .feature-card {
        padding: 2rem;
        background: var(--mat-sys-surface);
        border-radius: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }

      h3 {
        color: var(--mat-sys-primary);
        margin-bottom: 0.5rem;
      }
    `,
  ],
})
export class LandingPage {}

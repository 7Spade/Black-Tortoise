import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '@application/stores';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <h2>Login</h2>

      @if (authStore.error()) {
        <div class="error">{{ authStore.error() }}</div>
      }

      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" name="email" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            type="password"
            [(ngModel)]="password"
            name="password"
            required
          />
        </div>

        <button type="submit" [disabled]="authStore.loading()">
          @if (authStore.loading()) {
            Logging in...
          } @else {
            Login
          }
        </button>
      </form>

      <p>Don't have an account? <a routerLink="/auth/register">Register</a></p>
      <p>
        <a routerLink="/auth/forgot-password">Forgot Password?</a>
      </p>
    </div>
  `,
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  readonly authStore = inject(AuthStore);
  readonly router = inject(Router);

  email = '';
  password = '';

  async onSubmit() {
    await this.authStore.login(this.email, this.password);
    if (!this.authStore.error()) {
      this.router.navigate(['/']);
    }
  }
}

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@application/stores';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <h2>Forgot Password</h2>

      @if (message) {
        <div class="success">{{ message }}</div>
      }

      @if (authStore.error()) {
        <div class="error">{{ authStore.error() }}</div>
      }

      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" name="email" required />
        </div>

        <button type="submit" [disabled]="authStore.loading()">
          @if (authStore.loading()) {
            Sending...
          } @else {
            Send Reset Link
          }
        </button>
      </form>

      <p>
        <a routerLink="/auth/login">Back to Login</a>
      </p>
    </div>
  `,
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  readonly authStore = inject(AuthStore);

  email = '';
  message = '';

  async onSubmit() {
    this.message = '';
    await this.authStore.resetPassword(this.email);
    if (!this.authStore.error()) {
      this.message = 'Password reset email sent. Please check your inbox.';
    }
  }
}

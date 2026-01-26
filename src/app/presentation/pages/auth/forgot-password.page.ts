import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@application/stores';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <h2>Forgot Password</h2>
      <div *ngIf="message" class="success">{{ message }}</div>
      <div *ngIf="authStore.error()" class="error">{{ authStore.error() }}</div>
      
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" name="email" required>
        </div>
        
        <button type="submit" [disabled]="authStore.loading()">
          {{ authStore.loading() ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>
      
      <p>
        <a routerLink="/auth/login">Back to Login</a>
      </p>
    </div>
  `,
  styles: [`
    .auth-container { max-width: 400px; margin: 2rem auto; padding: 2rem; border: 1px solid #ccc; border-radius: 8px; }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; }
    input { width: 100%; padding: 0.5rem; }
    .error { color: red; margin-bottom: 1rem; }
    .success { color: green; margin-bottom: 1rem; }
    button { width: 100%; padding: 0.75rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { background: #ccc; }
  `]
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

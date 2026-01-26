import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '@application/stores';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <h2>Register</h2>
      
      @if (authStore.error()) {
        <div class="error">{{ authStore.error() }}</div>
      }
      
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Display Name</label>
          <input type="text" [(ngModel)]="displayName" name="displayName" required>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" name="email" required>
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input type="password" [(ngModel)]="password" name="password" required>
        </div>
        
        <button type="submit" [disabled]="authStore.loading()">
          @if (authStore.loading()) {
            Registering...
          } @else {
            Register
          }
        </button>
      </form>
      
      <p>
        Already have an account? <a routerLink="/auth/login">Login</a>
      </p>
    </div>
  `,
  styles: [`
    .auth-container { max-width: 400px; margin: 2rem auto; padding: 2rem; border: 1px solid #ccc; border-radius: 8px; }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; }
    input { width: 100%; padding: 0.5rem; }
    .error { color: red; margin-bottom: 1rem; }
    button { width: 100%; padding: 0.75rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { background: #ccc; }
  `]
})
export class RegisterPage {
  readonly authStore = inject(AuthStore);
  readonly router = inject(Router);
  
  displayName = '';
  email = '';
  password = '';

  async onSubmit() {
    await this.authStore.register(this.email, this.password, this.displayName);
    if (!this.authStore.error()) {
      this.router.navigate(['/']);
    }
  }
}

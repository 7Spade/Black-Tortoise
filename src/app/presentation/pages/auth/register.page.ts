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
          <input
            type="text"
            [(ngModel)]="displayName"
            name="displayName"
            required
          />
        </div>

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
            Registering...
          } @else {
            Register
          }
        </button>
      </form>

      <p>Already have an account? <a routerLink="/auth/login">Login</a></p>
    </div>
  `,
  styleUrls: ['./register.page.scss'],
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

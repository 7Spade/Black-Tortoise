import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthStore } from '@application/stores/auth.store';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Sign in</mat-card-title>
          <mat-card-subtitle>AngularFire authentication</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form class="login-form" [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                autocomplete="email"
                required
              />
              @if (emailControl.touched && emailControl.invalid) {
                <mat-error>Enter a valid email address.</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input
                matInput
                type="password"
                formControlName="password"
                autocomplete="current-password"
                required
              />
              @if (passwordControl.touched && passwordControl.invalid) {
                <mat-error>Password is required.</mat-error>
              }
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="form.invalid || authStore.loading()"
            >
              Sign in
            </button>
          </form>

          @if (authStore.error(); as error) {
            <p class="login-error" role="alert">{{ error }}</p>
          }
        </mat-card-content>
      </mat-card>
    </section>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(100vh - var(--app-header-height, 0px));
        padding: 24px;
        background: var(--mat-sys-surface, #fafafa);
      }

      .login-card {
        max-width: 420px;
        width: 100%;
      }

      mat-card-title {
        font: var(--mat-sys-headline-small);
      }

      mat-card-subtitle {
        font: var(--mat-sys-title-small);
      }

      .login-form {
        display: grid;
        gap: 16px;
      }

      .login-error {
        margin-top: 12px;
        color: var(--mat-sys-error, #b91c1c);
        font: var(--mat-sys-body-medium);
      }
    `,
  ],
})
export class HomePageComponent {
  readonly authStore = inject(AuthStore);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  readonly emailControl = this.form.controls.email;
  readonly passwordControl = this.form.controls.password;

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const { email, password } = this.form.getRawValue();
    this.authStore.signIn({ email, password });
  }
}

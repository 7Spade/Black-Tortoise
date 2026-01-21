import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthStore } from '@application/stores/auth.store';

type AuthMode = 'login' | 'register' | 'reset';

const toAuthMode = (value: string | null): AuthMode =>
  value === 'register' || value === 'reset' ? value : 'login';

const passwordMatchValidator = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password')?.value ?? '';
  const confirm = control.get('confirmPassword')?.value ?? '';
  if (!password || !confirm) {
    return null;
  }
  return password === confirm ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="auth-shell">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>{{ title() }}</mat-card-title>
          <mat-card-subtitle>{{ subtitle() }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          @switch (mode()) {
            @case ('login') {
              <form
                class="auth-form"
                [formGroup]="loginForm"
                (ngSubmit)="onLoginSubmit()"
              >
                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input
                    matInput
                    type="email"
                    formControlName="email"
                    autocomplete="email"
                    required
                  />
                  @if (loginEmail.touched && loginEmail.invalid) {
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
                  @if (loginPassword.touched && loginPassword.invalid) {
                    <mat-error>Password is required.</mat-error>
                  }
                </mat-form-field>

                <button
                  mat-raised-button
                  color="primary"
                  type="submit"
                  [disabled]="loginForm.invalid || authStore.loading()"
                >
                  Sign in
                </button>
              </form>
              <div class="auth-links">
                <a routerLink="/auth/reset">Forgot password?</a>
                <span>
                  New here?
                  <a routerLink="/auth/register">Create an account</a>
                </span>
              </div>
            }
            @case ('register') {
              <form
                class="auth-form"
                [formGroup]="registerForm"
                (ngSubmit)="onRegisterSubmit()"
              >
                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input
                    matInput
                    type="email"
                    formControlName="email"
                    autocomplete="email"
                    required
                  />
                  @if (registerEmail.touched && registerEmail.invalid) {
                    <mat-error>Enter a valid email address.</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Password</mat-label>
                  <input
                    matInput
                    type="password"
                    formControlName="password"
                    autocomplete="new-password"
                    required
                  />
                  @if (registerPassword.touched && registerPassword.invalid) {
                    <mat-error>Password must be at least 6 characters.</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Confirm password</mat-label>
                  <input
                    matInput
                    type="password"
                    formControlName="confirmPassword"
                    autocomplete="new-password"
                    required
                  />
                  @if (
                    registerConfirm.touched &&
                    (registerConfirm.invalid || registerForm.hasError('passwordMismatch'))
                  ) {
                    <mat-error>Passwords must match.</mat-error>
                  }
                </mat-form-field>

                <button
                  mat-raised-button
                  color="primary"
                  type="submit"
                  [disabled]="registerForm.invalid || authStore.loading()"
                >
                  Create account
                </button>
              </form>
              <div class="auth-links">
                <span>
                  Already have an account?
                  <a routerLink="/auth/login">Sign in</a>
                </span>
              </div>
            }
            @case ('reset') {
              <form
                class="auth-form"
                [formGroup]="resetForm"
                (ngSubmit)="onResetSubmit()"
              >
                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input
                    matInput
                    type="email"
                    formControlName="email"
                    autocomplete="email"
                    required
                  />
                  @if (resetEmail.touched && resetEmail.invalid) {
                    <mat-error>Enter a valid email address.</mat-error>
                  }
                </mat-form-field>

                <button
                  mat-raised-button
                  color="primary"
                  type="submit"
                  [disabled]="resetForm.invalid || authStore.loading()"
                >
                  Send reset link
                </button>
              </form>
              @if (resetSent() && !authStore.error()) {
                <p class="auth-success" role="status">
                  Reset email sent. Check your inbox.
                </p>
              }
              <div class="auth-links">
                <span>
                  Remembered your password?
                  <a routerLink="/auth/login">Sign in</a>
                </span>
              </div>
            }
          }

          @if (authStore.error(); as error) {
            <p class="auth-error" role="alert">{{ error }}</p>
          }
        </mat-card-content>
      </mat-card>
    </section>
  `,
  styles: [
    `
      .auth-shell {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 24px;
        background: var(--mat-sys-surface, #f6f6f6);
      }

      .auth-card {
        width: min(480px, 100%);
      }

      .auth-form {
        display: grid;
        gap: 16px;
      }

      .auth-links {
        margin-top: 16px;
        display: grid;
        gap: 8px;
        font: var(--mat-sys-body-small);
      }

      .auth-error {
        margin-top: 12px;
        color: var(--mat-sys-error, #b91c1c);
        font: var(--mat-sys-body-medium);
      }

      .auth-success {
        margin-top: 12px;
        color: var(--mat-sys-primary, #2563eb);
        font: var(--mat-sys-body-medium);
      }

      @media (max-width: 600px) {
        .auth-shell {
          padding: 16px;
        }

        .auth-card {
          border-radius: var(--mat-sys-corner-medium, 12px);
        }
      }
    `,
  ],
})
export class AuthPageComponent {
  readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly mode = toSignal(
    this.route.paramMap.pipe(map((params) => toAuthMode(params.get('mode')))),
    { initialValue: 'login' as AuthMode },
  );

  readonly title = computed(() => {
    switch (this.mode()) {
      case 'register':
        return 'Create your account';
      case 'reset':
        return 'Reset your password';
      default:
        return 'Sign in';
    }
  });

  readonly subtitle = computed(() => {
    switch (this.mode()) {
      case 'register':
        return 'Join with a secure Firebase account.';
      case 'reset':
        return 'We will send a reset link to your email.';
      default:
        return 'Use your Firebase credentials to continue.';
    }
  });

  readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  readonly registerForm = new FormGroup(
    {
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: passwordMatchValidator },
  );

  readonly resetForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  readonly resetSent = signal(false);
  private readonly resetRequested = signal(false);

  readonly loginEmail = this.loginForm.controls.email;
  readonly loginPassword = this.loginForm.controls.password;
  readonly registerEmail = this.registerForm.controls.email;
  readonly registerPassword = this.registerForm.controls.password;
  readonly registerConfirm = this.registerForm.controls.confirmPassword;
  readonly resetEmail = this.resetForm.controls.email;

  constructor() {
    effect(() => {
      if (this.authStore.isAuthenticated()) {
        this.router.navigate(['/app']);
      }
    });

    effect(() => {
      const currentMode = this.mode();
      this.authStore.clearError();
      this.resetSent.set(false);
      this.resetRequested.set(false);
      switch (currentMode) {
        case 'login':
          this.loginForm.reset();
          break;
        case 'register':
          this.registerForm.reset();
          break;
        case 'reset':
          this.resetForm.reset();
          break;
      }
    });

    effect(() => {
      if (this.mode() !== 'reset') {
        return;
      }
      const hasError = this.authStore.error();
      const isDone = this.resetRequested() && !this.authStore.loading() && !hasError;
      if (isDone) {
        this.resetSent.set(true);
        this.resetRequested.set(false);
      }
      if (hasError) {
        this.resetSent.set(false);
        this.resetRequested.set(false);
      }
    });
  }

  onLoginSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }
    this.authStore.signIn(this.loginForm.getRawValue());
  }

  onRegisterSubmit(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) {
      return;
    }
    const { email, password } = this.registerForm.getRawValue();
    this.authStore.signUp({ email, password });
  }

  onResetSubmit(): void {
    this.resetForm.markAllAsTouched();
    if (this.resetForm.invalid) {
      return;
    }
    this.resetSent.set(false);
    this.resetRequested.set(true);
    this.authStore.sendPasswordReset(this.resetForm.getRawValue().email);
  }
}

import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IonInput,
  IonButton,
  IonText,
  IonIcon,
  IonInputPasswordToggle,
  IonSpinner,
} from '@ionic/angular/standalone';

import { logoGoogle, logoApple } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '../../../blocks/layouts/auth/auth-layout.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonInput,
    IonButton,
    IonText,
    IonIcon,
    IonInputPasswordToggle,
    RouterModule,
    AuthLayoutComponent,
    IonSpinner,
  ],
})
export class LoginPage {
  loginForm: FormGroup;
  showPassword = false;
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    addIcons({ logoGoogle, logoApple });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get emailError(): string {
    const control = this.email;
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) return 'Email is required';
      if (control.hasError('email')) return 'Valid email is required';
    }
    return '';
  }

  get passwordError(): string {
    const control = this.password;
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) return 'Password is required';
    }
    return '';
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.errorMessage.set('');
    this.loading.set(true);
    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.message === 'Firebase: Error (auth/user-not-found).') {
          this.errorMessage.set('User not found');
          return;
        }
        if (err.message === 'Firebase: Error (auth/invalid-credential).') {
          this.errorMessage.set('Invalid credentials');
          return;
        }
        this.errorMessage.set('Login failed: ' + err.message);
      },
    });
  }

  async signInWithGoogle() {
    this.loading.set(true);
    this.errorMessage.set('');
    this.authService.googleSignIn().subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.message === 'Firebase: Error (auth/invalid-credentials).') {
          this.errorMessage.set('Invalid credentials');
          return;
        }
        this.errorMessage.set('Google sign-in failed: ' + err.message);
      },
    });
  }

  async signInWithApple() {
    this.loading.set(true);
    this.errorMessage.set('');
    this.authService.appleSignIn().subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.message === 'Firebase: Error (auth/invalid-credentials).') {
          this.errorMessage.set('Invalid credentials');
          return;
        }
        this.errorMessage.set('Apple sign-in failed: ' + err.message);
      },
    });
  }
}

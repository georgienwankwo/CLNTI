import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
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
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonInput,
    IonButton,
    IonText,
    IonIcon,
    RouterModule,
    IonInputPasswordToggle,
    AuthLayoutComponent,
    IonSpinner,
  ],
})
export class SignupPage {
  signupForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    addIcons({ logoGoogle, logoApple });

    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(8), this.passwordStrengthValidator],
      ],
      confirmPassword: ['', [Validators.required, this.passwordMatchValidator]],
    });

    // Subscribe to password changes to re-validate confirmPassword
    this.signupForm.get('password')?.valueChanges.subscribe(() => {
      this.signupForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  // Custom validator for password strength
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[^a-zA-Z0-9]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

    return !passwordValid ? { weakPassword: true } : null;
  }

  // Custom validator for password matching
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.parent?.get('password')?.value;
    const confirmPassword = control.value;

    if (!password || !confirmPassword) {
      return null; // Let required validator handle empty fields
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get name() {
    return this.signupForm.get('name');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  get nameError(): string {
    const control = this.name;
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) return 'Name is required';
    }
    return '';
  }

  get emailError(): string {
    const control = this.email;
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) return 'Email is required';
      if (control.hasError('email')) return 'Invalid email address';
    }
    return '';
  }

  get passwordError(): string {
    const control = this.password;
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) return 'Password is required';
      if (control.hasError('minlength')) return 'Password must be at least 8 characters';
      if (control.hasError('weakPassword'))
        return 'Password must contain uppercase, lowercase, number, and special character';
    }
    return '';
  }

  get confirmPasswordError(): string {
    const control = this.confirmPassword;
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) return 'Confirm Password is required';
      if (control.hasError('passwordMismatch')) return 'Passwords do not match';
    }
    return '';
  }

  signup() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.signupForm.value;

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.signup(email, password, name).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.message === 'Firebase: Error (auth/email-already-in-use).') {
          this.errorMessage.set('Email already in use.');
        } else {
          this.errorMessage.set(err.message);
        }
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
        this.errorMessage.set(err.message);
      },
    });
  }

  async signInWithApple() {
    this.loading.set(true);
    this.authService.appleSignIn().subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }
}

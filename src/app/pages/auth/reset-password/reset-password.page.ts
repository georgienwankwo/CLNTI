import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  IonInputPasswordToggle,
  ToastController,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '../../../blocks/layouts/auth/auth-layout.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.page.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonInput,
    IonButton,
    IonText,
    RouterModule,
    IonInputPasswordToggle,
    AuthLayoutComponent,
  ],
})
export class ResetPasswordPage implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastController,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
    this.resetForm = this.fb.group({
      password: [
        '',
        [Validators.required, Validators.minLength(8), this.passwordStrengthValidator],
      ],
      confirmPassword: ['', [Validators.required, this.passwordMatchValidator]],
    });

    // Subscribe to password changes to re-validate confirmPassword
    this.resetForm.get('password')?.valueChanges.subscribe(() => {
      this.resetForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('oobCode');

    if (!this.token) {
      this.presentToast('Invalid or missing reset token');
      this.router.navigate(['/auth/login']);
    }
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
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get password() {
    return this.resetForm.get('password');
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword');
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

  async resetPassword() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const { password } = this.resetForm.value;

    try {
      this.authService.confirmPasswordReset(this.token!, password).subscribe({
        next: async () => {
          await this.presentToast('Password updated successfully');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => this.presentToast('Failed to reset password: ' + err.message),
      });
    } catch (err: any) {
      this.presentToast('Failed to reset password');
    }
  }

  async presentToast(message: string) {
    const t = await this.toast.create({
      message,
      duration: 2500,
      position: 'top',
    });
    t.present();
  }
}

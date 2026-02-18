import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { IonButton, IonInput, IonText } from '@ionic/angular/standalone';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'page-profile',
  templateUrl: `./profile.page.html`,
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonInput, IonButton, IonText],
})
export class ProfilePage implements OnInit {
  private authService = inject(AuthService);
  private toastController = inject(ToastController);
  private fb = inject(FormBuilder);

  profileForm: FormGroup;
  passwordForm: FormGroup;

  name = 'Profile';

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [{ value: '', disabled: true }],
      phone: [''],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: [
        '',
        [Validators.required, Validators.minLength(8), this.passwordStrengthValidator],
      ],
      confirmPassword: ['', [Validators.required, this.passwordMatchValidator.bind(this)]],
    });

    // Re-validate confirmPassword when newPassword changes
    this.passwordForm.get('newPassword')?.valueChanges.subscribe(() => {
      this.passwordForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  // Custom validator for password strength
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[^a-zA-Z0-9]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;
    return !passwordValid ? { weakPassword: true } : null;
  }

  // Custom validator for password matching
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = this.passwordForm?.get('newPassword')?.value;
    const confirmPassword = control.value;
    if (!password || !confirmPassword) return null;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  loadProfile() {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
        });
      },
      error: (err) => {
        console.error('Error loading profile', err);
        this.showToast('Error loading profile', 'danger');
      },
    });
  }

  async saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, phone } = this.profileForm.getRawValue();
    const updateData = {
      firstName,
      lastName,
      phone,
      name: `${firstName} ${lastName}`.trim(),
    };

    this.authService.updateProfile(updateData).subscribe({
      next: () => {
        this.showToast('Profile updated successfully');
      },
      error: (err) => {
        console.error('Error updating profile', err);
        this.showToast('Error updating profile', 'danger');
      },
    });
  }

  async changePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.showToast('Password updated successfully');
        this.passwordForm.reset();
      },
      error: (err) => {
        console.error('Error changing password', err);
        this.showToast('Error: ' + (err.message || 'Failed to change password'), 'danger');
      },
    });
  }

  private async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color,
    });
    await toast.present();
  }

  // Error helpers
  get passwordError(): string {
    const control = this.passwordForm.get('newPassword');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) return 'New password is required';
      if (control.hasError('minlength')) return 'Password must be at least 8 characters';
      if (control.hasError('weakPassword'))
        return 'Must contain uppercase, lowercase, number, and special character';
    }
    return '';
  }

  get confirmPasswordError(): string {
    const control = this.passwordForm.get('confirmPassword');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) return 'Confirm password is required';
      if (control.hasError('passwordMismatch')) return 'Passwords do not match';
    }
    return '';
  }
}

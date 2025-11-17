import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonInput,
  IonButton,
  IonText,
  IonIcon,
  IonInputPasswordToggle,
} from '@ionic/angular/standalone';

import { logoGoogle, logoApple } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '../../../blocks/layouts/auth/auth-layout.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonInput,
    IonButton,
    IonText,
    IonIcon,
    RouterModule,
    IonInputPasswordToggle,
    AuthLayoutComponent,
  ],
})
export class SignupPage {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirmPassword = false;

  constructor() {
    addIcons({ logoGoogle, logoApple });
  }

  signup() {
    if (!this.name || !this.email || !this.password) {
      alert('Please fill in all fields.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    console.log('User signed up:', {
      name: this.name,
      email: this.email,
    });

    alert('Signup successful!');
  }

  async signInWithGoogle() {
    try {
      // Example placeholder – replace with your real Google auth integration
      console.log('Google OAuth initiated');
      alert('Google login initiated (connect your auth SDK here).');
    } catch (err) {
      console.error('Google sign-in failed', err);
    }
  }

  async signInWithApple() {
    try {
      // Example placeholder – replace with Apple SignIn plugin or your backend
      console.log('Apple OAuth initiated');
      alert('Apple login initiated (connect your auth SDK here).');
    } catch (err) {
      console.error('Apple sign-in failed', err);
    }
  }
}

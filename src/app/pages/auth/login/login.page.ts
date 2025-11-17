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
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonInput,
    IonButton,
    IonText,
    IonIcon,
    IonInputPasswordToggle,
    RouterModule,
    AuthLayoutComponent,
  ],
})
export class LoginPage {
  email = '';
  password = '';
  showPassword = false;

  constructor() {
    addIcons({ logoGoogle, logoApple });
  }

  login() {
    if (!this.email || !this.password) {
      alert('Please fill in all fields.');
      return;
    }

    console.log('Login attempt:', { email: this.email });
    alert('Login successful (mock)!');
  }

  async signInWithGoogle() {
    try {
      console.log('Google OAuth login started');
      alert('Google login initiated (connect your auth SDK here).');
    } catch (err) {
      console.error('Google sign-in failed', err);
    }
  }

  async signInWithApple() {
    try {
      console.log('Apple OAuth login started');
      alert('Apple login initiated (connect your auth SDK here).');
    } catch (err) {
      console.error('Apple sign-in failed', err);
    }
  }
}

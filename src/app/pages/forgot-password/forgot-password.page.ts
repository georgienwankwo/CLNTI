import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '../../blocks/layouts/auth/auth-layout.component';

@Component({
  selector: 'page-forgot-password',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, RouterModule, AuthLayoutComponent],
  templateUrl: './forgot-password.page.html',
})
export class ForgotPasswordPage {
  email = '';

  constructor() {}

  sendResetEmail() {
    if (!this.email) return;
    // Call your backend API or Firebase to send reset email
    console.log('Password reset email sent to:', this.email);
  }
}

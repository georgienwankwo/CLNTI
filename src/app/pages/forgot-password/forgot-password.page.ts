import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '../../blocks/layouts/auth/auth-layout.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'page-forgot-password',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, RouterModule, AuthLayoutComponent],
  templateUrl: './forgot-password.page.html',
})
export class ForgotPasswordPage {
  email = '';

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
  ) {}

  sendResetEmail() {
    if (!this.email) return;
    this.authService.resetPassword(this.email).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: 'Password reset email sent!',
          duration: 3000,
          color: 'success',
          position: 'top',
        });
        await toast.present();
      },
      error: async (err) => {
        const toast = await this.toastController.create({
          message: 'Error sending email: ' + err.message,
          duration: 3000,
          color: 'danger',
          position: 'top',
        });
        await toast.present();
      },
    });
  }
}

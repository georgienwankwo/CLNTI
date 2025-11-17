import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonInput,
  IonButton,
  IonText,
  IonInputPasswordToggle,
  ToastController,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '../../../blocks/layouts/auth/auth-layout.component';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.page.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonInput,
    IonButton,
    IonText,
    RouterModule,
    IonInputPasswordToggle,
    AuthLayoutComponent,
  ],
})
export class ResetPasswordPage implements OnInit {
  password = '';
  confirmPassword = '';
  token: string | null = null;

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastController,
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (!this.token) {
      this.presentToast('Invalid or missing reset token');
      this.router.navigate(['/auth/login']);
    }
  }

  async resetPassword() {
    if (!this.password || !this.confirmPassword) {
      return this.presentToast('Please fill in both fields');
    }

    if (this.password !== this.confirmPassword) {
      return this.presentToast('Passwords do not match');
    }

    try {
      // Replace with your API call

      // Fake delay to simulate API
      await new Promise((r) => setTimeout(r, 800));

      await this.presentToast('Password updated successfully');

      this.router.navigate(['/auth/login']);
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

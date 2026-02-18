import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonInput, IonButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { ToastController, LoadingController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { TransactionService } from '../../core/services/transaction.service';

@Component({
  selector: 'page-add-funds',
  templateUrl: `./add-funds.page.html`,
  standalone: true,
  imports: [CommonModule, FormsModule, IonInput, IonButton, IonSelect, IonSelectOption],
})
export class AddFundsPage implements OnInit {
  currentBalance = 0;
  currency = 'NGN';
  email = '';
  amountToAdd: number | null = null;
  paystackPublicKey = environment.paystackPublicKey;

  private authService = inject(AuthService);
  private transactionService = inject(TransactionService);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.currentBalance = user.balance || 0;
        this.email = user.email;
      },
      error: (err) => console.error('Error loading profile', err),
    });
  }

  async payWithPaystack() {
    if (!this.amountToAdd || this.amountToAdd <= 0) {
      this.showToast('Please enter a valid amount.', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Initializing payment...',
    });
    await loading.present();

    this.transactionService.initializeTransaction(this.amountToAdd, this.email).subscribe({
      next: async (data) => {
        await loading.dismiss();

        window.location.href = `https://checkout.paystack.com/${data.access_code}`;
      },
      error: async (err) => {
        await loading.dismiss();
        console.error('Error initializing payment', err);
        this.showToast('Failed to initialize payment. Please try again.', 'danger');
      },
    });
  }

  async handlePaymentSuccess(response: any) {
    this.showToast(`Payment successful! Your balance will be updated shortly.`, 'success');
    this.amountToAdd = null;
    // Refresh balance after a short delay to allow webhook processing
    setTimeout(() => this.loadUserProfile(), 3000);
  }

  async showToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top',
    });
    await toast.present();
  }
}

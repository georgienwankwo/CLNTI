import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
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
  selectedFile: File | null = null;
  previewUrl = signal<string | null>(null);

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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.showToast('Please select an image file.', 'warning');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.showToast('File size should be less than 5MB.', 'warning');
        return;
      }

      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadProof() {
    if (!this.amountToAdd || this.amountToAdd <= 0) {
      this.showToast('Please enter a valid amount.', 'warning');
      return;
    }
    if (!this.selectedFile) {
      this.showToast('Please select a proof of payment screenshot.', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Uploading proof of payment...',
    });
    await loading.present();

    this.transactionService.uploadProofOfPayment(this.amountToAdd, this.selectedFile).subscribe({
      next: async (res) => {
        await loading.dismiss();
        this.showToast('Proof uploaded! Admin will verify and credit your balance.', 'success');
        this.resetForm();
      },
      error: async (err) => {
        await loading.dismiss();
        console.error('Error uploading proof', err);
        this.showToast(err.error?.message || 'Failed to upload proof. Please try again.', 'danger');
      },
    });
  }

  resetForm() {
    this.amountToAdd = null;
    this.selectedFile = null;
    this.previewUrl.set(null);
  }

  removeFile() {
    this.selectedFile = null;
    this.previewUrl.set(null);
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

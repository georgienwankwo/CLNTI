import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonInput, IonButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import PaystackPop from '@paystack/inline-js';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'page-add-funds',
  templateUrl: `./add-funds.page.html`,
  standalone: true,
  imports: [CommonModule, FormsModule, IonInput, IonButton, IonSelect, IonSelectOption],
})
export class AddFundsPage {
  currentBalance = 12500;
  currency = 'NGN';
  email = 'g@gmail.com';
  amountToAdd: number | null = null;
  paystackPublicKey = environment.paystackPublicKey;

  payWithPaystack() {
    if (!this.amountToAdd || this.amountToAdd <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: this.paystackPublicKey,
      email: this.email,
      amount: this.amountToAdd * 100,
      currency: this.currency,
      onSuccess: (response: any) => {
        console.log('Payment success:', response);
        this.handlePaymentSuccess(response);
      },
      onCancel: () => {
        console.log('Payment cancelled');
      },
    });
  }

  handlePaymentSuccess(response: any) {
    alert(`Payment successful! Ref: ${response.reference}`);
    this.currentBalance += this.amountToAdd!;
    this.amountToAdd = null;
  }
}

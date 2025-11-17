import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { Transaction } from './types';

@Component({
  selector: 'transactions-block',
  templateUrl: `./transactionsBlock.component.html`,
  styleUrl: `./transactionsBlock.component.scss`,
  imports: [IonGrid, IonCol, IonRow, CommonModule],
})
export class TransactionsBlockComponent {
  @Input() hideTitle!: boolean;
  transactions: Array<Transaction> = [
    {
      id: 'TXN-20251102-001',
      type: 'Deposit',
      status: 'Successful',
      amount: 25000,
      date: 'Nov 2, 2025',
    },
    {
      id: 'TXN-20251101-014',
      type: 'Withdrawal',
      status: 'Pending',
      amount: 10000,
      date: 'Nov 1, 2025',
    },
    {
      id: 'TXN-20251030-009',
      type: 'Payment',
      status: 'Failed',
      amount: 8500,
      date: 'Oct 30, 2025',
    },
    {
      id: 'TXN-20251025-022',
      type: 'Deposit',
      status: 'Successful',
      amount: 40000,
      date: 'Oct 25, 2025',
    },
    {
      id: 'TXN-20251018-005',
      type: 'Transfer',
      status: 'Successful',
      amount: 17500,
      date: 'Oct 18, 2025',
    },
  ];

  count = this.transactions.length;

  name = 'TransactionsBlock';
}

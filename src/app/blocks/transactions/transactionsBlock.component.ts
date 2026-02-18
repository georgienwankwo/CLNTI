import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { IonCol, IonGrid, IonRow, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Transaction } from './types';
import { TransactionService } from '../../core/services/transaction.service';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'transactions-block',
  templateUrl: `./transactionsBlock.component.html`,
  styleUrl: `./transactionsBlock.component.scss`,
  imports: [IonGrid, IonCol, IonRow, IonButton, IonIcon, CommonModule],
})
export class TransactionsBlockComponent implements OnInit {
  @Input() hideTitle!: boolean;
  @Input() limit: number = 10;

  transactions: Array<Transaction> = [];
  count = 0;
  currentPage = 1;
  totalPages = 1;
  isLoading = signal(false);

  private transactionService = inject(TransactionService);

  constructor() {
    addIcons({ chevronBackOutline, chevronForwardOutline });
  }

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.isLoading.set(true);
    this.transactionService.getTransactionHistory(this.currentPage, this.limit).subscribe({
      next: (res) => {
        this.transactions = res.transactions;
        this.count = res.pagination.total;
        this.totalPages = res.pagination.totalPages;
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading transactions', err);
        this.isLoading.set(false);
      },
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadTransactions();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTransactions();
    }
  }

  name = 'TransactionsBlock';
}

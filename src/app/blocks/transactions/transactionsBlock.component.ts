import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonCol, IonGrid, IonRow, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Transaction } from './types';
import { TransactionService } from '../../core/services/transaction.service';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'transactions-block',
  templateUrl: `./transactionsBlock.component.html`,
  styleUrl: `./transactionsBlock.component.scss`,
  imports: [IonGrid, IonCol, IonRow, IonButton, IonIcon, CommonModule, FormsModule],
})
export class TransactionsBlockComponent implements OnInit {
  @Input() hideTitle!: boolean;
  @Input() hideToolbar!: boolean;
  @Input() limit: number = 10;

  transactions: Array<Transaction> = [];
  count = 0;
  currentPage = 1;
  totalPages = 1;
  isLoading = signal(false);
  highlightedId: string | null = null;

  private transactionService = inject(TransactionService);
  private route = inject(ActivatedRoute);
  private routeSubscription?: any;

  constructor() {
    addIcons({ chevronBackOutline, chevronForwardOutline });
  }

  ngOnInit() {
    this.routeSubscription = this.route.queryParams.subscribe((params) => {
      this.highlightedId = params['highlight'] || null;
    });
    this.loadTransactions();
  }

  searchQuery = '';

  get filteredTransactions() {
    if (!this.searchQuery) return this.transactions;
    const lowerQuery = this.searchQuery.toLowerCase();
    return this.transactions.filter(t => 
      t.id.toLowerCase().includes(lowerQuery) || 
      t.type.toLowerCase().includes(lowerQuery) || 
      t.status.toLowerCase().includes(lowerQuery) || 
      t.amount.toString().includes(lowerQuery) ||
      (t.date && t.date.toLowerCase().includes(lowerQuery))
    );
  }

  loadTransactions(refresh = false) {
    console.log('Loading transactions...');
    this.isLoading.set(true);
    this.transactionService.getTransactionHistory(this.currentPage, this.limit, refresh).subscribe({
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

  refresh() {
    this.loadTransactions(true);
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

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
  }

  name = 'TransactionsBlock';
}

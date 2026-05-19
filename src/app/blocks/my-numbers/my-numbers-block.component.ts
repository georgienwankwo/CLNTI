import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonGrid,
  IonCol,
  IonRow,
  IonSpinner,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { Number } from './types';
import { SmsService } from '../../core/services/sms.service';
import { inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'my-numbers-block',
  templateUrl: './my-numbers-block.component.html',
  styleUrls: ['./my-numbers-block.component.scss'],
  imports: [
    IonGrid,
    IonCol,
    IonRow,
    CommonModule,
    FormsModule,
    IonSelectOption,
    IonSelect,
    IonSpinner,
  ],
})
export class MyNumbersBlockComponent implements OnInit {
  myNumbers: Array<Number> = [];
  isLoading = signal(false);
  private smsService = inject(SmsService);
  private router = inject(Router);

  searchTerm = '';
  selectedStatus: 'all' | 'Active' | 'Expired' | 'Cancelled' = 'all';
  currentPage = 1;
  pageSize = 10;

  totalNumbers = 0;
  startIndex = 0;
  endIndex = 0;

  ngOnInit() {
    this.loadNumbers();
    // Refresh every minute for countdown
    setInterval(() => {
      this.updateExpiries();
    }, 1000);
  }

  loadNumbers() {
    this.isLoading.set(true);
    this.smsService.getHistory().subscribe({
      next: (res) => {
        this.myNumbers = res.data.map((item: any) => ({
          id: item.id,
          providerId: item.providerId,
          number: item.number,
          country: item.countryCode,
          status: item.status,
          service: item.serviceId,
          createdAt: item.createdAt,
          expires_at: this.calculateExpiry(item.createdAt, item.status),
          action: 'View SMS',
          code: item.code || '',
        }));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading numbers', err);
        this.isLoading.set(false);
      },
    });
  }

  refresh() {
    this.loadNumbers();
  }

  cancelActivation(transactionId: string) {
    if (!confirm('Are you sure you want to cancel this activation? You will be refunded.')) return;

    this.isLoading.set(true);
    this.smsService.cancelNumber(transactionId).subscribe({
      next: () => {
        this.loadNumbers();
      },
      error: (err) => {
        alert(err.message || 'Failed to cancel activation');
        this.isLoading.set(false);
      },
    });
  }

  viewSms(providerId: string) {
    this.router.navigate(['/sms'], { queryParams: { providerId } });
  }

  private calculateExpiry(createdAt: any, status: string): string {
    if (status === 'Cancelled' || status === 'Expired') return status;

    let createdTime = 0;
    if (createdAt) {
      if (typeof createdAt === 'object') {
        if (typeof createdAt._seconds === 'number') {
          createdTime = createdAt._seconds * 1000;
        } else if (typeof createdAt.seconds === 'number') {
          createdTime = createdAt.seconds * 1000;
        } else if (typeof createdAt.toDate === 'function') {
          createdTime = createdAt.toDate().getTime();
        } else {
          createdTime = new Date(createdAt).getTime();
        }
      } else {
        createdTime = new Date(createdAt).getTime();
      }
    }

    if (!createdTime || isNaN(createdTime)) {
      return 'Expired';
    }

    const now = new Date().getTime();
    const expiryTime = createdTime + 15 * 60 * 1000; // 15 minutes

    const diffMs = expiryTime - now;
    if (diffMs <= 0) return 'Expired';

    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private updateExpiries() {
    this.myNumbers = this.myNumbers.map((n) => ({
      ...n,
      expires_at: this.calculateExpiry(n.createdAt, n.status),
    }));
  }

  get count() {
    return this.myNumbers.length;
  }

  get filteredNumbers() {
    const filtered = this.myNumbers.filter((m) => {
      const matchesSearch =
        m.number.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        m.service.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.selectedStatus === 'all' || (m.status || '').toLowerCase() === this.selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    this.totalNumbers = filtered.length;
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.totalNumbers);

    return filtered.slice(this.startIndex, this.endIndex);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.endIndex < this.totalNumbers) this.currentPage++;
  }
}

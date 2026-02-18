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

  searchTerm = '';
  selectedStatus: 'all' | 'active' | 'expired' = 'all';
  currentPage = 1;
  pageSize = 10;

  totalNumbers = 0;
  startIndex = 0;
  endIndex = 0;

  ngOnInit() {
    this.loadNumbers();
  }

  loadNumbers() {
    this.isLoading.set(true);
    this.smsService.getHistory().subscribe({
      next: (res) => {
        this.myNumbers = res.data.map((item: any) => ({
          id: item.id,
          number: item.number,
          country: item.countryCode,
          status: item.status,
          service: item.serviceId,
          expires_at: item.createdAt, // Or calculate expiry
          action: 'View SMS',
          code: '',
        }));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading numbers', err);
        this.isLoading.set(false);
      },
    });
  }

  get count() {
    return this.myNumbers.length;
  }

  get filteredNumbers() {
    const filtered = this.myNumbers.filter((m) => {
      const matchesSearch =
        m.number.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        m.service.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.selectedStatus === 'all' || m.status === this.selectedStatus;

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

import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonCol, IonGrid, IonRow, IonSpinner } from '@ionic/angular/standalone';
import { Message } from './types';
import { SmsService } from '../../core/services/sms.service';
import { inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'messages-block',
  templateUrl: './messages-block.component.html',
  styleUrls: ['./messages-block.component.scss'],
  imports: [IonGrid, IonCol, IonRow, CommonModule, FormsModule, IonSpinner],
})
export class MessagesBlockComponent implements OnInit, OnDestroy {
  messages: Array<Message> = [];
  isLoading = signal(false);
  private smsService = inject(SmsService);
  private pollSubscription?: Subscription;

  searchTerm = '';
  currentPage = 1;
  pageSize = 10;

  totalMessages = 0;
  startIndex = 0;
  endIndex = 0;

  ngOnInit() {
    this.startPolling();
  }

  ngOnDestroy() {
    this.pollSubscription?.unsubscribe();
  }

  startPolling() {
    this.isLoading.set(true);
    this.pollSubscription = timer(0, 10000)
      .pipe(switchMap(() => this.smsService.getHistory()))
      .subscribe({
        next: (res) => {
          // Mapping purchases that have a code to the Message interface
          this.messages = res.data
            .filter((item: any) => item.code)
            .map((item: any) => ({
              id: `msg-${item.id}`,
              number: item.number,
              message: `Your verification code is ${item.code}`,
              service: item.serviceId,
              received_at: item.receivedAt || item.createdAt,
            }));
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error polling messages', err);
          this.isLoading.set(false);
        },
      });
  }

  get count() {
    return this.messages.length;
  }

  get filteredMessages() {
    const filtered = this.messages.filter(
      (m) =>
        m.message.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        m.number.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        m.service.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );

    this.totalMessages = filtered.length;
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.totalMessages);

    return filtered.slice(this.startIndex, this.endIndex);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.endIndex < this.totalMessages) this.currentPage++;
  }
}

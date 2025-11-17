import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { Message } from './types';

@Component({
  selector: 'messages-block',
  templateUrl: './messages-block.component.html',
  styleUrls: ['./messages-block.component.scss'],
  imports: [IonGrid, IonCol, IonRow, CommonModule, FormsModule],
})
export class MessagesBlockComponent {
  messages: Array<Message> = [
    {
      id: 'MSG-001',
      number: '+2348012345678',
      message: 'Your verification code is 482913. It expires in 10 minutes.',
      service: 'Twilio',
      received_at: '2025-11-02 14:32:10',
    },
    {
      id: 'MSG-002',
      number: '+2348098765432',
      message: 'Payment of ₦5,000 was received successfully. Thank you for your business.',
      service: 'Paystack',
      received_at: '2025-11-02 15:47:29',
    },
    {
      id: 'MSG-003',
      number: '+2348076543210',
      message: 'Your number has been rented successfully and will expire on 2025-12-02.',
      service: 'Game',
      received_at: '2025-11-02 16:12:04',
    },
  ];

  searchTerm = '';
  currentPage = 1;
  pageSize = 10;

  totalMessages = 0;
  startIndex = 0;
  endIndex = 0;

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

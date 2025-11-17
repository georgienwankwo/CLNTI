import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '../../../blocks/layouts/auth/auth-layout.component';

@Component({
  selector: 'page-email-sent',
  styleUrl: './email-sent.page.scss',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, AuthLayoutComponent],
  templateUrl: './email-sent.page.html',
})
export class EmailSentPage {
  email = 'you@example.com'; // This can be passed in via router state

  constructor() {}
}

import { Component, OnInit, inject, signal } from '@angular/core';
import { QuickActionsComponent } from '../../blocks/quick-actions/quick-actions.component';
import { TransactionsBlockComponent } from '../../blocks/transactions/transactionsBlock.component';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'page-home',
  templateUrl: `./home.page.html`,
  standalone: true,
  imports: [QuickActionsComponent, TransactionsBlockComponent, CommonModule],
})
export class HomePage implements OnInit {
  name = 'Home';
  firstName = signal('');
  balance = signal(0);

  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.getProfile().subscribe({
      next: (user) => {
        console.log({ user });
        this.firstName.set(user.firstName || user.displayName || user.name || 'User');
        this.balance.set(user.balance || 0);
      },
      error: (err) => console.error('Error loading home profile', err),
    });
  }
}

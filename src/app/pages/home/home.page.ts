import { Component } from '@angular/core';
import { QuickActionsComponent } from '../../blocks/quick-actions/quick-actions.component';
import { TransactionsBlockComponent } from '../../blocks/transactions/transactionsBlock.component';

@Component({
  selector: 'page-home',
  templateUrl: `./home.page.html`,
  standalone: true,
  // styleUrl: `./home.page.scss`,
  imports: [QuickActionsComponent, TransactionsBlockComponent],
})
export class HomePage {
  name = 'Home';
  firstName = 'Aleksei';
  constructor() {}
}

import { Component } from '@angular/core';
import { TransactionsBlockComponent } from '../../blocks/transactions/transactionsBlock.component';

@Component({
  selector: 'page-transactions',
  templateUrl: `./transactions.page.html`,
  standalone: true,
  imports: [TransactionsBlockComponent],
})
export class TransactionsPage {
  name = 'Transactions';
  constructor() {}
}

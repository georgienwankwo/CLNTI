import { Component } from '@angular/core';
import { MessagesBlockComponent } from '../../blocks/sms/messages-block.component';

@Component({
  selector: 'page-sms',
  templateUrl: `./sms.page.html`,
  standalone: true,
  imports: [MessagesBlockComponent],
})

export class SMSPage {
  name = 'SMS';
  constructor() {}
}

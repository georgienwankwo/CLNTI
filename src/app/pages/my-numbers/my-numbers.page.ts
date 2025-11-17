import { Component } from '@angular/core';
import { MyNumbersBlockComponent } from '../../blocks/my-numbers/my-numbers-block.component';

@Component({
  selector: 'page-my-numbers',
  templateUrl: `./my-numbers.page.html`,
  standalone: true,
  imports: [MyNumbersBlockComponent],
})
export class MyNumbersPage {
  name = 'MyNumbers';
  constructor() {}
}

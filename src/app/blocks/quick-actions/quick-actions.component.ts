import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'quick-actions',
  templateUrl: `./quick-actions.component.html`,
  styleUrl: `./quick-actions.component.scss`,
  imports: [RouterModule],
})
export class QuickActionsComponent {
  name = 'QuickActions';
}

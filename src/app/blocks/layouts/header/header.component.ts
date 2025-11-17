import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { startCase } from 'lodash-es';
import {
  IonButtons,
  IonHeader,
  IonItem,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  templateUrl: `./header.component.html`,
  styleUrl: `./header.component.scss`,
  imports: [IonHeader, IonTitle, IonToolbar, IonItem, IonMenuButton, IonButtons],
})
export class HeaderComponent {
  pageName = 'Home';
  name = 'Header';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      if (this.router.url === '/') {
        this.pageName = 'Home';
      } else {
        this.pageName = startCase(this.router.url);
      }
    });
  }
}

import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonMenuToggle,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-sidebar',
  templateUrl: `./sidebar.component.html`,
  styleUrl: `./sidebar.component.scss`,
  imports: [RouterModule, IonList, IonItem, IonLabel, IonListHeader, IonMenuToggle],
})
export class SidebarComponent {
  currentRoute = '/';
  name = 'Sidebar';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  isActive(path: string): boolean {
    return this.currentRoute === path;
  }
}

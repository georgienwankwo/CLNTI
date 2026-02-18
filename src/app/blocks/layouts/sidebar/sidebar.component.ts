import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { map, take, tap } from 'rxjs/operators';
import {
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonMenuToggle,
} from '@ionic/angular/standalone';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: `./sidebar.component.html`,
  styleUrl: `./sidebar.component.scss`,
  imports: [RouterModule, IonList, IonItem, IonLabel, IonListHeader, IonMenuToggle],
})
export class SidebarComponent {
  currentRoute = signal('/');
  name = 'Sidebar';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.currentRoute.set(this.router.url);
    this.router.events.subscribe(() => {
      this.currentRoute.set(this.router.url);
    });
  }

  isActive(path: string): boolean {
    return this.currentRoute() === path;
  }

  logoutFn() {
    return this.authService.logout();
  }
}

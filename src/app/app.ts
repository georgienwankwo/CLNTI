import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './blocks/layouts/sidebar/sidebar.component';
import { IonContent, IonMenu, IonSplitPane } from '@ionic/angular/standalone';
import { HeaderComponent } from './blocks/layouts/header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    IonSplitPane,
    IonContent,
    IonMenu,
    HeaderComponent,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('CLNTI');

  authPage = false;
  name = 'Sidebar';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.authPage = this.router.url.includes(`/auth`);
    });
  }
}

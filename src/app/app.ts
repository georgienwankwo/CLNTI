import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './blocks/layouts/sidebar/sidebar.component';
import { IonContent, IonMenu, IonSpinner, IonSplitPane } from '@ionic/angular/standalone';
import { HeaderComponent } from './blocks/layouts/header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

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
    IonSpinner,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('CLNTI');

  authPage = false;
  authState = signal('logging-in');
  name = 'Sidebar';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.router.events.subscribe(() => {
      this.authPage = this.router.url.includes(`/auth`);
    });
    this.authService.isUserLoggingIn().subscribe((isLoggedIn) => {
      this.authState.set(
        isLoggedIn === undefined ? 'logging-in' : isLoggedIn ? 'logged-in' : 'logged-out',
      );
      console.log(isLoggedIn, this.authState());
    });
  }
}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'auth-layout',
  templateUrl: './auth-layout.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class AuthLayoutComponent {}

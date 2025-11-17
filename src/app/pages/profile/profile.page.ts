import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';

@Component({
  selector: 'page-profile',
  templateUrl: `./profile.page.html`,
  standalone: true,
  imports: [
    FormsModule,
    IonInput,
    IonButton,
  ],
})
export class ProfilePage {
  firstName = '';
  lastName = '';
  email = 'george@example.com';
  phone = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  name = 'Profile';

  saveProfile() {
    console.log('Profile saved');
  }

  changePassword() {
    console.log('Password changed');
  }
}

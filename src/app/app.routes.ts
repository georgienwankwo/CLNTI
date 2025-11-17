import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { SMSPage } from './pages/sms/sms.page';
import { TransactionsPage } from './pages/transactions/transactions.page';
import { MyNumbersPage } from './pages/my-numbers/my-numbers.page';
import { ProfilePage } from './pages/profile/profile.page';
import { RentNumbersPage } from './pages/rent-numbers/rent-numbers.page';
import { AddFundsPage } from './pages/add-funds/add-funds.page';
import { SignupPage } from './pages/auth/signup/signup.page';
import { LoginPage } from './pages/auth/login/login.page';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password.page';
import { EmailSentPage } from './pages/forgot-password/email-sent/email-sent.page';
import { ResetPasswordPage } from './pages/auth/reset-password/reset-password.page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePage,
  },
  {
    path: 'sms',
    pathMatch: 'full',
    component: SMSPage,
  },
  {
    path: 'transactions',
    pathMatch: 'full',
    component: TransactionsPage,
  },
  {
    path: 'my-numbers',
    pathMatch: 'full',
    component: MyNumbersPage,
  },
  {
    path: 'rent-numbers',
    pathMatch: 'full',
    component: RentNumbersPage,
  },
  {
    path: 'add-funds',
    pathMatch: 'full',
    component: AddFundsPage,
  },
  {
    path: 'profile',
    pathMatch: 'full',
    component: ProfilePage,
  },
  {
    path: 'auth/signup',
    pathMatch: 'full',
    component: SignupPage,
  },
  {
    path: 'auth/login',
    pathMatch: 'full',
    component: LoginPage,
  },
  {
    path: 'auth/forgot-password',
    pathMatch: 'full',
    component: ForgotPasswordPage,
  },
  {
    path: 'auth/forgot-password/email-sent',
    pathMatch: 'full',
    component: EmailSentPage,
  },
  {
    path: 'auth/reset-password',
    pathMatch: 'full',
    component: ResetPasswordPage,
  },
];

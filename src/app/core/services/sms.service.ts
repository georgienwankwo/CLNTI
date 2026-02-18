import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface SmsCountry {
  name: string;
  code: string;
}

export interface SmsServiceItem {
  id: string;
  name: string;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class SmsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private get apiUrl() {
    return `${environment.apiUrl}/sms`;
  }

  getCountries(server: string): Observable<any> {
    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        return this.http.post(
          `${this.apiUrl}/countries`,
          { server },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }),
    );
  }

  getServices(server: string, country: string): Observable<any> {
    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        return this.http.post(
          `${this.apiUrl}/services`,
          { server, country },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }),
    );
  }

  getPrice(server: string, service: string, country: string): Observable<any> {
    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        return this.http.post(
          `${this.apiUrl}/price`,
          { server, service, country },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }),
    );
  }

  purchaseNumber(server: string, service: string, country: string): Observable<any> {
    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        return this.http.post(
          `${this.apiUrl}/purchase`,
          { server, service, country },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }),
    );
  }

  cancelNumber(transactionId: string): Observable<any> {
    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        return this.http.post(
          `${this.apiUrl}/cancel`,
          { transaction_id: transactionId },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }),
    );
  }

  getSmsCode(transactionId: string): Observable<any> {
    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        return this.http.post(
          `${this.apiUrl}/get-sms`,
          { transaction_id: transactionId },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }),
    );
  }

  getHistory(): Observable<any> {
    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        return this.http.get(`${this.apiUrl}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }),
    );
  }
}

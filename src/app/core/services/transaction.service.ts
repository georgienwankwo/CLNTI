import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { Transaction } from '../../blocks/transactions/types';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private historyCache: Map<string, any> = new Map();

  private get apiUrl() {
    return `${environment.apiUrl}/transactions`;
  }

  initializeTransaction(amount: number, email?: string): Observable<any> {
    this.historyCache.clear();
    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        console.log({ token });
        return this.http.post(
          `${this.apiUrl}/initialize`,
          { amount, email },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }),
    );
  }

  getTransactionHistory(
    page: number = 1,
    limit: number = 10,
  ): Observable<{ transactions: Transaction[]; pagination: any }> {
    const cacheKey = `${page}-${limit}`;
    if (this.historyCache.has(cacheKey)) {
      return of(this.historyCache.get(cacheKey));
    }

    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        return this.http.get<{ transactions: Transaction[]; pagination: any }>(
          `${this.apiUrl}/history`,
          {
            params: { page: page.toString(), limit: limit.toString() },
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }),
      tap((res: { transactions: Transaction[]; pagination: any }) =>
        this.historyCache.set(cacheKey, res),
      ),
    );
  }
}

import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  sendPasswordResetEmail,
  confirmPasswordReset,
  getIdToken,
  User,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { switchMap, tap, map, catchError, filter, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private http = inject(HttpClient);
  private router = inject(Router);

  private authState$ = new BehaviorSubject<User | null | undefined>(undefined);
  private profile$ = new BehaviorSubject<any>(null);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.authState$.next(user);
    });
  }

  // Helper to get current user token
  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      return getIdToken(user);
    }
    return null;
  }

  // Helper to sync user with backend
  private syncUserWithBackend(name?: string) {
    const backendUrl = `${environment.apiUrl}/users/sync`;

    return this.http.post(backendUrl, { name }).pipe(
      catchError((err) => {
        console.error('Backend sync failed', err);
        return of(null);
      }),
    );
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  signup(email: string, password: string, name: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((credential) => {
        return from(updateProfile(credential.user, { displayName: name })).pipe(
          map(() => credential),
        );
      }),
      tap(() => this.syncUserWithBackend(name).subscribe()),
    );
  }

  googleSignIn() {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      tap((credential) => {
        this.syncUserWithBackend(credential.user.displayName || '').subscribe();
      }),
    );
  }

  appleSignIn() {
    const provider = new OAuthProvider('apple.com');
    // Note: Apple Sign In usually requires more setup (scopes etc)
    provider.addScope('email');
    provider.addScope('name');
    return from(signInWithPopup(this.auth, provider)).pipe(
      tap((credential) => {
        this.syncUserWithBackend(credential.user.displayName || '').subscribe();
      }),
    );
  }

  async logout() {
    this.profile$.next(null);
    await signOut(this.auth);
    return this.router.navigate(['/auth/login']);
  }

  resetPassword(email: string) {
    return this.http.post(`${environment.apiUrl}/auth/forgot-password`, { email }).pipe(
      catchError((error) => {
        let errorMessage = 'An error occurred while sending the reset email.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        return new Observable((observer) => {
          observer.error(new Error(errorMessage));
          observer.complete();
        });
      }),
    );
  }

  confirmPasswordReset(code: string, newPassword: string) {
    return from(confirmPasswordReset(this.auth, code, newPassword));
  }

  sendEmailVerification() {
    return from(this.auth.currentUser!.getIdToken()).pipe(
      switchMap((token) => {
        return this.http
          .post(
            `${environment.apiUrl}/auth/send-verification-email`,
            { email: this.auth.currentUser?.email },
            { headers: { Authorization: `Bearer ${token}` } },
          )
          .pipe(
            catchError((error) => {
              let errorMessage = 'An error occurred while sending the verification email.';
              if (error.error && error.error.message) {
                errorMessage = error.error.message;
              }
              return new Observable((observer) => {
                observer.error(new Error(errorMessage));
                observer.complete();
              });
            }),
          );
      }),
    );
  }

  isUserLoggedIn() {
    return this.authState$.pipe(
      filter((v): v is User | null => v !== undefined), // wait until ready
      map((user) => !!user),
    );
  }

  isUserLoggingIn() {
    return this.authState$.pipe(
      filter((v): v is User | null => v !== undefined), // wait until ready
      map((user) => !!user),
    );
  }

  getProfile(forceRefresh = false): Observable<any> {
    if (!forceRefresh && this.profile$.value) {
      return this.profile$.asObservable();
    }

    return from(this.getToken()).pipe(
      switchMap((token) => {
        return this.http.get(`${environment.apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }),
      tap((profile) => this.profile$.next(profile)),
    );
  }

  updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    name?: string;
  }): Observable<any> {
    return from(this.getToken()).pipe(
      switchMap((token) => {
        return this.http
          .patch(`${environment.apiUrl}/users/update`, data, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .pipe(
            tap((res: any) => {
              // Merge updates into cached profile
              const current = this.profile$.value;
              if (current) {
                this.profile$.next({ ...current, ...data });
              }
            }),
            switchMap((res: any) => {
              if (data.name && this.auth.currentUser) {
                return from(
                  updateProfile(this.auth.currentUser, {
                    displayName: data.name,
                  }),
                ).pipe(map(() => res));
              }
              return of(res);
            }),
          );
      }),
    );
  }

  changePassword(currentPassword: string, newPassword: string) {
    const user = this.auth.currentUser;
    if (!user || !user.email) {
      return new Observable((observer) => {
        observer.error(new Error('User not logged in'));
      });
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    return from(reauthenticateWithCredential(user, credential)).pipe(
      switchMap(() => from(updatePassword(user, newPassword))),
      switchMap(() => from(this.getToken())),
      switchMap((token) => {
        // Notify backend to send email
        return this.http.post(
          `${environment.apiUrl}/users/notify-password-change`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }),
    );
  }
}

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/admin/login'; // Adjust URL as needed
  private tokenKey = 'authToken';
  private userKey = 'authUser';

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    let savedUser = null;
    const isBrowser = isPlatformBrowser(this.platformId);
    console.log('AuthService: Initializing. IsBrowser:', isBrowser);
    if (isBrowser) {
      const data = localStorage.getItem(this.userKey);
      savedUser = data ? JSON.parse(data) : null;
      console.log('AuthService: Loaded from localStorage:', savedUser);
    }
    this.currentUserSubject = new BehaviorSubject<any>(savedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        console.log('AuthService: Raw Login Response:', response);
        const token = response.token || (response.data && response.data.token);
        // Try to find the user object in various response structures
        let user = response.user;
        if (!user && response.data) {
          // If data is the user object (has name or email), use it. Otherwise look for user inside data.
          user = (response.data.name || response.data.email) ? response.data : response.data.user;
        }

        console.log('AuthService: Detected User Object:', user);

        if (token) {
          this.setToken(token);
        }
        if (user) {
          this.setUser(user);
        }
      })
    );
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  setUser(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  getUser(): any | null {
    return this.currentUserSubject.value;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  updateAdminPassword(data: any): Observable<any> {
    const changePasswordUrl = 'http://127.0.0.1:8000/api/admin/change-password';
    return this.http.post<any>(changePasswordUrl, data);
  }
}
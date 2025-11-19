import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User, LoginCredentials, RegisterData } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth'; // Update with your actual API URL
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginCredentials): Observable<User> {
    // Simulated login - replace with actual API call
    return of({
      id: '1',
      username: credentials.username,
      email: `${credentials.username}@example.com`,
      token: 'mock-jwt-token-' + Date.now()
    }).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );

    // Actual implementation would be:
    // return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
    //   tap(user => {
    //     localStorage.setItem('currentUser', JSON.stringify(user));
    //     this.currentUserSubject.next(user);
    //   })
    // );
  }

  register(data: RegisterData): Observable<User> {
    // Simulated registration - replace with actual API call
    return of({
      id: '1',
      username: data.username,
      email: data.email,
      token: 'mock-jwt-token-' + Date.now()
    }).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );

    // Actual implementation:
    // return this.http.post<User>(`${this.apiUrl}/register`, data).pipe(
    //   tap(user => {
    //     localStorage.setItem('currentUser', JSON.stringify(user));
    //     this.currentUserSubject.next(user);
    //   })
    // );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  getToken(): string | null {
    return this.currentUserValue?.token || null;
  }
}

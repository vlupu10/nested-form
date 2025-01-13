import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';

export interface UserData {
  id: number;
  name: string;
  street: string;
  city: string;
  postalCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000';
  private usersData: UserData[] = [];

  constructor(private http: HttpClient) { }

  getData(): Observable<UserData[]> {
    return this.http.get<UserData[]>(`${this.apiUrl}/users`).pipe(
      tap(data => {
        this.usersData = data;
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  insertUser(userData: UserData): Observable<UserData> {
    const newUser = {
      name: userData.name,
      street: userData.street,
      city: userData.city,
      postal_code: userData.postalCode
    };

    return this.http.post<UserData>(`${this.apiUrl}/users`, newUser).pipe(
      tap(response => {
        this.usersData.push(response);
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`).pipe(
      tap(() => {
        this.usersData = this.usersData.filter(user => user.id !== id);
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  updateUser(userData: UserData): Observable<UserData> {
    if (!userData.id) {
      throw new Error('User ID is required for update');
    }

    const updateData = {
      name: userData.name,
      street: userData.street,
      city: userData.city,
      postal_code: userData.postalCode
    };

    return this.http.put<UserData>(`${this.apiUrl}/users/${userData.id}`, updateData).pipe(
      tap(response => {
        this.usersData = this.usersData.map(user => user.id === userData.id ? response : user);
      }),
      catchError(error => {
        console.error('Error updating user:', error);
        throw error;
      })
    );
  }
}

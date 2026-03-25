import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { State } from '../models/state';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private apiUrl = 'http://127.0.0.1:8000/api/admin/states';

  constructor(private http: HttpClient) { }

  getAllStates(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getStateById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createState(state: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, state);
  }

  updateState(id: number, state: any): Observable<any> {
    if (state instanceof FormData) {
      return this.http.post<any>(`${this.apiUrl}/${id}?_method=PUT`, state);
    }
    return this.http.put<any>(`${this.apiUrl}/${id}`, state);
  }

  deleteState(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

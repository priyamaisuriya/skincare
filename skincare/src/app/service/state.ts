import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { State } from '../models/state'
@Injectable({
  providedIn: 'root',
})
export class StateService {
  private apiUrl = 'http://127.0.0.1:8000/api/admin/state';

  constructor(private http: HttpClient) { }

  getAllStates(): Observable<State[]> {
    return this.http.get<State[]>(this.apiUrl);
  }

  getStateById(id: number): Observable<State> {
    return this.http.get<State>(`${this.apiUrl}/${id}`);
  }

  createState(state: State): Observable<State> {
    return this.http.post<State>(this.apiUrl, state);
  }

  updateState(id: number, state: State): Observable<State> {
    return this.http.put<State>(`${this.apiUrl}/${id}`, state);
  }

  deleteState(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

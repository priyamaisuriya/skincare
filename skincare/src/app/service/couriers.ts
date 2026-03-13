import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Couriers } from '../models/couriers';

@Injectable({
  providedIn: 'root',
})
export class CouriersService {
  private apiUrl = 'http://127.0.0.1:8000/api/admin/couriers';

  constructor(private http: HttpClient) { }

  getAllCouriers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getCourierById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createCourier(courier: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, courier);
  }

  updateCourier(id: number, courier: any): Observable<any> {
    // If courier is FormData, we use POST with _method=PUT
    if (courier instanceof FormData) {
      return this.http.post<any>(`${this.apiUrl}/${id}?_method=PUT`, courier);
    }
    // For regular JSON, we use PUT
    return this.http.put<any>(`${this.apiUrl}/${id}`, courier);
  }

  deleteCourier(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

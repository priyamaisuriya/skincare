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
    return this.http.get(this.apiUrl);
  }
  getCourierById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  createCourier(courier: any): Observable<any> {
    return this.http.post(this.apiUrl, courier);
  }
  updateCourier(id: number, courier: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, courier);
  }
  deleteCourier(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

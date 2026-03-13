import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://127.0.0.1:8000/api/admin/orders';
  constructor(private http: HttpClient) { }
  getAllOrders(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }


  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, order);
  }

  updateOrder(id: number, order: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, order);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
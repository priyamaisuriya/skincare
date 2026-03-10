import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Faq } from '../models/faq';

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  private apiUrl = 'http://127.0.0.1:8000/api/admin/faq';

  constructor(private http: HttpClient) { }

  getAllFaqs(): Observable<Faq[]> {
    // API returns an array of FAQ objects
    return this.http.get<Faq[]>(this.apiUrl);
  }

  getFaqById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createFaq(faq: Faq): Observable<Faq> {
    return this.http.post<Faq>(this.apiUrl, faq);
  }

  updateFaq(id: number, faq: Faq): Observable<Faq> {
    return this.http.put<Faq>(`${this.apiUrl}/${id}`, faq);
  }

  deleteFaq(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

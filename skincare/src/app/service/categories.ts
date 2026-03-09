import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categories } from '../models/categories';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = 'http://127.0.0.1:8000/api/admin/categories';

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getCategoryById(id: number): Observable<Categories> {
    return this.http.get<Categories>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: Categories): Observable<Categories> {
    return this.http.post<Categories>(this.apiUrl, category);
  }

  updateCategory(id: number, category: Categories): Observable<Categories> {
    return this.http.put<Categories>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

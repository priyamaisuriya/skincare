import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Products } from '../models/products';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'http://127.0.0.1:8000/api/admin/products';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getProductById(id: number): Observable<Products> {
    return this.http.get<Products>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}?_method=PUT`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Image Management
  uploadProductImage(formData: FormData): Observable<any> {
    return this.http.post<any>(`http://127.0.0.1:8000/api/admin/product-images`, formData);
  }

  deleteProductImage(id: number): Observable<any> {
    return this.http.delete<any>(`http://127.0.0.1:8000/api/admin/product-images/${id}`);
  }

  // Related Products (assuming a similar pattern)
  getRelatedProducts(productId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${productId}/related`);
  }

  saveRelatedProducts(productId: number, relatedIds: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${productId}/related`, { related_ids: relatedIds });
  }

  syncFacebookCatalog(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sync-facebook-catalog`, {});
  }
}

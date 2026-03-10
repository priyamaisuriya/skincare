import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanySettings } from '../models/company-settings';

@Injectable({
    providedIn: 'root'
})
export class CompanySettingsService {
    private apiUrl = 'http://127.0.0.1:8000/api/admin/company-settings';

    constructor(private http: HttpClient) { }

    getCompanySettings(): Observable<CompanySettings[]> {
        return this.http.get<CompanySettings[]>(this.apiUrl);
    }

    getCompanySettingsById(id: number): Observable<CompanySettings> {
        return this.http.get<CompanySettings>(`${this.apiUrl}/${id}`);
    }

    createCompanySettings(data: FormData): Observable<any> {
        return this.http.post<any>(this.apiUrl, data);
    }

    updateCompanySettings(id: number, data: FormData): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${id}?_method=PUT`, data);
    }

    deleteCompanySettings(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}

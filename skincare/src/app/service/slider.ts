import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Slider } from '../models/slider';

@Injectable({
  providedIn: 'root',
})
export class SliderService {
  private apiUrl = 'http://127.0.0.1:8000/api/admin/sliders';

  constructor(private http: HttpClient) { }

  getAllSliders(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getSliderById(id: number): Observable<Slider> {
    return this.http.get<Slider>(`${this.apiUrl}/${id}`);
  }

  createSlider(slider: Slider): Observable<Slider> {
    return this.http.post<Slider>(this.apiUrl, slider);
  }

  updateSlider(id: number, slider: Slider): Observable<Slider> {
    return this.http.put<Slider>(`${this.apiUrl}/${id}`, slider);
  }

  deleteSlider(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

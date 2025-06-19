import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoffeeListService {
  private readonly apiUrl = 'https://api.sampleapis.com/coffee/hot';
  constructor(private readonly http: HttpClient) {}

  /**
   * Get coffee products from API
   * @returns Observable<any> - Raw API response
   */
  getCoffeeProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}

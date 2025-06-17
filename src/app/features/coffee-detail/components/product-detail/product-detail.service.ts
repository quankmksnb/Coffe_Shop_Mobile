import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import CoffeeProductModel from 'src/app/features/coffee-home/components/main-content/models/coffee-product.model';

@Injectable({
  providedIn: 'root',
})
export class CoffeeDetailService {
  private readonly apiUrl = 'https://api.sampleapis.com/coffee/hot';

  constructor(private readonly http: HttpClient) {}
  getCoffeeProductById(id: number): Observable<CoffeeProductModel | undefined> {
    if (!id || id <= 0) {
      return throwError(() => new Error('Invalid coffee product ID'));
    }

    const url = `${this.apiUrl}/${id}`;
    
    return this.http.get<CoffeeProductModel>(url).pipe(
      map(response => response || null),
      catchError(error => {
        console.error('Error fetching coffee product:', error);
        return throwError(() => error);
      })
    );
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
}

export interface Profile {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

@Injectable({ providedIn: 'root' })
export class PlatziApiService {
  private http = inject(HttpClient);
  readonly apiUrl = 'https://api.escuelajs.co/api/v1';

  getProducts(limit = 50): Observable<Product[]> {
    const params = new HttpParams().set('offset', 0).set('limit', limit);
    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/${id}`);
  }

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/auth/profile`);
  }
}

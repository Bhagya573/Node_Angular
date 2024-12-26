import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  /**
   * Returns the headers with JWT token for authorization.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }

  /**
   * Creates a new quote.
   */
  createQuote(quoteData: any): Observable<any> {
    const headers = this.getAuthHeaders(); 
    return this.http.post(`${this.apiUrl}/quotes`, quoteData, { headers });
  }

  /**
   * Fetches available quote types.
   */
  getQuoteTypes(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/quote-types`, { headers });
  }

  /**
   * Fetches paginated quotes with an optional search query.
   */
  getQuotes(page: number, pageSize: number, searchQuery: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/quotes?page=${page}&pageSize=${pageSize}&searchQuery=${searchQuery}`;
    console.log(this.http.get(url, { headers }),"data")
    return this.http.get(url, { headers });
  }
}

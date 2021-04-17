import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  postNewGame(data: any): Observable<any> {
    return this.http.post('http://localhost:3000/games/new', data);
  }

  postSetup(data: any, session_id: string): Observable<any> {
    return this.http.post(`http://localhost:3000/games/${session_id}/setup`, data);
  }
}

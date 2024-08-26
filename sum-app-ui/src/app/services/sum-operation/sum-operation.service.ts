import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SumOperationService {
  private baseUrl = environment.sumApiUrl;
  constructor(private http: HttpClient) {}

  findSumById(id: string | null): Observable<any> {
    return this.http.get(this.baseUrl + `/GetResults/${id}`);
  }

  sendSumData(number1: string, number2: string): Observable<any> {
    const request = { number1: parseInt(number1), number2: parseInt(number2) }
    return this.http.post(this.baseUrl + '/CalcAsync', request)
  }
}

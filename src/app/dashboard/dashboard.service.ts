import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpRequestService } from '../services/http-request.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpRequestService) { }

  updateUserProducts(data): Observable<any> {
    return this.http.post(`user/product/update`, data);
  }

  getUserProductrole(userId): Observable<any> {
    return this.http.get(`user/productrole/${userId}`);
  }
}

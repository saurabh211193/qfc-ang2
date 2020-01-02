import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpRequestService } from '../services/http-request.service';

@Injectable({
  providedIn: 'root'
})
export class UserReportService {

  constructor(private http: HttpRequestService) { }

  getUsersReport(): Observable<any> {
    return this.http.get(`user/report`);
  }

  updateUserDetail(userId, data): Observable<any> {
    return this.http.put(`user/update/${userId}`, data);
  }
}

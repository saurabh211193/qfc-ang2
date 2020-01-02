import { Injectable } from '@angular/core';

import { HttpRequestService } from '../services/http-request.service';
import { Observable } from 'rxjs';

@Injectable()
export class AssignmentService {

  constructor(private http: HttpRequestService) { }

  getUnassignedLeads(options): Observable<any> {
    return this.http.get(`lead/getunassignedleads`, options)
  }

  getAllAgents(): Observable<any> {
    return this.http.get(`master/agents`)
  }

  assignLeads(data): Observable<any> {
    return this.http.post(`lead/assignLeads`, data)
  }

  getUnassignedGarages(city): Observable<any> {
    return this.http.get(`garage/unassigned/${city}`)
  }

  assignGarages(data): Observable<any> {
    return this.http.post(`garage/assigngarages`, data)
  }

  getUserByProductMapping(productid): Observable<any> {
    return this.http.get(`user/product/${productid}`);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpRequestService } from '../services/http-request.service';

@Injectable()
export class UserService {

  constructor(private http: HttpRequestService) { }

  login(loginData): Observable<Object> {
    return this.http.post('user/login', loginData);
  }
}

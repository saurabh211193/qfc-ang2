import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpRequestService } from './http-request.service';


@Injectable()
export class MasterService {

  constructor(private http: HttpRequestService) { }

  getAllCities(): Observable<any> {
    return this.http.get(`master/cities`);
  }

  getPickupTimingMaster(): Observable<any> {
    return this.http.get(`master/pickup-timing`);
  }

  getAllMake(): Observable<any> {
    return this.http.get(`master/make`);
  }

  getMessageMaster(productid): Observable<any> {
    return this.http.get(`master/message/${productid}`);
  }

  getAllStatus(productid): Observable<any> {
    return this.http.get(`master/status/${productid}`);
  }

  getModeByMake(makeId): Observable<any> {
    return this.http.get(`master/models/${makeId}`);
  }

  sendSMS(data): Observable<any> {
    return this.http.post(`common/sms/send`, data);
  }

  sendEmail(data): Observable<any> {
    return this.http.post(`common/email/send`, data);
  }

  getGarages(options): Observable<any> {
    return this.http.get(`master/garages`, options);
  }

  getServiceMaster(): Observable<any> {
    return this.http.get(`master/services?IsWebsite=1`);
  }

  sendOtp(data): Observable<any> {
    return this.http.post(`common/otp/send`, data);
  }

  validateOtp(data): Observable<any> {
    return this.http.post(`common/otp/validate`, data);
  }

  getFuelType(): Observable<any> {
    return this.http.get(`master/fueltype`);
  }

  getUSP(): Observable<any> {
    return this.http.get(`master/usp`);
  }

  getProduct(): Observable<any> {
    return this.http.get(`master/product`);
  }

  getSupplier(): Observable<any> {
    return this.http.get(`master/supplier`);
  }

  logout(data): Observable<any> {
    return this.http.post('user/logout', data);
  }

  getDocMaster(): Observable<any> {
    return this.http.get(`master/doc`);
  }

  getInsurer(): Observable<any> {
    return this.http.get(`master/insurer`);
  }
  getFranchise(): Observable<any> {
    return this.http.get(`master/franchise`);
  }

  getDocStatus(): Observable<any> {
    return this.http.get(`master/docstatus`);
  }

  garageselectonstatus(): Observable<any> {
    return this.http.get(`master/garageselectonstatus`);
  }

  entityMaster(): Observable<any> {
    return this.http.get(`master/usp-entity`);
  }


}

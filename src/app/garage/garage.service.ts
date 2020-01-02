import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpRequestService } from '../services/http-request.service';

@Injectable()
export class GarageService {

  constructor(private http: HttpRequestService) { }

  getUserAssignedGarages(userId, options): Observable<any> {
    return this.http.get(`user/assginedgarages/${userId}`, options);
  }

  getGarageDetail(garageId): Observable<any> {
    return this.http.get(`garage/detail/${garageId}`);
  }

  updateGarageDetail(garageId, data): Observable<any> {
    return this.http.put(`garage/update/${garageId}`, data);
  }

  getGarageComments(garageId): Observable<any> {
    return this.http.get(`garage/comments/${garageId}`);
  }

  saveComment(data): Observable<any> {
    return this.http.post(`garage/comment/create`, data);
  }

  saveGarageCallLog(data): Observable<any> {
    return this.http.get(`comm/garagecall/create?${data}`)
  }

  bulkUploadGarages(data): Observable<any> {
    return this.http.fileUploadPost(`garage/fileuploadadd`, data);
  }

  getGarageStatusMaster(): Observable<any> {
    return this.http.get(`garage/statusmaster`);
  }

  updateGarageStatus(data): Observable<any> {
    return this.http.post(`garage/status/update`, data);
  }

  getGarageStatus(garageId): Observable<any> {
    return this.http.get(`garage/status/${garageId}`)
  }

  // getGarageUsp(garageId): Observable<any> {
  //   return this.http.get(`garage/usp/${garageId}`);
  // }

  getGarageUsp(garageId): Observable<any> {
    return this.http.get(`garage-panel/usp-transactions/${garageId}`);
  }

  insertGarageUsp(data): Observable<any> {
    return this.http.post(`garage/usp/create`, data);
  }

  insertGarageInsurerMapping(data): Observable<any> {
    return this.http.post(`garage-panel/insurermapping/create`, data);
  }

  getGarageInsurerMapping(options): Observable<any> {
    return this.http.get(`garage-panel/insurermapping`, options);
  }

  getGarageDocs(options): Observable<any> {
    return this.http.get(`garage/agreement-upload`, options);
  }

  getGarageDocsCatStatus(options): Observable<any> {
    return this.http.get(`garage/agreement-upload-cat-status`, options);
  }

  insertGarageDocStatus(data): Observable<any> {
    return this.http.fileUploadPost(`garage/agreement-upload-status`, data);
  }


  insertGarageDocCatStatus(data): Observable<any> {
    return this.http.post(`garage/agreement-upload-cat-status`, data);
  }


  insertGarageDetails(data): Observable<any> {
    return this.http.post(`garage/create`, data);
  }

  insertManyGarageUsp(data): Observable<any> {
    return this.http.post(`garage-panel/usp-transactions`, data);
  }

  updateManyGarageUsp(data): Observable<any> {
    return this.http.put(`garage-panel/usp-transactions`, data);
  }

  updateGaragePickupTiming(data): Observable<any> {
    return this.http.put(`garage/pickup-timing`, data);
  }
}

import { Injectable } from '@angular/core';
import {
  HttpClient, HttpHeaders, HttpParams, HttpRequest,
  HttpErrorResponse, HttpHandler, HttpEvent, HttpResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';

import { GlobalService } from '../services/global.service';

@Injectable()
export class HttpRequestService {

  private static baseUrl: string;
  private protocol: string = window.location.protocol;
  private domain: string = environment.domain;
  private userCredential: Object;

  constructor(private http: HttpClient, private globalService: GlobalService) {
    HttpRequestService.baseUrl = `${this.protocol}//${this.domain}`;
  }

  get(url: string, queryParams?: HttpParams): Observable<any> {
    const reqOptions = this.initializeReqOptions(queryParams, false);
    return this.http.get(`${HttpRequestService.baseUrl}/` + url, reqOptions);
  }

  post(url: string, body?: Object, queryParams?: HttpParams) {
    const reqOptions = this.initializeReqOptions(queryParams, false);
    return this.http.post(`${HttpRequestService.baseUrl}/` + url, body, reqOptions);
  }

  put(url: string, body?: Object, queryParams?: HttpParams) {
    const reqOptions = this.initializeReqOptions(queryParams, false);
    return this.http.put(`${HttpRequestService.baseUrl}/` + url, body, reqOptions);
  }

  delete(url: string, queryParams?: HttpParams) {
    const reqOptions = this.initializeReqOptions(queryParams, false);
    return this.http.delete(`${HttpRequestService.baseUrl}/` + url, reqOptions);
  }

  fileUploadPost(url: string, body?: Object, queryParams?: HttpParams) {
    const reqOptions = this.initializeReqOptions(queryParams, true);
    return this.http.post(`${HttpRequestService.baseUrl}/` + url, body, reqOptions);
  }

  initializeReqOptions(queryParams?: HttpParams, multipart = false) {
    const reqOptions = new Object();
    let headers = new HttpHeaders();

    if (!multipart) {
      headers = headers.set('Content-Type', 'application/json');
    }
    // const token = this.globalService.getUserCredential();
    const userProfile = this.globalService.getUserCredential();
    if (userProfile) {
      headers = headers.set('token', userProfile.Token);
      headers = headers.set('userid', userProfile.userData.UserId);
    }

    reqOptions['headers'] = headers;
    reqOptions['params'] = queryParams;

    return reqOptions;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an throwError with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}




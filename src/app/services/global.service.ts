import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { CookieService } from './cookie.service';
import { DynamicComponentService } from '../shared/dynamic-component.service';

import { AlertDialogComponent, AlertDialogOptionsI } from '../shared/alert-dialog/alert-dialog.component';
import * as CryptoJS from 'crypto-js';

export interface UserConfig {
  BucketSize: number;
  CompanyId: number;
  CreatedBy: number;
  CreatedOn: string;
  DailyLimit: number;
  Email: string;
  EmployeeId: string;
  Grade: number;
  LoginId: string;
  ManagerId: number
  MobileNo: number
  Name: string;
  Password: string;
  UpdatedBy: number;
  UpdatedOn: string;
  UserId: number;
  UserType: number;
  isActive: number;
  isAutoAllocation: number;
}

@Injectable()
export class GlobalService {
  privateIp: any = '0.0.0.0';
  private userDetails = new Subject<UserConfig>();
  constructor(private cookieService: CookieService,
    private http: HttpClient,
    private dyComService: DynamicComponentService) {
    this.getClientPrivateIp();

  }

  getUserCredential() {
    // if (this.cookieService.getCookie('user')) {
    //   const obj = this.AesDecryption(this.cookieService.getCookie('user'), this.privateIp);
    //   return JSON.parse(obj);
    // } else {
    //   this.cookieService.deleteCookie('user');
    // }

    if (sessionStorage.getItem(('user'))) {
      const obj = atob(sessionStorage.getItem(('user')));
      return JSON.parse(obj);
    } else {
      sessionStorage.clear();
    }

  }

  // AesDecryption(data, key) {
  //   const cokie = CryptoJS.AES.decrypt(data.toString(), key);
  //   return cokie.toString(CryptoJS.enc.Utf8)
  // }

  // AesEncryption(data: string, key: string) {
  //   return CryptoJS.AES.encrypt(data, key);
  // }

  setUserCredential(userCredential) {
    // this.cookieService.deleteCookie('user');
    // this.userDetails.next(userCredential);
    // let user = this.AesEncryption(JSON.stringify(userCredential), this.privateIp);
    // this.cookieService.setCookie('user', user.toString(), 7);

    this.deleteUserCredential()
    // this.userDetails.next(userCredential);
    let user = btoa(JSON.stringify(userCredential));
    sessionStorage.setItem('user', user);
    this.cookieService.setCookie('user', user.toString(), 7);
  }

  deleteUserCredential() {
    // this.cookieService.deleteCookie('user');
    localStorage.clear();
    sessionStorage.clear();
  }

  getClaimAgentCredential() {
    let obj;
    if (sessionStorage.getItem(('isClaimAgent'))) {
      obj = parseInt(atob(sessionStorage.getItem(('isClaimAgent'))));
    }
    return obj;
  }

  setClaimAgentCredential(userCredential) {
    let isClaimAgent = btoa(userCredential);
    sessionStorage.setItem('isClaimAgent', isClaimAgent);
    // this.cookieService.setCookie('user', isClaimAgent.toString(), 7);
  }

  dialerLogin(options) {
    const reqOptions = this.initializeReqOptions(options);
    return this.http.get('http://10.0.30.40/api/loginQueue.php', reqOptions);
  }

  dialerLogout(options) {
    return this.http.get('http://10.0.30.40/api/logoutQueue.php', options);
  }

  dialerCall(options: HttpParams): Observable<any> {
    const reqOptions = this.initializeReqOptions(options);
    return this.http.get('https://easydial123.policybazaar.com/services/easyobcall.php', reqOptions);
  }

  private initializeReqOptions(queryParams?: HttpParams) {
    const reqOptions = new Object();

    let headers = new HttpHeaders();
    reqOptions['params'] = queryParams;

    return reqOptions;
  }

  successResponse(successMessage) {
    const options: AlertDialogOptionsI = {
      title: 'Success',
      message: successMessage,
      confirmText: 'OK'
    };
    this.response(options);
  }

  errorResponse(errorMesaage) {
    const options: AlertDialogOptionsI = {
      title: 'Error',
      message: errorMesaage,
      confirmText: 'OK'
    };
    this.response(options);
  }

  response(options) {
    this.dyComService.loadComponent(AlertDialogComponent, options).subscribe((data) => {
      console.log(data);
    });
  }

  dynamoDbsave(data): Observable<any> {
    return this.http.post('http://utility.quickfixcars.com/api/DynamoDb/PostInput', data);
  }

  getClientPrivateIp() {
    var that = this;
    window['RTCPeerConnection'] = window['RTCPeerConnection'] ||
      window['mozRTCPeerConnection'] ||
      window['webkitRTCPeerConnection']; //compatibility for Firefox and chrome
    if (!window['RTCPeerConnection']) {
      that.privateIp = '0.0.0.0';
      return;
    }
    var pc = new RTCPeerConnection({ iceServers: [] }), noop = function () { }

    var localIPs = {}, ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g, key;

    function iterateIP(ip) {
      that.privateIp = ip;
      // localIPs[ip] = true;
    }

    //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function (sdp) {
      sdp.sdp.split('\n').forEach(function (line) {
        if (line.indexOf('candidate') < 0) return;
        line.match(ipRegex).forEach(iterateIP);
      });

      pc.setLocalDescription(sdp);
    }).catch(function (reason) {
      // An error occurred, so handle the failure to connect
    });

    //listen for candidate events
    pc.onicecandidate = function (ice) {
      if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
      ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
      console.log('localIPs', localIPs)
    };
  }

  updateClaimLeadStatus(data): Observable<any> {
    return this.http.post(`${environment.claimApiBaseUrl}/OnlineClaim/UpdateClaimStatusbyQFC`, data);
  }

  insertClaimGarage(data): Observable<any> {
    return this.http.post(`${environment.claimApiBaseUrl}/Claim/SetGarageMaster`, data);
  }
}


import { Injectable } from "@angular/core";

import { HttpRequestService } from "../services/http-request.service";
import { Observable } from "rxjs";

@Injectable()
export class LeadService {
  pickupContactDetails: any = {};

  constructor(private http: HttpRequestService) { }

  getLeadStatusCount(userId, options): Observable<any> {
    return this.http.get(`lead/statuscount/${userId}`, options);
  }

  getLeads(options): Observable<any> {
    return this.http.get(`lead/all`, options);
  }

  getClaimLeads(options): Observable<any> {
    return this.http.get(`lead/allclaim`, options);
  }

  getLeadDetail(leadId): Observable<any> {
    return this.http.get(`lead/alldetail/${leadId}`);
  }

  getLeadComments(leadId): Observable<any> {
    return this.http.get(`lead/comments/${leadId}`);
  }

  getLeadServiceSelection(leadId): Observable<any> {
    return this.http.get(`lead/serviceselection/${leadId}`);
  }

  getLeadCustomerSelection(leadId): Observable<any> {
    return this.http.get(`lead/customerselection/${leadId}`);
  }

  // TODO :remove
  saveLeadGarageSelection(data): Observable<any> {
    return this.http.post(`garage/garageselection/create`, data);
  }

  saveLeadComment(data): Observable<any> {
    return this.http.post(`lead/comment/create`, data);
  }

  parseDateTime(date, time) {
    return `${date.day}/${date.month}/${date.year}, ${time.hour}:${
      time.minute
      }`;
  }

  saveLeadFollowup(data): Observable<any> {
    return this.http.post(`lead/createCallback`, data);
  }

  getLeadCallDetail(leadId): Observable<any> {
    return this.http.get(`comm/leadcall/${leadId}`);
  }

  getLeadCallbackDetail(leadId): Observable<any> {
    return this.http.get(`lead/callback/${leadId}`);
  }

  getLeadAssignedUser(leadId): Observable<any> {
    return this.http.get(`lead/assignedusers/${leadId}`);
  }

  getLeadAuditTrail(leadId): Observable<any> {
    return this.http.get(`lead/audittrail/${leadId}`);
  }

  getLeadCommDetail(leadId): Observable<any> {
    return this.http.get(`comm/commdetail/${leadId}`);
  }

  getLeadPickupDetail(leadId): Observable<any> {
    return this.http.get(`lead/pickupdetail/${leadId}`);
  }

  savePickupDetail(data): Observable<any> {
    return this.http.post(`lead/pickupdetail/create`, data);
  }

  getFormattedDate(date) {
    const d = new Date(date);
    return {
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear()
    };
  }

  parseDate(date) {
    return (
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
    );
  }

  saveLeadCallDetail(options): Observable<any> {
    return this.http.get(`comm/leadcall/create`, options);
  }

  updateCustomerDetails(data): Observable<any> {
    return this.http.post(`customer/register`, data);
  }

  updateLeadDetails(leadId, data): Observable<any> {
    return this.http.put(`lead/update/${leadId}`, data);
  }

  updateLeadStatus(data): Observable<any> {
    return this.http.put(`lead/status/update`, data);
  }

  updateLeadBookingDetails(data): Observable<any> {
    return this.http.post(`garage/booking/create`, data);
  }

  saveSaleVerificationDetails(data): Observable<any> {
    return this.http.post(`garage/booking/saleVerificationInfo`, data);
  }

  getOfferAvailedByCustomer(leadId): Observable<any> {
    return this.http.get(`customer/offers/${leadId}`);
  }

  insertLeadDetails(data): Observable<any> {
    return this.http.post(`lead/create`, data);
  }

  insertCustomerSelection(data): Observable<any> {
    return this.http.post(`lead/customerselection/create`, data);
  }

  getMessageMaster(): Observable<any> {
    return this.http.get(`lead/status/update`);
  }

  getAllLeadReport(options): Observable<any> {
    console.log(options);
    return this.http.get(`lead/report`, options);
  }

  getUserProductrole(userId): Observable<any> {
    return this.http.get(`user/productrole/${userId}`);
  }
  getGarageUserDetails(garageid): Observable<any> {
    return this.http.get(`garage-panel/user/all/${garageid}`);
  }

  confirmGarageBookingStatus(data): Observable<any> {
    return this.http.post(`garage/confirm-booking`, data);
  }
}

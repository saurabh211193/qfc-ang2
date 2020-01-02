import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { LeadService } from '../lead.service';
import { DynamicComponentService } from '../../shared/dynamic-component.service';
import { GlobalService, UserConfig } from '../../services/global.service';
import { MasterService } from '../../services/master.service';

import { GarageListModalComponent } from '../garage-list-modal/garage-list-modal.component';
import { BookingModalComponent } from '../booking-modal/booking-modal.component';

import { leadData, customerData } from '../lead';


@Component({
  selector: 'app-selection-detail',
  templateUrl: './selection-detail.component.html',
  styleUrls: ['./selection-detail.component.css']
})
export class SelectionDetailComponent implements OnInit {

  @Input('leadDetail') leadDetail: leadData;
  @Input('customer') customerDetail: customerData;
  @Input('isClaimLead') IsClaimLead: any;
  @Input('booking') bookingDetail: any;

  @Output() initializeLead = new EventEmitter();

  garageForm: FormGroup;
  service: any;

  garageDetail: any;
  services: any;

  userDetails: UserConfig;
  serviceAdvisor: any;
  pickupguy: any;
  garageSelectionStatusMaster: any;
  garageSelectionStatus: any = '';
  selectionServiceAdvisor: any = '';
  selectionPickupguy: any = '';
  StatusIdMapping: any = {
    1: { // accept
      qfcStatusId: 62,
      qfcSubStatusId: 189,
      claimStatusId: 139,
      claimSubStatusId: 963,
    },
    2: { // denied
      qfcStatusId: 62,
      qfcSubStatusId: 187,
      claimStatusId: 139,
      claimSubStatusId: 961,
    },
    3: { // rescheduled
      qfcStatusId: 62,
      qfcSubStatusId: 186, // 216
      claimStatusId: 139,
      claimSubStatusId: 960, // 965
    }
  }

  constructor(private leadService: LeadService,
    private fb: FormBuilder,
    private dycomService: DynamicComponentService,
    private globalService: GlobalService,
    private router: Router,
    private activatedRoute: ActivatedRoute, private masterService: MasterService) { }

  ngOnInit() {
    console.log('bookingDetail', this.bookingDetail)
    this.userDetails = this.globalService.getUserCredential()['userData'];
    this.getLeadGarageSelection();
    this.getLeadServiceSelection();
    this.getGarageSelectionStatusMaster();
    this.getGarageUser();
    this.garageSelectionStatus = this.bookingDetail.SelectionStatusId;
  }

  buildForm() {
    this.garageForm = this.fb.group({
      GarageName: [this.garageDetail.GarageName ? this.garageDetail.GarageName : ''],
      GarageContactPersonName: [this.garageDetail.GarageContactPersonName],
      GarageContactPersonMobileNo: [this.garageDetail.GarageContactPersonMobileNo],
      GarageAddress: [this.garageDetail.GarageAddress],
      GarageAlternateNo: [this.garageDetail.GarageAlternateNo],
      GarageEmail: [this.garageDetail.GarageEmail],
    })
  }

  getLeadServiceSelection() {
    this.leadService.getLeadServiceSelection(this.leadDetail.LeadId).subscribe(
      (res) => {
        console.log(res);
        this.services = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getLeadGarageSelection() {
    this.leadService.getLeadCustomerSelection(this.leadDetail.LeadId).subscribe(
      (res) => {
        this.garageDetail = res.data[0];
        if (this.garageDetail) {
          this.buildForm();
          this.getGarageUserDetails();
        }

        // this.selectedGarageId = this.garageDetail.GarageId;
      }, (err) => {
        console.error(err);
      }
    )
  }

  openGarageListModal() {
    const options = {
      leadId: this.leadDetail.LeadId,
      pbClaimId: this.leadDetail.PBClaimId,
      distance: 60,
      latitude: this.leadDetail.Latitude,
      longitude: this.leadDetail.Longitude,
      make: this.leadDetail.MakeName,
      serviceid: 0
    };

    this.dycomService.loadComponent(GarageListModalComponent, options).subscribe(
      (res) => {
        console.log(res);
        this.getLeadGarageSelection();
      },
      (err) => {
        console.error(err);
      }
    )
  }

  async dialerCall(mobileNo, context) {

    const callId = await this.saveLeadCallLog(mobileNo, context);

    let params = new HttpParams();
    params = params.set('phone', `645740${mobileNo}`)
      .set('leadid', this.leadDetail.LeadId.toString())
      .set('campaign', context)
      .set('emp', this.userDetails.EmployeeId)
      .set('uid', callId.toString());

    this.globalService.dialerCall(params).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error(err);
      }
    )
  }

  saveLeadCallLog(mobileNo, context) {
    let params = new HttpParams();
    params = params.set('callid', '')
      .set('leadid', this.leadDetail.LeadId.toString())
      .set('mobileno', mobileNo)
      .set('userid', this.userDetails.EmployeeId.toString())
      .set('context', context)
      .set('calldate', '')
      .set('calltype', 'OB')
      .set('duration', '')
      .set('talktime', '')
      .set('status', '')
      .set('disposition', '');

    return new Promise((resolve, reject) => {
      this.leadService.saveLeadCallDetail(params).subscribe(
        (res) => {
          console.log(res);
          return resolve(res.data[0].CallId);
        },
        (err) => {
          console.error(err);
          return reject(err);
        }
      )
    })
  }

  openBookingDetailModal() {
    const options = {
      garage: this.garageDetail,
      lead: this.leadDetail,
      customer: this.customerDetail
    };
    this.dycomService.loadComponent(BookingModalComponent, options).subscribe(
      (res) => {
        console.log(res);
        this.initializeLead.emit(true);
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getGarageDetail(garageId) {
    this.router.navigate([`../../../garage/detail/${btoa(garageId)}`], { relativeTo: this.activatedRoute });
  }

  sendGarageAddress() {
    let message = {
      MobileNo: this.customerDetail.CustomerMobileNo,
      Target: 'c',
      CountryCode: 9,
      LeadId: this.leadDetail.LeadId,
      SMSType: null,
      Message: `Hi! Your car service is booked for ${this.garageDetail.GarageName} at ${this.garageDetail.GarageAddress}. You can reach us at 0124-6435210 for any further assistance. Team QuickFixCars.`
    };

    this.masterService.sendSMS(message).subscribe(
      (res) => {
        console.log(res);
        this.globalService.successResponse(res.message);
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getGarageUserDetails() {
    this.leadService.getGarageUserDetails(this.garageDetail.GarageId).subscribe(
      (res) => {
        if (res.data.length) {
          const garageUser = res.data;
          let users = {};
          garageUser.filter(user => {
            if (users[user.Designation]) {
              users[user.Designation].push(user);
            } else {
              users[user.Designation] = [];
              users[user.Designation].push(user);
            }
          });

          this.serviceAdvisor = users['1'];
          this.pickupguy = users['2'];
        }
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getGarageSelectionStatusMaster() {
    this.masterService.garageselectonstatus().subscribe(
      (res) => {
        this.garageSelectionStatusMaster = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  confirmGarageBookingStatus() {
    const data = {
      _BookingDetailId: this.bookingDetail.BookingDetailId,
      _CommentSource: "crm",
      _CommentType: 1,
      _Comments: null,
      _GarageId: this.bookingDetail.SelectionId,
      _IsConfirmed: 1,
      _LeadId: this.leadDetail.LeadId,
      _StatusId: this.garageSelectionStatus,
    };

    this.leadService.confirmGarageBookingStatus(data).subscribe(
      (res) => {
        this.updateLeadStatus();
      },
      (err) => {
        console.error(err);
      }
    )
  }

  saveGarageUserDetail(user) {
    console.log(user);

    const data = {
      BookingDetailId: this.bookingDetail.BookingDetailId,
      ContactPersonMobileNo: user.MobileNo,
      ContactPersonName: user.Name,
      LeadId: this.leadDetail.LeadId,
      UserId: this.userDetails.UserId,
      DesignationId: user.Designation,
    }
    this.leadService.savePickupDetail(data).subscribe(
      (res) => {

      },
      (err) => {
        console.error(err);
      }
    )
  }



  getGarageUser() {
    this.leadService.getLeadPickupDetail(this.leadDetail.LeadId).subscribe(
      (res) => {
        console.log(res);

      },
      (err) => {
        console.error(err);
      }
    )
  }

  callGarageUser(user) {
    this.dialerCall(user.MobileNo, 'qfcgarage');
  }

  updateClaimLeadStatus() {
    // this.getClaimStatus();
    const data = {
      ActionBy: 'QFC-CRM',
      ClaimId: this.leadDetail.PBClaimId,
      CustomerMobileNo: 0,
      OfficerMobileNo: 0,
      ProductId: 117,
      RegistrationNo: 0,
      StatusId: this.StatusIdMapping[this.garageSelectionStatus].claimStatusId,
      SubStatusId: this.StatusIdMapping[this.garageSelectionStatus].claimSubStatusId,
      SurveyorMobileNo: 0,
      UserId: 124
    };

    this.globalService.updateClaimLeadStatus(data).subscribe(
      (res) => {

      },
      (err) => {
        console.error(err);
      }
    )
  }

  updateLeadStatus() {

    if (this.leadDetail.ProductId == 4) {
      this.updateClaimLeadStatus();
    };
    const leadStatusDetails = {
      LeadId: this.leadDetail.LeadId,
      StatusId: this.StatusIdMapping[this.garageSelectionStatus].qfcStatusId,
      SubStatusId: this.StatusIdMapping[this.garageSelectionStatus].qfcSubStatusId,
      UserId: this.userDetails.UserId,
    };

    this.leadService.updateLeadStatus(leadStatusDetails).subscribe(
      (res) => {
        console.log(res);
        // this.claimService.getNewClaims(this.userDetails.UserId);
      },
      (err) => {
        console.error(err);
      }
    );
  }

}

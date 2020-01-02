import { Component, OnInit, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';

import { MasterService } from '../../services/master.service';
import { LeadService } from '../lead.service';
import { GlobalService, UserConfig } from '../../services/global.service';

import { customerData, leadData, bookingData, bookedGarageData } from '../lead';

import { Messages } from '../lead-messages';
import { LeadStatusMessages } from '../lead-status-messages';
import { async } from 'q';
import { DynamicComponentService } from 'src/app/shared/dynamic-component.service';
import { DisclosureComponent } from '../disclosure/disclosure.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  userDetails: UserConfig;
  leadId: string;
  comments: any[];
  statusMaster: any[];
  subStatusMaster: any[];
  StatusId: any = '0';
  SubStatusId: any = '0';
  AllMake: any;

  InboundNo: any = '0124-6435210';

  customerDetail: customerData;
  leadDetail: leadData;
  bookingDetail: bookingData;
  bookedGarageDetail: bookedGarageData;
  statusDetail: any;

  followUpWithList = [
    'Customer',
    'Garage',
    'Insurer',
    'Surveyor'
  ];
  followUp = {
    with: '',
    date: null,
    time: null
  };
  communications: any = [];
  commId: any = '0';
  pickupContactDetails: any;
  MessageMaster: any = {};
  IsClaimLead: boolean = false;
  claimStatusId: any;
  claimSubStatusId: any;

  constructor(private masterService: MasterService,
    private dyComService: DynamicComponentService,
    public leadService: LeadService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    config: NgbTimepickerConfig) {
    config.seconds = false;
    config.spinners = false;
    if (this.router.url.indexOf('detail-claim') > -1) {
      const dummyUser = { "Token": "dummytokenforClaimAgent", "userData": { "UserId": 0 } };
      this.globalService.setUserCredential(dummyUser);
      this.globalService.setClaimAgentCredential(1);
    } else {
      this.globalService.setClaimAgentCredential(0);
    }
    this.route.params.subscribe(params => {
      this.leadId = atob(params.leadid);
      this.getLeadDetail();
    });

  }


  ngOnInit() {
    this.getAllMake();
    // this.getAllStatus();
    this.getLeadComments();
    this.userDetails = this.globalService.getUserCredential()['userData'];
    this.getPickupContactDetails();
  }

  getAllMake() {
    this.masterService.getAllMake().subscribe(
      (res) => {
        this.AllMake = res.data;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getAllStatus() {
    this.masterService.getAllStatus(this.leadDetail.ProductId).subscribe(
      (res) => {
        console.log(res);
        this.statusMaster = res.data;
      }, (err) => {
        console.error(err);
      }
    );
  }

  getLeadDetail() {
    this.leadService.getLeadDetail(this.leadId).subscribe(
      (res) => {
        this.customerDetail = res.data.customer;
        this.leadDetail = res.data.detail;
        console.log('leadDetailleadDetail', this.leadDetail);
        this.bookingDetail = res.data.booking;
        this.bookedGarageDetail = res.data.garage;
        this.statusDetail = res.data.status;
        this.getAllStatus();
        this.getPickupContactDetails();
        this.getAllStatus();
        this.checkLeadProduct();
      },
      (err) => {
        console.error(err);
      }
    );
  }


  getLeadComments() {
    this.leadService.getLeadComments(this.leadId).subscribe(
      (res) => {
        this.comments = res.data;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getLeadGarageSelection() {
    this.leadService.getLeadCustomerSelection(this.leadId).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getleadServiceSelection() {
    this.leadService.getLeadServiceSelection(this.leadId).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  saveComment(commentData) {
    const data = {
      LeadId: this.leadId,
      Comments: commentData.Comments,
      CommentSource: commentData.CommentSource,
      CommentType: commentData.CommentType,
      UserId: commentData.UserId
    };
    this.leadService.saveLeadComment(data).subscribe(
      (res) => {
        console.log(res);
        this.getLeadComments();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  changeSubStatus(target) {

    if (!target) return;
    const statusObj = this.statusMaster.filter(status => {
      return status.StatusId == target;
    });
    this.subStatusMaster = statusObj[0].SubStatus;
    console.log(target, this.subStatusMaster, statusObj);

  }

  setLeadFollowup() {
    const leadFollowUp = {
      FollowUpDateTime: this.leadService.parseDateTime(this.followUp.date, this.followUp.time),
      FollowUpWith: this.followUp.with,
      LeadId: this.leadId,
      UserId: this.userDetails.UserId
    };

    this.leadService.saveLeadFollowup(leadFollowUp).subscribe(
      (res) => {
        console.log(res);
        this.globalService.successResponse(res.message);
        this.getLeadDetail();
        this.followUp.date = null;
        this.followUp.time = null;
        this.followUp.with = '';
      },
      (err) => {
        console.error(err);
      }
    );
  }

  setStatus() {
    if (!this.validateStatus()) return;
    if (this.StatusId === '7' && ['16', '18', '19'].includes(this.SubStatusId)) {
      const data = {
        vehicleNo: this.leadDetail.RegistrationNo ? this.leadDetail.RegistrationNo : '',
        billValue: this.bookingDetail.TotalCost ? this.bookingDetail.TotalCost : '',
        garageName: this.bookedGarageDetail.GarageName ? this.bookedGarageDetail.GarageName : '',
        serviceDate: this.bookingDetail.ServiceOn ? this.bookingDetail.ServiceOn : '',
        carName: (this.leadDetail.MakeName ? this.leadDetail.MakeName : '') + ' ' + (this.leadDetail.ModelName ? this.leadDetail.ModelName : ''),
      }
      this.dyComService.loadComponent(DisclosureComponent, data).subscribe(
        (res) => {
          if (res.isDisclosureSubmitted) {
            this.updateLeadStatus();
          }
        },
        (err) => {
          console.error(err);
        }
      );
    } else {
      this.updateLeadStatus();
    }

  }

  updateLeadStatus() {

    if (this.leadDetail.ProductId == 4) {
      this.updateClaimLeadStatus();
    };

    const leadStatusDetails = {
      LeadId: this.leadDetail.LeadId,
      StatusId: this.StatusId,
      SubStatusId: this.SubStatusId,
      UserId: this.userDetails.UserId,
    };

    this.leadService.updateLeadStatus(leadStatusDetails).subscribe(
      (res) => {
        console.log(res);
        this.getLeadDetail();
        this.sendSMSGarage();
        this.statusChangeMsg();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getMessageMaster() {
    this.masterService.getMessageMaster(this.leadDetail.ProductId).subscribe(
      (res) => {
        console.log('getMessageMaster', res.data);
        for (let x = 0; x < res.data.length; x++) {
          this.MessageMaster[res.data[x]['MessageId']] = res.data[x];
        }
        if (Object.keys(this.MessageMaster).length)
          this.initiateCommMessages();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  initiateCommMessages() {
    // communication shown after booked
    this.communications = [];
    if (this.statusDetail.StatusId >= 3 && this.bookedGarageDetail.GarageId) {
      this.communications.push(this.MessageMaster['1']);
      this.communications.push(this.MessageMaster['2']);
      if (this.leadService.pickupContactDetails && this.bookingDetail.IsPickupRequied !== 0) {
        this.communications.push(this.MessageMaster['3']);
      }
      this.communications.push(this.MessageMaster['7']);
    }
    if (this.statusDetail.StatusId == 5) {
      this.communications.push(this.MessageMaster['5']);
    }
    this.communications.push(this.MessageMaster['8']);

  }

  sendSMSCustomer() {
    let message = {
      MobileNo: this.customerDetail.CustomerMobileNo,
      Target: 'c'
    };

    if (this.commId == '6') {
      this.checkSaleVerification(message, 9);
    }
    else {
      this.sendCommunication(message, this.commId);
    }
  }

  sendSMSGarage() {
    let message = {
      MobileNo: this.bookedGarageDetail.GarageContactPersonMobileNo,
      Target: 'g'
    };

    if (this.statusDetail.StatusId == 3 && this.statusDetail.SubStatusId == 8) {
      this.sendCommunication(message, '4');
    } else if (this.statusDetail.StatusId == 5 && this.statusDetail.SubStatusId == 13) {
      this.sendCommunication(message, '5');
    } else {
      this.globalService.successResponse('Success');
    }
  }

  sendCommunication(message, commId) {
    message['CountryCode'] = 91;
    message['LeadId'] = this.leadDetail.LeadId;
    message['SMSType'] = null;
    message['MMId'] = commId;
    console.log(message, this.bookedGarageDetail);

    const pickupDate = new Date(this.bookingDetail.BookingPickupDate);
    const pickupDateFormat = this.leadService.parseDate(pickupDate);

    switch (commId) {
      case '1':
        {
          message['Message'] = this.MessageMaster[commId].Message;
          message['Message'] = message['Message'].replace('$customerName', this.customerDetail.CustomerName ? this.customerDetail.CustomerName : 'CustomerCustomer');
          message['Message'] = message['Message'].replace('$garageName', this.bookedGarageDetail.GarageName);
          message['Message'] = message['Message'].replace('$pickupDate', pickupDateFormat);
          message['Message'] = message['Message'].replace('$pickupTime', this.bookingDetail.BookingPickupTime);
          break;
        }

      case '2':
        {
          message['Message'] = this.MessageMaster[commId].Message;
          message['Message'] = message['Message'].replace('$garageName', this.bookedGarageDetail.GarageName);
          break;
        }

      case '3':
        {
          message['Message'] = this.MessageMaster[commId].Message;
          message['Message'] = message['Message'].replace('$customerName', this.customerDetail.CustomerName ? this.customerDetail.CustomerName : 'Customer');
          message['Message'] = message['Message'].replace('$contactPersonName', this.leadService.pickupContactDetails.ContactPersonName ? this.leadService.pickupContactDetails.ContactPersonName : 'ContactPerson');
          message['Message'] = message['Message'].replace('$garageName', this.bookedGarageDetail.GarageName);
          message['Message'] = message['Message'].replace('$pickupDate', pickupDateFormat);
          message['Message'] = message['Message'].replace('$pickupTime', this.bookingDetail.BookingPickupTime);
          message['Message'] = message['Message'].replace('$contactPersonMobileNo', this.leadService.pickupContactDetails.ContactPersonMobileNo);
          break;
        }

      case '4':
        {
          message['Message'] = this.MessageMaster[commId].Message;
          message['Message'] = message['Message'].replace('$pickupDate', pickupDateFormat);
          message['Message'] = message['Message'].replace('$pickupTime', this.bookingDetail.BookingPickupTime);
          break;
        }

      case '5':
        {
          message['Message'] = this.MessageMaster[commId].Message;
          message['Message'] = message['Message'].replace('$leadId', this.leadDetail.LeadId);
          break;
        }

      case '6':
        {
          message['Message'] = this.MessageMaster[commId].Message;
          message['Message'] = message['Message'].replace('$garageName', this.bookedGarageDetail.GarageName);
          message['Message'] = message['Message'].replace('$Otp', 1234);
          message['Message'] = message['Message'].replace('$serviceOn', this.bookingDetail.ServiceOn);
          message['Message'] = message['Message'].replace('$totalCost', this.bookingDetail.TotalCost);
          break;
        }

      case '7':
        {
          message['Message'] = this.MessageMaster[commId].Message;
          message['Message'] = message['Message'].replace('$garageName', this.bookedGarageDetail.GarageName);
          message['Message'] = message['Message'].replace('$garageLocation', this.bookedGarageDetail.GarageAddress);
          message['Message'] = message['Message'].replace('$inboundNo', this.InboundNo);
          break;
        }

      case '8':
        {
          message['Message'] = this.MessageMaster[commId].Message;
          break;
        }
      default:
        break;
    }

    this.masterService.sendSMS(message).subscribe(
      (res) => {
        console.log(res);
        this.globalService.successResponse(res.message);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getPickupContactDetails() {
    this.leadService.getLeadPickupDetail(this.leadId).subscribe(
      (res) => {
        this.leadService.pickupContactDetails = res.data[0];
        this.getMessageMaster();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  async checkSaleVerification(message, templateId) {
    if (this.bookingDetail.ServiceOn && this.bookingDetail.TotalCost) {
      let code = btoa(((this.leadDetail.LeadId * 2) + (this.customerDetail.CustomerId * 2)).toString());
      // let Message1 = `Dear Customer, please click https://qfcwz.in/bookigDetails/${code} to confirm you car servicing from ${this.bookedGarageDetail.GarageName} at a price of INR ${this.bookingDetail.TotalCost} by https://quickFixcars.com`;
      // let Message = `Dear Customer, please click https://qfcwz.in/bookigDetails/$code to confirm you car servicing from $GarageName at a price of INR $TotalCost by https://quickFixcars.com.`;
      let Message = '';
      Message = this.MessageMaster['templateId'].Message;
      Message = Message.replace('$code', code);
      Message = Message.replace('$GarageName', this.bookedGarageDetail.GarageName);
      Message = Message.replace('$TotalCost', this.bookingDetail.TotalCost);

      let data = {
        LeadId: this.leadDetail.LeadId,
        CustomerId: this.customerDetail.CustomerId,
        MobileNo: this.customerDetail.CustomerMobileNo,
        EmailId: this.customerDetail.CustomerEmail,
        Body: Message,
        VerificationCode: "",
        Type: 1,
        VerificationType: 1,
        TotalCost: this.bookingDetail.TotalCost,
        GarageName: this.bookedGarageDetail.GarageName
      }
      const res = await this.saveSaleVerificationDetails(data);
      if (res > 0) {
        this.globalService.successResponse("Verification Message Sent Successfully");
        //this.sendCommunication(message, this.commId);
      }
    }
    else {
      this.globalService.successResponse("Please Confirm and Fill the Service Date and Service Cost");
    }
  }

  saveSaleVerificationDetails(data) {
    return new Promise((resolve, reject) => {
      this.leadService.saveSaleVerificationDetails(data).subscribe(
        (res) => {
          console.log(res);
          return resolve(res);
        },
        (err) => {
          console.error(err);
          return reject(err);
        }
      )
    })
  }

  validateStatus() {
    switch (this.StatusId) {
      case "3":
      case "5":
      case "7": {
        if (!this.bookingDetail.BookingDetailId) {
          this.globalService.errorResponse('Booking not done');
          return false;
        }
      }
      default:
        return true;
    }
  }

  statusChangeMsg() {
    let message = {
      MobileNo: this.customerDetail.CustomerMobileNo,
      Target: 'c',
      CountryCode: 91,
      LeadId: this.leadDetail.LeadId,
      SMSType: null,
      Message: null,
    };

    switch (this.StatusId) {
      case "7": {
        if (this.SubStatusId == "18") {
          message['Message'] = LeadStatusMessages["1"]()
        }
      }
      default:
        break;
    }

    if (message.Message) {
      this.masterService.sendSMS(message).subscribe(
        (res) => {
          console.log(res);
          this.globalService.successResponse(res.message);
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  checkLeadProduct() {
    if (this.leadDetail.ProductId == 4) this.IsClaimLead = true;
  }

  updateClaimLeadStatus() {
    this.getClaimStatus();
    const data = {
      ActionBy: 'Agent',
      ClaimId: this.leadDetail.PBClaimId,
      CustomerMobileNo: '0',
      OfficerMobileNo: '0',
      ProductId: 117,
      RegistrationNo: '0',
      StatusId: this.claimStatusId,
      SubStatusId: this.claimSubStatusId,
      SurveyorMobileNo: '0',
      UserId: 124
    };

    // const data = {
    //   ClaimId: this.leadDetail.PBClaimId,
    //   StatusId: this.claimStatusId,
    //   SubStatusId: this.claimSubStatusId,
    //   UserId: 124
    // };

    this.globalService.updateClaimLeadStatus(data).subscribe(
      (res) => {

      },
      (err) => {
        console.error(err);
      }
    )
  }

  getClaimStatus() {
    const statusObj = this.statusMaster.filter(status => {
      return status.StatusId == this.StatusId;
    });
    let substatusObj;

    substatusObj = statusObj[0].SubStatus.filter(substatus => {
      return substatus.SubStatusId == this.SubStatusId;
    });

    this.claimStatusId = statusObj[0].ClaimStatusId;
    this.claimSubStatusId = substatusObj[0].ClaimSubStatusId;

  }
}

import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

import { bookingData, bookedGarageData, leadData, customerData } from "../lead";

import { DynamicComponentService } from "../../shared/dynamic-component.service";
import { GlobalService, UserConfig } from "../../services/global.service";
import { LeadService } from "../lead.service";
import { MasterService } from "../../services/master.service";

import { PickupContactComponent } from "../pickup-contact/pickup-contact.component";

@Component({
  selector: "app-booking-detail",
  templateUrl: "./booking-detail.component.html",
  styleUrls: ["./booking-detail.component.css"]
})
export class BookingDetailComponent implements OnInit {
  @Output() initializeLead = new EventEmitter();

  bookingForm: FormGroup;
  edit = false;
  userDetails: UserConfig;

  pickdroptimings = [
    "09 AM To 12 PM",
    "12 PM To 03 PM",
    "03 PM To 06 PM",
    "06 PM To 09 PM"
  ];

  isPickupReq = [{ value: "Yes", id: 1 }, { value: "No", id: 0 }];

  @Input("data") data: bookingData;
  @Input("garage") garage: bookedGarageData;
  @Input("lead") lead: leadData;
  @Input("status") status: any;
  @Input("customer") customer: customerData;

  constructor(
    private fb: FormBuilder,
    private dyComService: DynamicComponentService,
    private globalService: GlobalService,
    private leadService: LeadService,
    private masterService: MasterService
  ) { }

  ngOnInit() {
    this.userDetails = this.globalService.getUserCredential()['userData'];
    this.buildForm();
  }

  buildForm() {
    this.bookingForm = this.fb.group({
      BookingCreatedOn: [null],
      // BookingPickupDate: [this.leadService.getFormattedDate(this.data.BookingCreatedOn)],
      BookingPickupDate: [
        new Date(this.data.BookingPickupDate).toISOString().substring(0, 10)
      ],
      BookingPickupTime: [this.data.BookingPickupTime],
      ServiceDate: this.data.ServiceOn,
      TotalCost: this.data.TotalCost,
      Address: [this.customer.CustomerAddress],
      IsPickupRequied: [this.data.IsPickupRequied]
    });
    console.log(this.data);
  }

  openPickupModal() {
    const options = {
      booking: this.data,
      lead: this.lead
    };
    this.dyComService.loadComponent(PickupContactComponent, options).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.error(err);
      }
    );
  }

  saveBookingData() {
    let pickupDate = null;
    let serviceDate = null;
    let totalCost = null;
    if (
      this.bookingForm.value.ServiceDate != null &&
      this.bookingForm.value.TotalCost != null
    ) {
      serviceDate = new Date(
        this.bookingForm.value.ServiceDate
      ).toLocaleDateString("en-US");
      totalCost = this.bookingForm.value.TotalCost;
    }
    // pickupDate = this.bookingForm.value.BookingPickupDate.day + "/" + this.bookingForm.value.BookingPickupDate.month + "/" +
    //   this.bookingForm.value.BookingPickupDate.year

    const leadBookingDetails = {
      Address: this.bookingForm.value.Address,
      GarageId: this.garage.GarageId,
      LeadId: this.lead.LeadId,
      MobileNo: this.customer.CustomerMobileNo,
      PickupDate: new Date(
        this.bookingForm.value.BookingPickupDate
      ).toLocaleDateString("en-US"),
      PickupTime: this.bookingForm.value.BookingPickupTime,
      TotalCost: totalCost,
      ServiceDate: serviceDate,
      IsPickupRequied: this.bookingForm.value.IsPickupRequied,
      UpdatedBy: this.userDetails.UserId,
      UpdatedByType: "u"
    };

    this.leadService.updateLeadBookingDetails(leadBookingDetails).subscribe(
      res => {
        console.log(res);
        this.globalService.successResponse(res.message);
        this.edit = false;
        if (this.data.ServiceOn && this.data.TotalCost) {
          this.checkSaleVerification();
        }
        this.initializeLead.emit(true);
        //this.getLeadDetail();
        // this.leadService.getLeadDetail(this.lead.LeadId);
      },
      err => {
        console.error(err);
      }
    );
  }

  sendMsgCustomer() {
    if (this.bookingForm.value.TotalCost) {
      const message = {
        MobileNo: this.customer.CustomerMobileNo,
        Target: "c",
        CountryCode: 91,
        LeadId: this.lead.LeadId,
        SMSType: null,
        Message: null
      };

      this.masterService.sendSMS(message).subscribe(
        res => {
          console.log(res);
          this.globalService.successResponse(res.message);
        },
        err => {
          console.error(err);
        }
      );
    }
  }

  async checkSaleVerification() {
    if (this.data.ServiceOn && this.data.TotalCost) {
      let code = btoa(
        (this.lead.LeadId * 2 + this.customer.CustomerId * 2).toString()
      );
      let Message = `Dear Customer, please click https://qfcwz.in/bookigDetails/${code} to confirm you car servicing from ${
        this.garage.GarageName
        } at a price of INR ${this.data.TotalCost} by https://quickFixcars.com`;
      let data = {
        LeadId: this.lead.LeadId,
        CustomerId: this.customer.CustomerId,
        MobileNo: this.customer.CustomerMobileNo,
        EmailId: this.customer.CustomerEmail,
        Body: Message,
        VerificationCode: "",
        Type: 1,
        VerificationType: 1,
        TotalCost: this.data.TotalCost,
        GarageName: this.garage.GarageName
      };
      const res = await this.saveSaleVerificationDetails(data);
      if (res > 0) {
        this.globalService.successResponse(
          "Verification Message Sent Successfully"
        );
        //this.sendCommunication(message, this.commId);
      }
    } else {
      this.globalService.successResponse(
        "Please Confirm and Fill the Service Date and Service Cost"
      );
    }
  }

  saveSaleVerificationDetails(data) {
    return new Promise((resolve, reject) => {
      this.leadService.saveSaleVerificationDetails(data).subscribe(
        res => {
          console.log(res);
          return resolve(res);
        },
        err => {
          console.error(err);
          return reject(err);
        }
      );
    });
  }
}

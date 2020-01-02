import { UserDetails } from './../../user/user';
import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';

import { LeadService } from '../lead.service';
import { GlobalService, UserConfig } from '../../services/global.service';


@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.css']
})
export class BookingModalComponent implements OnInit {

  @Input() notifier$: Subject<any>;
  @Input() data: any;

  bookingForm: FormGroup;

  userDetails: UserConfig;

  pickdroptimings = [
    "09 AM To 12 PM",
    "12 PM To 03 PM",
    "03 PM To 06 PM",
    "06 PM To 09 PM"
  ];


  constructor(private fb: FormBuilder,
    private leadService: LeadService,
    private globalService: GlobalService) { }

  ngOnInit() {
    this.userDetails = this.globalService.getUserCredential()['userData'];
    this.buildForm();
  }

  cancel() {
    this.notifier$.next(false);
    this.notifier$.complete();
  }

  close() {
    this.cancel();
  }

  buildForm() {
    this.bookingForm = this.fb.group({
      Address: [''],
      CustomerName: [''],
      Email: [''],
      GarageId: [this.data.garage.GarageId],
      LeadId: [this.data.lead.LeadId],
      MobileNo: this.data.customer.CustomerMobileNo,
      PickupDate: [''],
      PickupTime: [''],
      CreatedByType: ['u'],
      CreatedBy: [this.userDetails.UserId],
    });
  }

  saveBooking() {
    const date = new Date(this.bookingForm.value.PickupDate);
    this.bookingForm.controls['PickupDate'].setValue((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear());

    this.leadService.updateLeadBookingDetails(this.bookingForm.value).subscribe(
      (res) => {
        console.log(res);
        this.globalService.successResponse(res.message);
        this.notifier$.next(true);
      },
      (err) => {
        console.error(err);
      }
    )
  }



}

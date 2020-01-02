import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { LeadService } from '../lead.service';
import { GlobalService, UserConfig } from '../../services/global.service';

@Component({
  selector: 'app-pickup-contact',
  templateUrl: './pickup-contact.component.html',
  styleUrls: ['./pickup-contact.component.css']
})
export class PickupContactComponent implements OnInit {

  userDetails: UserConfig;
  @Input() notifier$: Subject<any>;
  @Input() data: any;
  pickupForm: FormGroup;
  pickupDetail: any = {};

  constructor(private fb: FormBuilder,
    private leadService: LeadService,
    private globalService: GlobalService) { }

  ngOnInit() {
    this.userDetails = this.globalService.getUserCredential()['userData'];
    this.buildForm();
    this.getPickupContactDetail();
  }

  buildForm() {
    this.pickupForm = this.fb.group({
      LeadId: [this.data.lead.LeadId],
      BookingDetailId: [this.data.booking.BookingDetailId],
      ContactPersonName: [''],
      ContactPersonMobileNo: [''],
      UserId: [this.userDetails.UserId],
    })
  }

  getPickupContactDetail() {
    this.leadService.getLeadPickupDetail(this.data.lead.LeadId).subscribe(
      (res) => {
        console.log(res);
        this.checkPickupDetail(res.data[0]);
      },
      (err) => {
        console.error(err);
      }
    )
  }

  savePickupDetail() {
    this.leadService.savePickupDetail(this.pickupForm.value).subscribe(
      (res) => {
        if (res.statusCode === 200) {
          this.leadService.pickupContactDetails['ContactPersonMobileNo'] = this.pickupForm.value.ContactPersonMobileNo;
          this.leadService.pickupContactDetails['ContactPersonName'] = this.pickupForm.value.ContactPersonName;
        }
        this.globalService.successResponse(res.message);
      },
      (err) => {
        console.error(err);
      }
    )
  }
  cancel() {
    this.notifier$.next(false);
    this.notifier$.complete();
  }

  close() {
    this.cancel();
  }

  checkPickupDetail(data) {
    if (data) {
      this.pickupForm.controls['ContactPersonName'].setValue(data.ContactPersonName);
      this.pickupForm.controls['ContactPersonMobileNo'].setValue(data.ContactPersonMobileNo);
    }
  }
}

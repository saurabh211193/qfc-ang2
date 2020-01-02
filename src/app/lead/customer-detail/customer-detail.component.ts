import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

import { customerData, leadData, Lead } from '../lead';

import { GlobalService, UserConfig } from '../../services/global.service';
import { LeadService } from '../lead.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {

  customerForm: FormGroup;
  edit = false;
  callDetails: any;
  userDetails: UserConfig;
  @Input('data') data: customerData;
  @Input('LeadData') LeadData: leadData;

  @Output() initializeLead = new EventEmitter();

  constructor(private fb: FormBuilder,
    private globalService: GlobalService,
    private leadService: LeadService) { }

  ngOnInit() {
    console.log(1234, this.data);
    this.userDetails = this.globalService.getUserCredential()['userData'];
    this.buildForm();
    this.callDetails = {
      mobileNo: this.data.CustomerMobileNo,
    }
  }

  buildForm() {
    this.customerForm = this.fb.group({
      CustomerName: [this.data.CustomerName],
      CustomerMobileNo: [this.data.CustomerMobileNo],
      CustomerEmail: [this.data.CustomerEmail || ''],
      CustomerAlternateMobileNo: [this.data.CustomerAlternateMobileNo],
      CustomerAddress: [this.data.CustomerAddress]
    });
  }

  saveCustomerDetail() {
    const customerDetails = {
      AlternateMobileNo: this.customerForm.value.CustomerAlternateMobileNo,
      CustomerName: this.customerForm.value.CustomerName,
      Email: this.customerForm.value.CustomerEmail,
      MobileNo: this.customerForm.value.CustomerMobileNo,
      Pincode: null,
      StateId: null
    };

    this.leadService.updateCustomerDetails(customerDetails).subscribe(
      (res) => {
        console.log(res);
        this.globalService.successResponse('Customer Updated');
        this.initializeLead.emit(true);
        this.edit = false;
      },
      (err) => {
        console.error(err);
      }
    )

  }

  editForm() {
    this.edit = true;
  }

  async dialerCall(mobileNo, context) {
    const callId = await this.saveLeadCallLog(mobileNo, context);

    let params = new HttpParams();
    params = params.set('phone', `645740${mobileNo}`)
      .set('leadid', this.LeadData.LeadId.toString())
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
      .set('leadid', this.LeadData.LeadId.toString())
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


}

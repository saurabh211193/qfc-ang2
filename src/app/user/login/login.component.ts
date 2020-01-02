import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { FormErrors, ValidationMessages, GlobalValidator } from '../../global-validator';

import { UserService } from '../user.service';
import { DynamicComponentService } from '../../shared/dynamic-component.service';
import { GlobalService, UserConfig } from '../../services/global.service';
import { MasterService } from '../../services/master.service';
import { AlertDialogComponent, AlertDialogOptionsI } from '../../shared/alert-dialog/alert-dialog.component';
import { LoginResponse } from '../user';
import browser from 'browser-detect';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  formErrors: FormErrors = {
    'LoginId': '',
    'Password': ''
  };
  validationMessages: ValidationMessages = {
    'LoginId': {
      'required': 'Login Id is required',
    },
    'Password': {
      'required': 'Password is required',
    }
  };
  userDetails: UserConfig;

  constructor(private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private dyComService: DynamicComponentService,
    private globalService: GlobalService,
    private masterService: MasterService) { }

  ngOnInit() {
    this.globalService.deleteUserCredential()
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.fb.group({
      LoginId: ['', Validators.compose([Validators.required])],
      Password: ['', Validators.compose([Validators.required])],
      IsAutoAllocation: [false]
    });

    this.loginForm.valueChanges.subscribe(data => {
      this.formErrors = GlobalValidator.validateForm(this.loginForm, this.validationMessages);
    });
  }

  login() {
    console.log(this.loginForm);
    if (this.loginForm.invalid) {
      this.formErrors = GlobalValidator.validateForm(this.loginForm, this.validationMessages, true);
      return;
    } else {
      const browserObj = browser();
      const loginData = {
        LoginId: this.loginForm.value.LoginId,
        Password: this.loginForm.value.Password
      };
      loginData['Source'] = browserObj.mobile ? 'mobile' : 'web';
      loginData['Browser'] = browserObj.name + '/' + browserObj.version;
      loginData['IP'] = this.globalService.privateIp;
      loginData['UserType'] = 'agent'; // ENUM: garage, customer, agent
      this.userService.login(loginData).subscribe(
        (res: LoginResponse) => {
          if (res.statusCode !== 200) {
            this.globalService.errorResponse(res.message);
          } else {
            this.userDetails = res.data['userData'];
            if (this.loginForm.value.IsAutoAllocation) this.leadAutoAllocation();
            this.globalService.setUserCredential(res.data);
            this.router.navigate([`/dashboard/lead/list/${btoa(this.userDetails.UserId.toString())}/1`]);
          }
        },
        (err) => {
          console.error(err);
        }
      )
    }
  }

  leadAutoAllocation() {
    let params = new HttpParams();
    params = params.set('emp_id', this.userDetails.EmployeeId)
      .set('queue_name', 'qfcinbound')
      .set('product_name', 'test');

    this.globalService.dialerLogin(params).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error(err);
      }
    )
  }
}


import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { GlobalValidator, ValidationMessages, FormErrors } from '../../global-validator';
import { GlobalService, UserConfig } from '../../services/global.service';

import { MasterService } from '../../services/master.service';
import { GarageService } from '../garage.service';

@Component({
  selector: 'app-agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.css']
})

export class AgreementsComponent implements OnInit {
  garageAgreeAccept: any;
  garageUsp: any;
  // garageProfile: any = {};
  isCommercialCreated: Boolean;
  isAgree: any;
  PartsDiscount: any;
  PartsDiscountType: any;
  LabourDiscount: any;
  LabourDiscountType: any;
  OverallDiscount: any;
  OverallDiscountType: any;
  PartsCommission: any;
  PartsCommissionType: any;
  LabourCommission: any;
  LabourCommissionType: any;
  OverallCommission: any;
  OverallCommissionType: any;
  RegularServiceGuaranteeType: any;
  RegularServiceGuarantee: any;
  MechanicalServiceGuaranteeType: any;
  MechanicalServiceGuarantee: any;
  isAccept: Boolean;
  gotUsp: Boolean = false;
  categoryMaster: any;
  subCategoryMaster: any;
  entityMaster: any;
  USPForm: any = {};
  isSubmitted: boolean = false;
  error: any;
  testerror: any;
  isError: boolean;
  uspRecords: any[];
  isUspFormError: boolean;
  // toggleEdit: any = 1;
  userId: any;
  userType: any;
  // isUspDisabled: any = false;
  @Input('garageProfile') garageProfile;
  @Output()
  uspUpdateEvent = new EventEmitter<string>();
  userDetails: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private masterService: MasterService,
    private garageService: GarageService,
    private globalService: GlobalService) {
  }

  ngOnInit() {
    console.log('GarageDetails', this.garageProfile);
    // this.garageProfile = this.globalService.getUserProfile();
    this.userDetails = this.globalService.getUserCredential()['userData'];
    // if (this.garageProfile['garageUserDetails'] && this.garageProfile['garageUserDetails']['GarageUserId']) {
    //   this.userType = this.garageProfile['garageUserDetails']['DesignationName'];
    //   this.userId = this.garageProfile['garageUserDetails']['GarageUserId'];
    // } else {
    //   this.userType = 'garage';
    //   this.userId = this.garageProfile['GarageId'];
    // }
    this.getEntityMaster();
    // this.getGarageUsp();
  }

  checkUspFormError() {
    const len = this.entityMaster.length;
    let isError = false;
    console.log(this.USPForm)
    for (let i = 0; i < len; i++) {
      if (parseInt(this.USPForm[this.entityMaster[i]['EntityId'] + '-value']) == NaN ||
        !this.USPForm[this.entityMaster[i]['EntityId'] + '-type'] ||
        this.USPForm[this.entityMaster[i]['EntityId'] + '-type'] == '') {
        this.USPForm[this.entityMaster[i]['EntityId'] + '-value-error'] = true;
        isError = true;
      } else {
        switch (this.USPForm[this.entityMaster[i]['EntityId'] + '-type']) {
          case 'p':
            if (this.USPForm[this.entityMaster[i]['EntityId'] + '-value'] < 0 ||
              this.USPForm[this.entityMaster[i]['EntityId'] + '-value'] > 100 ||
              !(/^\d+$/.test(this.USPForm[this.entityMaster[i]['EntityId'] + '-value']))) {
              this.USPForm[this.entityMaster[i]['EntityId'] + '-value-error'] = true;
              isError = true;
            } else {
              this.USPForm[this.entityMaster[i]['EntityId'] + '-value-error'] = false;
            }
            break;
          case 'rs':
          case 'kms':
            if (this.USPForm[this.entityMaster[i]['EntityId'] + '-value'] < 0 || !(/^\d+$/.test(this.USPForm[this.entityMaster[i]['EntityId'] + '-value']))) {
              this.USPForm[this.entityMaster[i]['EntityId'] + '-value-error'] = true;
              isError = true;
            } else {
              this.USPForm[this.entityMaster[i]['EntityId'] + '-value-error'] = false;
            }
            break;
          case 'months':
            if (this.USPForm[this.entityMaster[i]['EntityId'] + '-value'] < 0 ||
              this.USPForm[this.entityMaster[i]['EntityId'] + '-value'] > 12 ||
              !(/^\d+$/.test(this.USPForm[this.entityMaster[i]['EntityId'] + '-value']))) {
              this.USPForm[this.entityMaster[i]['EntityId'] + '-value-error'] = true;
              isError = true;
            } else {
              this.USPForm[this.entityMaster[i]['EntityId'] + '-value-error'] = false;
            }
            break;
        }
      }
    }
    return isError;
  }
  getEntityMaster() {
    this.masterService.entityMaster().subscribe(
      (res) => {
        console.log('entityMaster', res);
        this.entityMaster = res.data;
        this.getGarageUsp();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  // getCommAgreeAccept() {
  //   // const params = {
  //   //   _GarageId: this.garageProfile.GarageId,
  //   // };
  //   this.masterService.userProfile(this.garageProfile.GarageId).subscribe(
  //     (res) => {
  //       // console.log('getGarageAgreement', res);
  //       if (res['statusCode'] === 200) {
  //         this.garageAgreeAccept = res['data'];
  //         this.isAccept = this.garageAgreeAccept.IsAcceptUsp ? true : false;
  //         this.isAgree = this.garageAgreeAccept.IsAgreeCommercial ? true : false;
  //         // this.toggleEdit = this.garageAgreeAccept.IsAllowedUpdateUsp;
  //         // console.log('this.garageProfile.IsAllowedUpdateUsp', this.garageProfile.IsAllowedUpdateUsp)
  //         this.getGarageUsp();
  //       }
  //     },
  //     (err) => {
  //       console.error(err);
  //     }
  //   );
  // }

  // CommAgreeAcceptSave(forAccept) {
  //   const data = {
  //     _GarageId: this.garageProfile['GarageId'],
  //     _IsAgreeCommercial: this.isAgree ? 1 : 0,
  //     _IsAcceptUsp: this.isAccept ? 1 : 0,
  //     // _IsAllowedUpdateUsp: (this.toggleEdit && forAccept) ? 0 : this.toggleEdit,
  //     _UpdatedBy: this.userId,
  //   };
  //   if (forAccept || confirm('Do you agree to our commercial agreement')) {
  //     this.garageService.updateAgreeGarageAgreement(data).subscribe(
  //       (res) => {
  //         this.globalService.successResponse(res.message);
  //         this.getCommAgreeAccept();
  //       },
  //       (err) => {
  //         console.error(err);
  //       }
  //     );
  //   } else {
  //     this.isAgree = false;
  //   }
  // }

  insertGarageUsp() {
    this.isSubmitted = true;
    if (this.checkUspFormError()) {
      this.globalService.errorResponse('Please fill the form correctly.');
      return;
    }

    if (confirm('Do you want to submit form.')) {
      if (!this.gotUsp) {
        this.buildUspData();
        const data = {
          'uspRecords': this.uspRecords,
          'uspUpdates': {
            '_GarageId': this.garageProfile['GarageId'],
            '_UpdatedByType': 'u'
          }
        };
        this.garageService.insertManyGarageUsp(data).subscribe(
          (res) => {
            this.globalService.successResponse(res.message);
            this.getGarageUsp();
            this.uspUpdateSmsToGarage();
          },
          (err) => {
            console.error(err);
          }
        );
      } else {
        this.buildUspUpdateData();
        const data = {
          'uspRecords': this.uspRecords,
        };
        this.garageService.updateManyGarageUsp(data).subscribe(
          (res) => {
            this.globalService.successResponse(res.message);
            this.getGarageUsp();
            this.uspUpdateSmsToGarage();
          },
          (err) => {
            console.error(err);
          }
        );
      }
      // this.CommAgreeAcceptSave(1);
    }
  }

  buildUspData() {
    this.uspRecords = [];
    const len = this.entityMaster.length;
    for (let i = 0; i < len; i++) {
      const arr = [];
      // GarageId, EntityId, Value, Unit, CreatedBy, CreatedByType, IsLastActive
      arr.push(this.garageProfile.GarageId);
      arr.push(this.entityMaster[i].EntityId);
      arr.push(this.USPForm[this.entityMaster[i]['EntityId'] + '-value']);
      arr.push(this.USPForm[this.entityMaster[i]['EntityId'] + '-type']);
      arr.push(this.userDetails.UserId);
      arr.push('u');
      arr.push('1');
      this.uspRecords.push(arr);
    }
  }

  buildUspUpdateData() {
    this.uspRecords = [];
    const len = this.garageUsp.length;
    for (let i = 0; i < len; i++) {
      const obj = {};
      obj['_Id'] = this.garageUsp[i]['Id'];
      obj['_Value'] = this.USPForm[this.garageUsp[i]['EntityId'] + '-value'];
      obj['_Unit'] = this.USPForm[this.garageUsp[i]['EntityId'] + '-type'];
      obj['_UpdatedByType'] = 'agent';
      obj['_UpdatedBy'] = this.userDetails.UserId;
      this.uspRecords.push(obj);
    }
  }

  createUspForm() {
    const len = this.garageUsp.length;
    this.USPForm = {};
    for (let i = 0; i < len; i++) {
      this.USPForm[this.garageUsp[i]['EntityId'] + '-value'] = this.garageUsp[i].Value;
      this.USPForm[this.garageUsp[i]['EntityId'] + '-type'] = this.garageUsp[i].Unit;
    }
    if (len === this.entityMaster.length) {
      this.gotUsp = true;
    } else {
      this.gotUsp = false;
    }
    // this.isUspDisabledSetter();
  }

  // editForm() {
  //   this.toggleEdit = !this.toggleEdit;
  // }

  getGarageUsp() {
    this.garageService.getGarageUsp(this.garageProfile['GarageId']).subscribe(
      (res) => {
        console.log('get usp', res);
        this.garageUsp = res.data;
        // this.isAccept = false;
        if (this.garageUsp.length > 0) {
          // this.isAccept = true;
          this.createUspForm();
          // this.isUspDisabledSetter();

        }
      },
      (err) => {
        console.error(err);
      }
    )
  }

  // isUspDisabledSetter() {
  //   if ((!this.toggleEdit && !this.gotUsp) ||
  //     (this.toggleEdit && this.gotUsp) || (this.toggleEdit && !this.gotUsp)) {
  //     this.isUspDisabled = 0;
  //   }
  //   if (!this.toggleEdit && this.gotUsp) {
  //     this.isUspDisabled = 1;
  //   }
  // }

  // callToAction(comment) {
  //   const data = {
  //     GarageId: this.garageProfile.GarageId,
  //     Comments: comment,
  //     CommentSource: 'Garage-Panel',
  //     UserId: 124, // inner join GC to CRM USER in proc getGarageComments
  //   };
  //   this.masterService.saveComment(data).subscribe(
  //     (res) => {
  //       // console.log('getGarageComments', res);
  //       if (res.statusCode === 200) {
  //         this.globalService.successResponse('Thanks, Request to update USPs has been raised.');
  //       }

  //     }, (err) => {
  //       console.error(err);
  //     }
  //   )
  // }

  uspUpdateSmsToGarage() {
    this.uspUpdateEvent.emit('');
  }
}

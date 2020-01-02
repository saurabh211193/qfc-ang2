import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { GlobalValidator, ValidationMessages, FormErrors } from '../../global-validator';
import { GlobalService, UserConfig } from '../../services/global.service';

import { MasterService } from '../../services/master.service';
import { GarageService } from '../garage.service';

import { Cities, CityResponse, Make } from '../garage';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  garageId: string;
  garageDetail: any;
  garageForm: FormGroup;
  userDetails: UserConfig;
  cities: Cities[];
  makes: Make[];
  selectedMake: any[] = [];
  selectedMakeString: string = "";
  comments: any[];
  services: any[] = [];
  latitude: any;
  longitude: any;
  selectedServices: any[] = [];
  selectedOtherServices: any[] = [];
  pickDropTimings: any[] = [];
  checkedBasicService: string = '';
  checkedStandardService: string = '';
  checkedPremiumService: string = '';
  checkedAddonService: any[] = [];
  addOnServiceChecked: any;
  garageStatusMaster: any;
  garageStatus: any;

  uspTypeMaster: any;
  uspMaster: any;
  // USPIsActive: any = [];
  discount = [];
  discountType = [];
  garageUsp: any;
  editUsp = true;
  category = '';
  isDisabled = true;
  termsNCondition: any;
  insurerMaster: any;
  selectedInsurer: any;
  franchiseMaster: any;
  selectedfranchise: any;
  franchiseObj: any = '';
  franchiseObjId: any = 0;
  garageType: any = '';

  garageTypeObj = {
    IsAgree: 0,
    IsAgreeCommercial: 0,
    IsAcceptUsp: 0,
  }


  // pickDropTime = [
  //   "09:00 AM - 12:00 PM",
  //   "12:00 PM - 03:00 PM",
  //   "03:00 PM - 06:00 PM",
  //   "06:00 PM - 09:00 PM"
  // ];
  days = [
    "All days open",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  multiselect_dropdown = {
    singleSelection: false,
    idField: 'MakeId',
    textField: 'MakeName',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  multiselect_dropdown_insurer = {
    singleSelection: false,
    idField: 'OldSupplierId',
    textField: 'SupplierName',
    allowSearchFilter: true
  };


  private formErrors: FormErrors = {
    Name: '',
    Locality: '',
    Address: '',
    State: '',
    City: '',
    Pincode: '',
    LandLineNo: '',
    ContactPersonName: '',
    ContactPersonMobileNo: '',
    LoginMobileNo: '',
    // AlternateContactPersonName: '',
    // AlternateNo: '',
    EmailId: '',
    PickDrop: '',
    PickDropTimings: ''
  };

  private validationMessages: ValidationMessages = {
    Name: {
      required: 'Garage Name is required',
    },
    Locality: {
      required: 'Locality is required',
    },
    Address: {
      required: 'Address is required',
    },
    State: {
      required: 'State is required',
    },
    City: {
      required: 'City is required',
    },
    Pincode: {
      required: 'Pincode is required',
    },
    LandLineNo: {
      required: 'LandLineNo is required',
    },
    ContactPersonName: {
      required: 'ContactPersonName is required',
    },
    ContactPersonMobileNo: {
      required: 'ContactPersonMobileNo is required',
    },
    // AlternateContactPersonName: {
    //   required: 'AlternateContactPersonName is required',
    // },
    // AlternateNo: {
    //   required: 'AlternateNo is required',
    // },
    LoginMobileNo: {
      required: 'Login Mobile No is required',
      pattern: 'Login Mobile No is Invalid',
    },
    EmailId: {
      required: 'EmailId is required',
    },
    PickDrop: {
      required: 'PickDrop is required',
    },
    PickDropTimings: {
      required: 'PickDropTimings is required',
    },
    DaysOff: {
      required: 'DaysOff is required',
    },
    PickUpRadius: {
      required: 'PickUpRadius is required',
      max: 'Radius should be less than 100 km',
      min: 'Enter positive value'
    },
    IsTowProvided: {
      required: 'IsTowProvided is required',
    }
  };
  sentOtp: any;
  confirmedOtp = false;
  garageDocDetails: any;
  garageDocDetailsCatStatus: any;
  profileDocs: any;
  docStatusMaster: any;
  docStatusArr = [];
  docCatStatusArr = [];
  garageTypeValid: boolean = false;
  pickupTimingMaster: any;
  garagePickupTimings: any;
  claimStatusId: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private masterService: MasterService,
    private garageService: GarageService,
    private globalService: GlobalService) {
    this.route.params.subscribe(params => {
      this.garageId = atob(params.garageid);
      this.getGarageDetail();
    });

  }

  ngOnInit() {
    this.userDetails = this.globalService.getUserCredential()['userData'];
    console.log(this.userDetails);
    this.getPickupTimingMaster();
    this.getAllCities();
    this.getAllServices();
    this.getGarageStatusMaster();
    this.getUSPMaster();
    this.getGarageUsp();
    this.getInsurerMaster();
    this.getGarageInsurerMapping();
    this.getFranchiseMaster();
    this.getGarageDoc();
    this.getDocStatusMaster();
  }

  buildForm() {
    this.garageForm = this.fb.group({
      Name: [this.garageDetail.Name, Validators.compose([Validators.required])],
      Locality: [this.garageDetail.Locality, Validators.compose([Validators.required])],
      Address: [this.garageDetail.Address, Validators.compose([Validators.required])],
      State: [this.garageDetail.State, Validators.compose([Validators.required])],
      CityId: [this.garageDetail.CityId, Validators.compose([])],
      Pincode: [this.garageDetail.Pincode, Validators.compose([Validators.required])],
      LoginMobileNo: [this.garageDetail.LoginMobileNo ? this.garageDetail.LoginMobileNo : '', Validators.compose([Validators.required, Validators.pattern(GlobalValidator.PHONE_REGEX)])],
      LandLineNo: [this.garageDetail.LandLineNo, Validators.compose([Validators.required])],
      ContactPersonName: [this.garageDetail.ContactPersonName, Validators.compose([Validators.required])],
      ContactPersonMobileNo: [this.garageDetail.ContactPersonMobileNo, Validators.compose([Validators.required])],
      AlternateContactPersonName: [this.garageDetail.AlternateContactPersonName],
      AlternateNo: [this.garageDetail.AlternateNo || null],
      EmailId: [this.garageDetail.EmailId, Validators.compose([Validators.required])],
      PickDrop: [this.garageDetail.PickDrop, Validators.compose([Validators.required])],
      // PickDropTimings: [this.garageDetail.PickDropTimings || ''],
      DaysOff: [this.garageDetail.DaysOff, Validators.compose([Validators.required])],
      IsPreferred: [this.garageDetail.IsPreferred ? '1' : '0'],
      StatusId: [this.garageStatus && this.garageStatus.StatusId ? this.garageStatus.StatusId : ''],
      PickUpRadius: [this.garageDetail.PickUpRadius, Validators.compose([Validators.min(0), Validators.max(99)])],
      IsTowProvided: [this.garageDetail.IsTowProvided == 1 ? '1' : this.garageDetail.IsTowProvided == 0 ? '0' : null, Validators.compose([])],
      // IsAllowedUpdateUsp: [this.garageDetail.IsAllowedUpdateUsp ? '1' : '0', Validators.compose([])],
    })

    this.garageForm.valueChanges.subscribe(data => {
      this.formErrors = GlobalValidator.validateForm(this.garageForm, this.validationMessages);
    });

  }

  getAllServices() {
    this.masterService.getServiceMaster().subscribe(
      (res) => {
        this.services = res.data;
        // console.log(12312321, this.services);
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getAllCities() {
    this.masterService.getAllCities().subscribe(
      (res: CityResponse) => {
        this.cities = res.data;
        // console.log(this.cities)
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getPickupTimingMaster() {
    this.masterService.getPickupTimingMaster().subscribe(
      (res) => {
        this.pickupTimingMaster = res.data;
        console.log('pickupTimingMaster', this.pickupTimingMaster)
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getAllMake() {
    return new Promise((resolve, reject) => {
      this.masterService.getAllMake().subscribe(
        (res: any) => {
          this.makes = res.data;
          return resolve(res.data);
        },
        (err) => {
          return reject(err);
        }
      )
    });
  }

  getGarageDetail() {
    this.garageService.getGarageDetail(this.garageId).subscribe(
      (res) => {
        this.garageDetail = res.data;
        // console.log('this.garageDetail', this.garageDetail);
        this.latitude = this.garageDetail.Latitude;
        this.longitude = this.garageDetail.Longitude;
        // if (this.garageDetail.PickDropTimings) {
        //   // this.pickDropTimings = this.garageDetail.PickDropTimings.toUpperCase() == "NULL" ? this.pickDropTimings : this.garageDetail.PickDropTimings.split(',');
        // }
        if (this.garageDetail.PickUpTimings) {
          this.garagePickupTimings = this.garageDetail.PickUpTimings;
          for (let i = 0; i < this.garagePickupTimings.length; i++) {
            if (this.garagePickupTimings[i].PickUpTime && this.garagePickupTimings[i].IsActive) {
              this.pickDropTimings.push(this.garagePickupTimings[i].PickUpTime);
            }
          }
        }
        this.franchiseObj = this.garageDetail.FranchiseName || '';

        if (this.garageDetail.IsAgree) {
          this.garageType = '2';
        } else if (this.garageDetail.IsAgreeCommercial && this.garageDetail.IsAcceptUsp) {
          this.garageType = '1'
        } else {
          this.garageType = '3';
        }
        // this.buildForm();
        this.getGarageStatus();
        this.getSelectedMake(res.data.Make);
        this.getGarageComments();
        this.checkServiceBox(this.garageDetail.services);
        // console.log('garageDetail:', this.garageDetail)
      },
      (err) => {
        console.error(err);
      }
    )
  }

  checkServiceBox(services) {
    let basic = [9, 10, 11, 12, 13, 14, 15];
    let standard = [16, 17, 40, 41, 42, 43, 44, 45];
    let premium = [18, 19, 20, 21, 22, 46, 47, 48, 49, 50, 51, 52];
    let addOn = [39, 38, 37, 1, 4, 5, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
    services.map((service) => {
      this.checkedAddonService.push(service.ServiceId)
      return;
    });
    let foundBasic = basic.some(r => this.checkedAddonService.includes(r));
    let foundStandard = standard.some(r => this.checkedAddonService.includes(r));
    let foundPremium = premium.some(r => this.checkedAddonService.includes(r));
    if (foundBasic == true) {
      this.checkedBasicService = '1'
    }
    if (foundStandard == true) {
      this.checkedStandardService = '2'
    }
    if (foundPremium == true) {
      this.checkedPremiumService = '3'
    }
  }

  checkPickupTimeCheckBox(time) {
    const len = this.garagePickupTimings.length;
    for (let i = 0; i < len; i++) {
      if (this.garagePickupTimings[i].PickUpTimeId === time.PickUpTimeId && this.garagePickupTimings[i].IsActive) {
        return true;
      }
    }
  }

  getGarageComments() {
    this.garageService.getGarageComments(this.garageId).subscribe(
      (res) => {
        console.log(res);
        this.comments = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  async getSelectedMake(make) {
    console.log('make:', make);
    let a = make.split(',');
    const res = await this.getAllMake();
    console.log('continue', res)

    // this.selectedMake = this.makes.filter((Make) => {
    //   return Make.MakeName.toUpperCase() === make.toUpperCase()
    // })
    // console.log('selected make:', this.selectedMake);
    let b = []
    a.map((item) => {
      this.makes.map((Make) => {
        if (Make.MakeName.toUpperCase() == item.toUpperCase()) {
          b.push(Make);
        }
        return;
      })
      return;
    })

    this.selectedMake = b

    console.log('seleced:', this.selectedMake);
  }

  changePickDropTiming(value) {
    let pos = this.pickDropTimings.indexOf(value);
    pos == -1 ? this.pickDropTimings.push(value) : this.pickDropTimings.splice(pos, 1)
  }

  SavePickDropTiming() {
    let len = this.pickupTimingMaster.length;

    for (let i = 0; i < len; i++) {
      const data = {
        _PickupTimeId: this.pickupTimingMaster[i].PickUpTimeId,
        _GarageId: this.garageId,
        _IsActive: 0,
      }
      if (this.pickDropTimings.indexOf(this.pickupTimingMaster[i].PickUpTime) > -1) {
        data._IsActive = 1;
      }
      this.garageService.updateGaragePickupTiming(data).subscribe(
        (res) => {
          this.globalService.successResponse(res.message);
        },
        (err) => {
          console.error(err)
        }
      );
    }
  }

  sendConfirmationMsg(type) {
    let url = this.viewGarage(this.garageId);

    switch (type) {
      case "sms": {
        const opts = {
          CountryCode: 91,
          Message: `Dear Customer, Click on ${url} to verify your garage details.`,
          MobileNo: this.garageForm.value.ContactPersonMobileNo,
          OTP: null,
          Response: null,
          SMSType: null,
          OTPFor: 'garage'
        };
        this.sendSms(opts);
        break;
      }
      case "email": {
        const options = {
          EmailId: this.garageForm.value.EmailId,
          // Link: `http://qfcbz.in/partner/${btoa(this.garageId)}`
          Link: `${url}`
        };
        this.masterService.sendEmail(options).subscribe(
          (res) => {
            console.log(res);
            this.globalService.successResponse(res.message);
          },
          (err) => {
            console.error(err);
          }
        )
        break;
      }
      default: {
        break;
      }
    }
  }

  async dialerCall(mobileNo, context) {
    const callId = await this.saveGarageCallLog(mobileNo, context);

    let params = new HttpParams();
    params = params.set('phone', `645740${mobileNo}`)
      .set('leadid', this.garageId)
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

  saveGarageCallLog(mobileNo, context) {
    let params = new HttpParams();
    params = params.set('callid', '')
      .set('garageid', this.garageId)
      .set('mobileno', mobileNo)
      .set('userid', this.userDetails.UserId.toString())
      .set('context', context)
      .set('calldate', '')
      .set('calltype', 'OB')
      .set('duration', '')
      .set('talktime', '')
      .set('status', '')
      .set('disposition', '');

    return new Promise((resolve, reject) => {
      this.garageService.saveGarageCallLog(params).subscribe(
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

  saveGarageDetail() {
    console.log(this.garageForm.value);
    let a = [];
    this.selectedMake.map((item) => {
      a.push(item.MakeName)
    });
    this.selectedMakeString = a.toString();
    if (this.garageForm.invalid) {
      this.formErrors = GlobalValidator.validateForm(this.garageForm, this.validationMessages, true);
      return;
    } else {
      if (this.garageForm.value.CityId) {
        for (let i = 0; i < this.cities.length; i++) {
          if (this.cities[i]['CityId'] == this.garageForm.value.CityId) {
            this.garageForm.value['City'] = this.cities[i].Name;
          }
        }
      }
      let body = {
        data: {
          GarageId: parseInt(this.garageId),
          Address: this.garageForm.value.Address,
          AlternateContactPersonName: this.garageForm.value.AlternateContactPersonName,
          AlternateNo: this.garageForm.value.AlternateNo,
          CityId: this.garageForm.value.CityId,
          City: this.garageForm.value.City,
          LoginMobileNo: this.garageForm.value.LoginMobileNo ? this.garageForm.value.LoginMobileNo : this.garageDetail.LoginMobileNo,
          ContactPersonMobileNo: this.garageForm.value.ContactPersonMobileNo,
          ContactPersonName: this.garageForm.value.ContactPersonName,
          DaysOff: this.garageForm.value.DaysOff,
          EmailId: this.garageForm.value.EmailId,
          GarageType: this.garageDetail.GarageType,

          LandLineNo: this.garageForm.value.LandLineNo,
          Latitude: this.latitude,
          Locality: this.garageForm.value.Locality,
          // LoginMobileNo: this.garageDetail.LoginMobileNo,
          Longitude: this.longitude,
          Make: this.selectedMakeString,
          Name: this.garageForm.value.Name,
          PickDrop: this.garageForm.value.PickDrop,
          PickDropTimings: this.pickDropTimings.toString(),
          Pincode: this.garageForm.value.Pincode,
          State: this.garageForm.value.State,
          VirtualNo: this.garageDetail.VirtualNo,
          WorkingHours: this.garageDetail.WorkingHours,
          services: this.checkedAddonService,
          IsPreferred: this.garageForm.value.IsPreferred,
          PickUpRadius: this.garageForm.value.PickUpRadius,
          IsTowProvided: this.garageForm.value.IsTowProvided,
          // IsAllowedUpdateUsp: this.garageForm.value.IsAllowedUpdateUsp,
          FranchiseId: null,
          FranchiseName: this.franchiseObj,
          IsAgree: this.garageTypeObj.IsAgree,
          IsAgreeCommercial: this.garageTypeObj.IsAgreeCommercial,
          IsAcceptUsp: this.garageTypeObj.IsAcceptUsp,
        },
        message: "Garage Updated",
        statusCode: 200
      }


      console.log('body:', body);
      this.garageService.updateGarageDetail(this.garageId, body).subscribe(
        (res) => {
          this.globalService.successResponse(res.message);
          if (res.statusCode === 200) {
            // this.sendSmsToGarage();
            this.updateGarageStatus();
          }
        },
        (err) => {
          console.error(err)
        }
      );
    }
  }

  sendSmsToGarage() {
    let opts = {
      MobileNo: this.garageForm.value.ContactPersonMobileNo,
      Message: `Dear ${this.garageForm.value.Name || 'Customer'}, We have updated your USP on your request. Please login and check.`,
    };
    this.sendSms(opts); // 1
    opts.MobileNo = this.garageForm.value.LoginMobileNo;
    this.sendSms(opts); // 2
    opts.MobileNo = this.garageForm.value.AlternateNo;
    this.sendSms(opts); // 3
  }

  saveComment(commentData) {
    const data = {
      GarageId: this.garageId,
      Comments: commentData.Comments,
      CommentSource: commentData.CommentSource,
      CommentType: commentData.CommentType,
      UserId: commentData.UserId
    };
    this.garageService.saveComment(data).subscribe(
      (res) => {
        console.log(res);
        this.getGarageComments();
      }, (err) => {
        console.error(err);
      }
    )
  }

  mapInit() {
    console.log(document.getElementById('garageAddress'))
    const input = <HTMLInputElement>document.getElementById('garageAddress');
    const autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', (data) => {
      console.log(autocomplete.getPlace().geometry.location.lat());
      console.log(autocomplete.getPlace().geometry.location.lng())
      this.garageForm.controls['Address'].setValue(autocomplete.getPlace().formatted_address);
      this.latitude = autocomplete.getPlace().geometry.location.lat();
      this.longitude = autocomplete.getPlace().geometry.location.lng();
    });
  }

  addServices(serviceArray) {
    let pos, pos2;
    serviceArray.map((item) => {
      pos = this.checkedAddonService.indexOf(item.ServiceId);
      pos == -1 ? this.checkedAddonService.push(item.ServiceId) : this.checkedAddonService.splice(pos, 1)
      return;
    })
  }

  addOtherServices(id) {
    let pos = this.checkedAddonService.indexOf(id);
    pos == -1 ? this.checkedAddonService.push(id) : this.checkedAddonService.splice(pos, 1);
  }

  getItems(items) {
    this.selectedMake = items;
  }

  getGarageStatusMaster() {
    this.garageService.getGarageStatusMaster().subscribe(
      (res) => {
        this.garageStatusMaster = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  updateGarageStatus() {

    if (!this.garageForm.value.StatusId) return;
    const claimStatusId = this.insertClaimGarage();
    console.log(1212121, claimStatusId);
    const data = {
      GarageId: this.garageId,
      StatusId: this.garageForm.value.StatusId,
      UserId: this.userDetails.UserId,
    };

    this.garageService.updateGarageStatus(data).subscribe(
      (res) => {
        console.log(res);
        this.getGarageDetail();
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getGarageStatus() {
    this.garageService.getGarageStatus(this.garageId).subscribe(
      (res) => {
        this.garageStatus = res.data;
        this.buildForm();
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getUSPMaster() {
    this.masterService.getUSP().subscribe(
      (res) => {
        this.uspTypeMaster = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  updateUspMaster(event) {
    if (!event.target.value) {
      this.uspMaster = [];
      return;
    }
    const data = this.uspTypeMaster.filter(usp => {
      return usp.UspTypeName == event.target.value;
    });
    this.uspMaster = data[0].Usp;
  }

  insertGarageUsp(index, usp) {
    if ((this.discountType[index] == 'p' && (this.discount[index] < 0 || this.discount[index] > 100))) {
      this.globalService.errorResponse('Discount range invalid');
      return;
    }

    if ((this.discountType[index] == 'r' && this.discount[index] < 0)) {
      this.globalService.errorResponse('Discount range invalid');
      return;
    }

    const data = {
      GarageId: this.garageId,
      USPId: usp.Id,
      Discount: this.discount[index],
      DiscountType: this.discountType[index],
      ActionBy: this.userDetails.UserId,
      ActionByType: 'u',
    };

    this.garageService.insertGarageUsp(data).subscribe(
      (res) => {
        console.log(res);
        this.globalService.successResponse(res.message);
        this.getGarageUsp();
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getGarageUsp() {
    this.garageService.getGarageUsp(this.garageId).subscribe(
      (res) => {
        console.log(res);
        this.garageUsp = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  addEditUsp() {
    this.editUsp = !this.editUsp;
    if (!this.editUsp) this.getGarageUsp();
  }

  open() {
    window.open('http://qfc.s3.ap-south-1.amazonaws.com/95209233-a5c0-48c0-bd07-41245218bf41-term%26conditions.pdf');

  }
  getInsurerMaster() {
    this.masterService.getInsurer().subscribe(
      (res) => {
        this.insurerMaster = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }
  getInsurerItems(items) {
    // console.log(items);
    this.selectedInsurer = items;
  }
  insertGarageInsurerMapping() {
    if (this.garageForm.invalid) {
      this.formErrors = GlobalValidator.validateForm(this.garageForm, this.validationMessages, true);
      return;
    } else {
      const insurerIds = [];
      this.selectedInsurer.map(insurer => {
        insurerIds.push(insurer.OldSupplierId);
        return insurerIds;
      });
      const data = {
        GarageId: this.garageId,
        InsurerId: insurerIds,
        TieUpType: 1,
        CreatedBy: this.garageId,
      };
      this.garageService.insertGarageInsurerMapping(data).subscribe(
        (res) => {
        },
        (err) => {
          console.error(err);
        }
      )
    }
  }
  submit() {
    this.saveGarageDetail();
    this.insertGarageInsurerMapping();
  }
  getGarageInsurerMapping() {
    const params = {
      garageid: this.garageId,
      tieuptype: 1
    };
    this.garageService.getGarageInsurerMapping(params).subscribe(
      (res) => {
        this.selectedInsurer = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }
  getFranchiseMaster() {
    this.masterService.getFranchise().subscribe(
      (res) => {
        console.log(res);
        this.franchiseMaster = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  viewGarage(garageId) {
    let token = this.globalService.getUserCredential()['Token'];
    let subdomain = 'qapartner'
    // console.log('this.this.globalService.getUserCredential()', this.globalService.getUserCredential());
    // console.log('this.garageId', garageId);
    // console.log('this.environment.domain', environment.domain);
    if (['127.0.0.1:3001', 'qaapi.quickfixcars.com'].indexOf(environment.domain) > -1) {
      subdomain = 'qapartner';
    } else {
      subdomain = 'partner';
    }
    console.log(`https://${subdomain}.quickfixcars.com/user/agent-login/${token}/${this.userDetails.UserId}/${garageId}/1`);
    return `https://${subdomain}.quickfixcars.com/user/agent-login/${token}/${this.userDetails.UserId}/${garageId}/1`;
    // window.open(`https://${subdomain}.quickfixcars.com/user/agent-login/${token}/3/25`);
  }

  async getGarageDoc() {
    const garageDocMaster = await this.getDocMaster();
    const garageDocCatStatus = await this.getGarageDocCatStatus();
    this.getGarageDocDetails();
  }

  getGarageDocDetails() {
    const data = {
      _GarageId: this.garageId,
      _DocTypeId: 3,
    };

    this.garageService.getGarageDocs(data).subscribe(
      (res) => {
        console.log(res);
        this.garageDocDetails = res.data;
        this.garageDocDetails.map(garageDoc => {
          this.garageDocDetailsCatStatus.map(docCatStatus => {
            if (garageDoc.DocId == docCatStatus.DocId) {
              garageDoc.CatStatusId = docCatStatus.CatStatusId;
              garageDoc.CatStatusName = docCatStatus.StatusName;
            }
          })
        })
        console.log(this.garageDocDetails)
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getGarageDocCatStatus() {
    const data = {
      _GarageId: this.garageId,
    };

    return new Promise((resolve, reject) => {
      this.garageService.getGarageDocsCatStatus(data).subscribe(
        (res) => {
          this.garageDocDetailsCatStatus = res.data;
          return resolve(res.data);
        },
        (err) => {
          console.error(err);
          return reject(err);
        }
      )
    })


  }

  getDocMaster() {
    return new Promise((resolve, reject) => {
      this.masterService.getDocMaster().subscribe(
        (res) => {

          this.profileDocs = res.data[2].Doc;
          return resolve(res);
        },
        (err) => {
          console.error(err);
          return reject(err);
        }
      )
    })
  }


  getDocStatusMaster() {
    this.masterService.getDocStatus().subscribe(
      (res) => {
        this.docStatusMaster = res.data;

      },
      (err) => {
        console.error(err);

      }
    )
  }

  // changeDocStatus1(index) {

  //   const docDetail = this.garageDocDetails[index];
  //   const docStatusArr = this.docStatusArr;
  //   const docCatStatusArr = this.docCatStatusArr[0];

  //   for (var i in docStatusArr) {
  //     console.log(docStatusArr[i])


  //   }


  //   if (this.docCatStatusArr.length) {
  //     const catStatusData = {
  //       _CatStatusId: docCatStatusArr._StatusId,
  //       _GarageId: this.garageId,
  //       _DocId: docCatStatusArr._DocId,
  //     };

  //     this.insertGarageDocCatStatus(catStatusData);
  //   }


  // }

  insertGarageDocStatus(data) {
    this.garageService.insertGarageDocStatus(data).subscribe(
      (res) => {
        alert('Also select parent status for document');


      },
      (err) => {
        console.error(err);
      }
    )
  }

  insertGarageDocCatStatus(doc) {


    this.garageService.insertGarageDocCatStatus(doc).subscribe(
      (res) => {
        console.log(res)
        alert('Success');
        this.getGarageDoc();
      },
      (err) => {
        console.error(err);
      }
    )
  }

  changeDocStatus(file, index, docIndex, docFile) {

    const docStatusDetail = this.docStatusArr[index];
    const docDetail = this.garageDocDetails[docIndex];


    const statusData = {
      _GarageDocDetailId: docFile.Id,
      _StatusId: docStatusDetail.StatusId,
      _CreatedBy: this.garageId,
      _CreatedByType: 'g',
      _GarageId: this.garageId,
      _DocId: docDetail.DocId,
    };

    this.insertGarageDocStatus(statusData);

  }

  changeDocCatStatus(index, catStatus) {
    const docDetail = this.garageDocDetails[index];
    const statusCondition = this.checkStatusCondition(docDetail, catStatus);
    if (!statusCondition) return;
    const catData = {
      _CatStatusId: catStatus.StatusId,
      _GarageId: this.garageId,
      _DocId: docDetail.DocId,
    };

    this.insertGarageDocCatStatus(catData);
  }

  checkStatusCondition(docDetail, catStatus) {
    const file = docDetail.file;
    let approvedStatus = 0, rejectedStatus = 0, oneApproved = false, allApproved = false, allRejected = false;
    file.filter(fileData => {
      if (fileData.Url) {
        if (fileData.StatusId == 4) {
          approvedStatus += 1;
          oneApproved = true;
        }
        else if (fileData.StatusId == 5)
          rejectedStatus += 1;
      }
    });

    if (approvedStatus == file.length - 1) {
      allApproved = true;
    } else if (rejectedStatus == file.length - 1) {
      allRejected = true;
    }

    if (allApproved && catStatus.StatusId == 5) {
      alert('Cant Reject parent status');
      return false;
    } else if (allRejected && catStatus.StatusId == 4) {
      alert('Cant Approve parent status');
      return false;
    }
    return true;
  }

  sendSms(opt) {
    const options = {
      CountryCode: 91,
      Message: opt.Message,
      MobileNo: opt.MobileNo,
      OTP: null,
      Response: null,
      SMSType: null,
      OTPFor: 'garage'
    };
    this.masterService.sendSMS(options).subscribe(
      (res) => {
        console.log(res);
        this.globalService.successResponse(res.message);
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getGarageTypeValidation() {
    switch (this.garageType) {
      case '1':
        this.garageTypeObj.IsAgree = 0;
        this.garageTypeObj.IsAgreeCommercial = 1;
        this.garageTypeObj.IsAcceptUsp = 1;
        // if (this.garageDetail.IsAgree) {
        //   this.garageDetail.IsAgree = 1;
        //   this.garageDetail.IsAgreeCommercial = 0;
        //   this.garageDetail.IsAcceptUsp = 0;
        this.garageTypeValid = true;
        // } else {
        //   alert("Pls check terms & condition");
        // }
        break;
      case '2':
        this.garageTypeObj.IsAgree = 1;
        this.garageTypeObj.IsAgreeCommercial = 0;
        this.garageTypeObj.IsAcceptUsp = 0;
        // if (this.garageDetail.IsAgreeCommercial && this.garageDetail.IsAcceptUsp) {
        //   this.garageDetail.IsAgree = 1;
        this.garageTypeValid = true;
        // } else {
        //   alert("Commecial agreement not done");
        // }
        break;
      case '3':
        this.garageTypeObj.IsAgree = 0;
        this.garageTypeObj.IsAgreeCommercial = 0;
        this.garageTypeObj.IsAcceptUsp = 0;
        // this.garageDetail.IsAgree = 0;
        this.garageTypeValid = true;
        break;
    }
  }


  insertClaimGarage() {
    this.changeClaimStatus();
    return new Promise((resolve, reject) => {
      for (let i = 0; i < this.franchiseMaster.length; i++) {
        if (this.franchiseMaster[i]['FranchiseName'] == this.franchiseObj) {
          this.franchiseObjId = this.franchiseMaster[i]['Id']
          // this.garageForm.value['City'] = this.cities[i].Name;
        }
      }


      const data = {
        Address: this.garageForm.value.Locality || '',
        AlternateNo: this.garageForm.value.AlternateNo || 0,
        CityId: this.garageForm.value.CityId || 0,
        City: this.garageForm.value.City || '',
        CreatedBy: parseInt(this.garageDetail.PbGarageId) || 0,
        EmailID: this.garageForm.value.EmailId || '',
        GarageId: parseInt(this.garageDetail.PbGarageId) || 0,
        // GarageType: this.garageForm.value.GarageType || '',
        GarageType: this.selectedMake.length <= 1 ? 'Authorized' : 'MultiBrand',
        ID: 0,
        Latitude: this.latitude || 0,
        Location: this.garageForm.value.Address || '',
        LoginMobileNo: this.garageForm.value.LoginMobileNo ? this.garageForm.value.LoginMobileNo : this.garageDetail.LoginMobileNo || 0,
        Longitude: this.longitude || 0,
        MakeId: this.selectedMake.length == 1 ? this.selectedMake[0].MakeId : 0,
        MobileNo: this.garageForm.value.ContactPersonMobileNo || 0,
        Name: this.garageForm.value.Name || '',
        // Partners: '',
        Partner: this.franchiseObj || '',
        PartnerId: this.franchiseObjId || 0,
        Pincode: this.garageForm.value.Pincode || 0,
        RepresentiveName: this.garageForm.value.ContactPersonName || '',
        StatusID: this.claimStatusId || 0,
        isActive: true,
        Source: "QFC",
      };
      console.log(data, 12121212);

      this.globalService.insertClaimGarage(data).subscribe(
        (res) => {

          return resolve(res);
        },
        (err) => {
          console.error(err);
          return reject(err);
        }
      )
    })

  }

  changeClaimStatus() {
    if (this.garageForm.value.StatusId == 1 && this.garageStatus.StatusId > 1) {
      this.claimStatusId = 1;
    } else if (this.garageForm.value.StatusId == 1) {
      this.claimStatusId = 0;
    } else if (this.garageForm.value.StatusId == 2) {
      this.claimStatusId = 3;
    } else if (this.garageForm.value.StatusId == 3) {
      this.claimStatusId = 2;
    }
  }
}

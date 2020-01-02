import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { GlobalValidator, ValidationMessages, FormErrors } from '../../global-validator';
import { GlobalService, UserConfig } from '../../services/global.service';

import { MasterService } from '../../services/master.service';
import { GarageService } from '../../garage/garage.service';

import { Cities, CityResponse, Make } from '../../garage/garage';

@Component({
  selector: 'app-garage',
  templateUrl: './garage.component.html',
  styleUrls: ['./garage.component.css']
})
export class GarageComponent implements OnInit {

  isDisabled = true;
  garageId: string;
  garageDetail: any;
  garageForm: FormGroup;
  userDetails: UserConfig;
  cities: Cities[];
  makes: Make[];
  selectedMake: any[] = [];
  selectedMakeString: string = "";
  comments: any[];
  services: any[];
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
  uspTypeMaster: any;
  uspMaster: any;
  // USPIsActive: any = [];
  discount = [];
  discountType = [];
  garageUsp: any;
  editUsp = true;
  category = '';

  pickDropTime = [
    "09:00 AM - 12:00 PM",
    "12:00 PM - 03:00 PM",
    "03:00 PM - 06:00 PM",
    "06:00 PM - 09:00 PM"
  ];
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
    }

  };

  sentOtp: any;
  confirmedOtp = false;
  termsNCondition: any;

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
    this.getAllCities();
    this.getAllServices();
    this.getUSPMaster();
    this.getGarageUsp();
  }

  buildForm() {
    console.log(this.garageDetail)
    this.garageForm = this.fb.group({
      Name: [this.garageDetail.Name, Validators.compose([Validators.required])],
      Locality: [this.garageDetail.Locality, Validators.compose([Validators.required])],
      Address: [this.garageDetail.Address, Validators.compose([Validators.required])],
      State: [this.garageDetail.State, Validators.compose([Validators.required])],
      City: [this.garageDetail.CityId, Validators.compose([Validators.required])],
      Pincode: [this.garageDetail.Pincode, Validators.compose([Validators.required])],
      LandLineNo: [this.garageDetail.LandLineNo, Validators.compose([Validators.required])],
      ContactPersonName: [this.garageDetail.ContactPersonName, Validators.compose([Validators.required])],
      ContactPersonMobileNo: [this.garageDetail.ContactPersonMobileNo, Validators.compose([Validators.required])],
      AlternateContactPersonName: [this.garageDetail.AlternateContactPersonName],
      AlternateNo: [this.garageDetail.AlternateNo || null],
      EmailId: [this.garageDetail.EmailId, Validators.compose([Validators.required])],
      PickDrop: [this.garageDetail.PickDrop, Validators.compose([Validators.required])],
      // PickDropTimings: [''],
      DaysOff: [this.garageDetail.DaysOff, Validators.compose([Validators.required])]
    })


    this.garageForm.valueChanges.subscribe(data => {
      this.formErrors = GlobalValidator.validateForm(this.garageForm, this.validationMessages);
    })
  }

  getAllServices() {
    this.masterService.getServiceMaster().subscribe(
      (res) => {
        this.services = res.data;
        // console.log(12312321, this.services);
      },
      (err) => {
        console.error(err)
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
        this.latitude = this.garageDetail.Latitude;
        this.longitude = this.garageDetail.Longitude;
        this.pickDropTimings = this.garageDetail.PickDropTimings.toUpperCase() == "NULL" ? this.pickDropTimings : this.garageDetail.PickDropTimings.split(',');
        this.buildForm();
        this.getSelectedMake(res.data.Make);
        this.getGarageComments();
        this.checkServiceBox(this.garageDetail.services);
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
    console.log('selected make:', this.selectedMake);
  }

  changePickDropTiming(value) {
    let pos = this.pickDropTimings.indexOf(value);
    pos == -1 ? this.pickDropTimings.push(value) : this.pickDropTimings.splice(pos, 1)
  }

  sendConfirmationMsg(type) {
    switch (type) {
      case "sms": {
        const options = {
          CountryCode: 91,
          Message: `Dear Customer, Click on http://qfcbz.in/partner/${this.garageId} to verify your garage details.`,
          MobileNo: this.garageForm.value.ContactPersonMobileNo,
          OTP: null,
          Response: null,
          SMSType: null
        };
        this.masterService.sendSMS(options).subscribe(
          (res) => {
            console.log(res);
            // this.globalService.successResponse(res.message);
            alert(res.message);
          },
          (err) => {
            console.error(err);
          }
        )
        break;
      }
      case "email": {
        const options = {
          EmailId: this.garageForm.value.EmailId,
          Link: `http://qfcbz.in/partner/${this.garageId}`
        };
        this.masterService.sendEmail(options).subscribe(
          (res) => {
            console.log(res);
            // this.globalService.successResponse(res.message);
            alert(res.message);

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

  saveGarageDetail() {
    let a = [];
    this.selectedMake.map((item) => {
      a.push(item.MakeName)
    });
    this.selectedMakeString = a.toString();
    console.log(1234567, this.garageForm.value)
    if (this.garageForm.invalid) {
      this.formErrors = GlobalValidator.validateForm(this.garageForm, this.validationMessages, true);
      return;
    } else {
      let body = {
        data: {
          GarageId: parseInt(this.garageId),
          Address: this.garageForm.value.Address,
          AlternateContactPersonName: this.garageForm.value.AlternateContactPersonName,
          AlternateNo: this.garageForm.value.AlternateNo,
          City: this.garageForm.value.City,
          CityId: this.garageForm.value.City,
          ContactPersonMobileNo: this.garageForm.value.ContactPersonMobileNo,
          ContactPersonName: this.garageForm.value.ContactPersonName,
          DaysOff: this.garageForm.value.DaysOff,
          EmailId: this.garageForm.value.EmailId,
          GarageType: this.garageDetail.GarageType,
          IsAgree: 1,
          LandLineNo: this.garageForm.value.LandLineNo,
          Latitude: this.latitude,
          Locality: this.garageForm.value.Locality,
          LoginMobileNo: this.garageDetail.LoginMobileNo,
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
          IsPreferred: this.garageDetail.IsPreferred,

        },
        message: "Garage Updated",
        statusCode: 200
      }
      this.garageService.updateGarageDetail(this.garageId, body).subscribe(
        (res) => {
          alert(res.message)
        },
        (err) => {
          console.error(err)
        }
      );
    }
  }

  mapInit() {
    console.log(document.getElementById('garageAddress'))
    const input = <HTMLInputElement>document.getElementById('garageAddress');
    const autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', (data) => {
      console.log(autocomplete.getPlace())
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
    console.log(999999, this.checkedAddonService)
  }

  addOtherServices(id) {
    let pos = this.checkedAddonService.indexOf(id);
    pos == -1 ? this.checkedAddonService.push(id) : this.checkedAddonService.splice(pos, 1);
    console.log(999999, this.checkedAddonService)
    console.log(55555555, this.selectedOtherServices);
  }

  getItems(items) {
    console.log(items);
    this.selectedMake = items;
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

  sendOtp() {
    const details = {
      CountryCode: 91,
      MobileNo: this.garageForm.value.ContactPersonMobileNo,
      OTPFor: 'garageValidation'
    };
    this.masterService.sendOtp(details).subscribe(
      (res) => {
        console.log(res);
        // this.globalService.successResponse(res.message);
        alert(res.message);
      },
      (err) => {
        console.error(err);
      }
    )
  }

  verifyOtp() {
    const details = {
      CountryCode: 91,
      MobileNo: this.garageForm.value.ContactPersonMobileNo,
      OTP: this.sentOtp
    };
    this.masterService.validateOtp(details).subscribe(
      (res) => {
        console.log(res);
        // this.globalService.successResponse(res.message);
        alert(res.message);
        if (res.message == "OTP validated") {
          this.confirmedOtp = true;
        }
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
      alert('Discount range invalid');
      return;
    }

    if ((this.discountType[index] == 'r' && this.discount[index] < 0)) {
      alert('Discount range invalid');
      return;
    }

    const data = {
      GarageId: this.garageId,
      USPId: usp.Id,
      Discount: this.discount[index],
      DiscountType: this.discountType[index],
      ActionBy: this.garageId,
      ActionByType: 'g',
    };

    this.garageService.insertGarageUsp(data).subscribe(
      (res) => {
        alert('Success');
        this.getGarageUsp();
      },
      (err) => {
        console.error(err);
        alert('Error');
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

}

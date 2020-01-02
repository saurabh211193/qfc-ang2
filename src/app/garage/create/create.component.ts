import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { FormErrors, ValidationMessages, GlobalValidator } from '../../global-validator';
import { GlobalService, UserConfig } from '../../services/global.service';
import { MasterService } from '../../services/master.service';
import { Cities, CityResponse, Make } from '../garage';
import { GarageService } from '../garage.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  garageForm: FormGroup;

  formErrors: FormErrors = {
    'Name': '',
    'CityId': '',
    'City': '',
    'StateId': '',
    'State': '',
    'Pincode': '',
    'Address': '',
    'LoginMobileNo': '',
  };

  validationMessages: ValidationMessages = {
    'Name': {
      'required': 'Name is required',
    },
    'City': {
      'required': 'City is required',
    },
    'State': {
      'required': 'State is required',
    },
    'Pincode': {
      'required': 'Pincode is required',
    },
    'Address': {
      'required': 'Address is required',
    },
    'LoginMobileNo': {
      'required': 'LoginMobileNo is required',
    },
  };


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

  makes: Make[];
  cities: Cities[];
  latitude: number;
  longitude: number;
  insurerMaster: any;
  selectedInsurer: any;
  PbGarageId: any;
  garageType: any;
  garageDetail: any = {
    IsAcceptUsp: 0,
    IsAgree: 0,
    IsAgreeCommercial: 0,
  };
  userDetails: UserConfig;
  GarageId: any;

  franchiseMaster: any;
  selectedfranchise: any;
  franchiseObj: any = '';
  franchiseObjId: any = 0;
  selectedMake: any;
  selectedMakeString: string = "";
  selectedCity: any[];

  constructor(private fb: FormBuilder, private masterService: MasterService,
    private globalService: GlobalService, private garageService: GarageService,
    private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.userDetails = this.globalService.getUserCredential()['userData'];
    this.getAllMake();
    this.getAllCities();
    this.getInsurerMaster();
    this.getFranchiseMaster();
    this.buildForm();
  }

  buildForm() {

    this.garageForm = this.fb.group({
      Name: ['', Validators.compose([Validators.required])],
      GarageType: [''],
      // CityId: ['', Validators.compose([Validators.required])],
      City: ['', Validators.compose([Validators.required])],
      // StateId: ['', Validators.compose([Validators.required])],
      State: ['', Validators.compose([Validators.required])],
      Pincode: ['', Validators.compose([Validators.required])],
      Address: ['', Validators.compose([Validators.required])],
      LoginMobileNo: ['', Validators.compose([Validators.required])],
      ContactPersonMobileNo: ['', Validators.compose([Validators.required])],
      AlternateNo: ['', Validators.compose([Validators.required])],
    });
  }

  async insertGarageDetails() {
    let a = [];
    if (this.selectedMake) {
      this.selectedMake.map((item) => {
        a.push(item.MakeName)
      });
      this.selectedMakeString = a.toString();
    }
    if (this.garageForm.invalid) {
      this.formErrors = GlobalValidator.validateForm(this.garageForm, this.validationMessages, true);
      return;
    } else {
      for (let i = 0; i < this.franchiseMaster.length; i++) {
        if (this.franchiseMaster[i]['FranchiseName'] == this.franchiseObj) {
          this.franchiseObjId = this.franchiseMaster[i]['Id']
          // this.garageForm.value['City'] = this.cities[i].Name;
        }
      }

      let claimGarage = await this.insertClaimGarage();
      const claimGarageId = claimGarage['Data'].GarageId;
      const claimGarageExits = claimGarage['Data'].LoginNoExists;
      if (claimGarageExits) {
        alert('Login mobile no. already exits');
        return;
      }

      console.log(this.garageForm.value);
      console.log(this.selectedMake)
      this.getCityId();



      const data = {
        Name: this.garageForm.value.Name,
        CityId: this.selectedCity && this.selectedCity[0] ? this.selectedCity[0].CityId : 0,
        City: this.garageForm.value.City,
        StateId: null,
        State: this.garageForm.value.State,
        Pincode: this.garageForm.value.Pincode || null,
        Address: this.garageForm.value.Address || null,
        LoginMobileNo: this.garageForm.value.LoginMobileNo || null,
        ContactPersonMobileNo: this.garageForm.value.ContactPersonMobileNo || null,
        AlternateNo: this.garageForm.value.AlternateNo || null,
        Make: this.selectedMakeString,
        MakeId: this.garageForm.value.GarageType == 'Authorized' && this.selectedMake && this.selectedMake[0] && this.selectedMake[0].MakeId ? this.selectedMake[0].MakeId : 0,
        Latitude: this.garageForm.value.Latitude || null,
        Longitude: this.garageForm.value.Longitude || null,
        IsActive: 1,
        PBGarageId: claimGarageId || 0,
        IsAgree: this.garageDetail.IsAgree || null,
        IsAgreeCommercial: this.garageDetail.IsAgreeCommercial || null,
        IsAcceptUsp: this.garageDetail.IsAcceptUsp || null,
        FranchiseId: this.franchiseObjId,
        FranchiseName: this.franchiseObj,
        GarageType: this.garageForm.value.GarageType,
      };

      this.garageService.insertGarageDetails(data).subscribe(
        (res) => {
          console.log(res);
          if (res.statusCode == 200) {
            this.GarageId = res.data.GarageId;
            this.insertGarageInsurerMapping();
          } else {
            alert(res.message);
          }

        },
        (err) => {
          console.error(err);
        }
      )
    }
  }

  getAllMake() {
    this.masterService.getAllMake().subscribe(
      (res: any) => {
        this.makes = res.data;
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
      },
      (err) => {
        console.log(err);
      }
    )
  }

  mapInit() {
    console.log(document.getElementById('garageCreateAddress'))
    const input = <HTMLInputElement>document.getElementById('garageCreateAddress');
    const autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', (data) => {
      console.log(autocomplete.getPlace().geometry.location.lat());
      console.log(autocomplete.getPlace().geometry.location.lng())
      this.garageForm.controls['Address'].setValue(autocomplete.getPlace().formatted_address);
      this.latitude = autocomplete.getPlace().geometry.location.lat();
      this.longitude = autocomplete.getPlace().geometry.location.lng();
    });
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
      if (this.selectedInsurer) {
        this.selectedInsurer.map(insurer => {
          insurerIds.push(insurer.OldSupplierId);
          return insurerIds;
        });
      }

      const data = {
        GarageId: this.GarageId,
        InsurerId: insurerIds,
        TieUpType: 1,
        CreatedBy: this.GarageId,
      };
      this.garageService.insertGarageInsurerMapping(data).subscribe(
        (res) => {
          alert('Garage Inserted');
          this.router.navigate([`../list`], {
            relativeTo: this.activatedRoute,
          });

        },
        (err) => {
          console.error(err);
        }
      )
    }
  }

  insertClaimGarage() {
    this.getCityId();
    return new Promise((resolve, reject) => {

      const claimGarageData = {
        Address: this.garageForm.value.Address,
        AlternateNo: this.garageForm.value.AlternateNo,
        CityId: this.selectedCity[0] ? this.selectedCity[0].CityId : 0,
        City: this.garageForm.value.City,
        "CreatedBy": 0,
        "EmailID": "",
        "GarageId": 0,
        GarageType: this.garageForm.value.GarageType,
        ID: 0,
        "Latitude": this.latitude || 0,
        "Location": this.garageForm.value.Address || '',
        "LoginMobileNo": this.garageForm.value.LoginMobileNo || 0,
        "Longitude": this.longitude || 0,
        "Make": this.selectedMakeString || '',
        "MakeId": 0,
        "MobileNo": this.garageForm.value.ContactPersonMobileNo || 0,
        "Name": this.garageForm.value.Name || '',
        "Partner": this.franchiseObj || '',
        "PartnerId": this.franchiseObjId || 0,

        "Pincode": this.garageForm.value.Pincode,
        "RepresentiveName": "",
        "State": '',
        "StateID": 0,
        "StatusID": 1,
        "isActive": true,
        "Source": "QFC"
      };


      this.globalService.insertClaimGarage(claimGarageData).subscribe(
        (res: any) => {
          this.PbGarageId = res.Data.GarageId;
          return resolve(res);
        },
        (err) => {
          console.error(err);
          return reject(err);
        }
      )
    })

  }

  getGarageTypeValidation() {
    switch (this.garageType) {
      case '1':
        this.garageDetail.IsAgree = 0;
        this.garageDetail.IsAgreeCommercial = 1;
        this.garageDetail.IsAcceptUsp = 1;
        break;
      case '2':
        this.garageDetail.IsAgree = 1;
        this.garageDetail.IsAgreeCommercial = 0;
        this.garageDetail.IsAcceptUsp = 0;
        break;
      case '3':
        this.garageDetail.IsAgree = 0;
        this.garageDetail.IsAgreeCommercial = 0;
        this.garageDetail.IsAcceptUsp = 0;
        break;
    }
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

  getMakeItems(items) {
    this.selectedMake = items;
  }

  getGarageType() {
    if (this.garageForm.value.GarageType == 'Authorized') {
      this.multiselect_dropdown = {
        singleSelection: true,
        idField: 'MakeId',
        textField: 'MakeName',
        itemsShowLimit: 3,
        allowSearchFilter: true
      };
    } else {
      this.multiselect_dropdown = {
        singleSelection: false,
        idField: 'MakeId',
        textField: 'MakeName',
        itemsShowLimit: 3,
        allowSearchFilter: true
      };
    }
  }

  getCityId() {
    console.log(this.garageForm.value.City)
    this.selectedCity = this.cities.filter(city => {
      return city.Name == this.garageForm.value.City;
    });
  }
}

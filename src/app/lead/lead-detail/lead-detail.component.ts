import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { GlobalService } from '../../services/global.service';
import { MasterService } from '../../services/master.service';
import { DynamicComponentService } from '../../shared/dynamic-component.service';
import { LeadService } from '../lead.service';

import { AuditTrailComponent } from '../audit-trail/audit-trail.component';

import { leadData } from '../lead';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lead-detail',
  templateUrl: './lead-detail.component.html',
  styleUrls: ['./lead-detail.component.css']
})
export class LeadDetailComponent implements OnInit, OnChanges {
  leadForm: FormGroup;
  edit = false;
  models: any;
  reachOutDate: any;
  fuelTypeMaster: any;
  offers: any;

  @Input('data') data: leadData;
  @Input('AllMake') AllMake: any;
  @Input('statusDetail') statusDetail: any;
  @Input('customerData') customerData: any;
  @Input('isClaimLead') IsClaimLead: any;

  today = new Date().toJSON().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private dyComService: DynamicComponentService,
    private masterService: MasterService,
    private leadService: LeadService
  ) { }

  ngOnInit() {
    this.getModeByMake({
      MakeId: this.data.MakeId,
      MakeName: this.data.MakeName
    });
    this.getFuelTypeMaster();
    this.getOfferAvailedByCustomer();
  }

  ngOnChanges() {
    this.getModeByMake({
      MakeId: this.data.MakeId,
      MakeName: this.data.MakeName
    });
  }

  buildForm() {
    this.leadForm = this.fb.group({
      MakeName: [this.data.MakeName],
      MakeId: [this.data.MakeId],
      ModelName: [this.data.ModelName],
      ModelId: [this.data.ModelId],
      FollowUpDateTime: [
        this.data.FollowUpDateTime
          ? `${this.data.FollowUpDateTime}(${this.data.FollowUpWith})`
          : ''
      ],
      Location: [this.data.Location],
      Latitude: [this.data.Latitude],
      Longitude: [this.data.Longitude],
      Status: [
        `${this.statusDetail.StatusName}(${this.statusDetail.SubStatusName})`
      ],
      RegistrationNo: [this.data.RegistrationNo || null],
      ReachOutDate: [
        this.data.ReachOutDate
          ? new Date(this.data.ReachOutDate).toISOString().substring(0, 10)
          : ''
      ],
      FuelType: [this.data.FuelType],
      CurrentKM: [this.data.CurrentKM],
      LastKM: [this.data.LastKM]
    });
  }

  getModeByMake(make) {
    this.masterService.getModeByMake(make.MakeId).subscribe(
      res => {
        console.log(res);
        this.models = res.data;
        this.buildForm();
      },
      err => {
        console.error(err);
      }
    );
  }

  openAuditTrailModal() {
    this.dyComService.loadComponent(AuditTrailComponent, this.data).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.error(err);
      }
    );
  }

  viewClaimCrm() {
    // console.log('ax', this.data.PBClaimId + ":" + this.customerData.CustomerMobileNo + ":" + true)
    window.open(`${environment.claimBaseUrl}/ClaimDetail.html#${btoa(this.data.PBClaimId + ':' + this.customerData.CustomerMobileNo + ':' + true)} `)
  }

  changeMake(value) {
    const make = this.AllMake.find(makeObj => {
      return makeObj.MakeName === value;
    });

    this.leadForm.controls['MakeId'].setValue(make.MakeId);
    this.leadForm.controls['MakeName'].setValue(make.MakeName);

    this.data.MakeName = make.MakeName;
    this.data.MakeId = make.MakeId;
    this.getModeByMake(make);
  }

  changeModel(value) {
    const model = this.models.find(modelObj => {
      return modelObj.ModelName === value;
    });
    this.leadForm.controls['ModelId'].setValue(model.ModelId);
    this.leadForm.controls['ModelName'].setValue(model.ModelName);
  }

  updateLeadDetails() {
    const leadDetails = {
      FuelType: this.leadForm.value.FuelType,
      Latitude: this.leadForm.value.Latitude || this.data.Latitude,
      Location: this.leadForm.value.Location,
      Longitude: this.leadForm.value.Longitude || this.data.Longitude,
      MakeId: this.leadForm.value.MakeId,
      MakeName: this.leadForm.value.MakeName,
      ModelId: this.leadForm.value.ModelId,
      ModelName: this.leadForm.value.ModelName,
      RegistrationNo: this.leadForm.value.RegistrationNo,
      ReachOutDate: this.leadForm.value.ReachOutDate
        ? new Date(this.leadForm.value.ReachOutDate)
          .toISOString()
          .substring(0, 10)
        : null,
      ExitPointURL: this.data.ExitPointURL
    };

    this.leadService.updateLeadDetails(this.data.LeadId, leadDetails).subscribe(
      res => {
        console.log(res);
        this.edit = false;
      },
      err => {
        console.error(err);
      }
    );
  }

  mapInit() {
    console.log(document.getElementById('leadAddress'));
    const input = <HTMLInputElement>document.getElementById('leadAddress');
    const autocomplete = new google.maps.places.Autocomplete(input);

    google.maps.event.addListener(autocomplete, 'place_changed', data => {
      console.log(autocomplete.getPlace().geometry.location.lat());
      console.log(autocomplete.getPlace().geometry.location.lng());
      this.leadForm.controls['Location'].setValue(
        autocomplete.getPlace().formatted_address
      );
      this.leadForm.controls['Latitude'].setValue(
        autocomplete.getPlace().geometry.location.lat()
      );
      this.leadForm.controls['Longitude'].setValue(
        autocomplete.getPlace().geometry.location.lng()
      );
    });
  }

  enable() {
    this.leadForm.controls['Location'].enable();
  }

  getFuelTypeMaster() {
    this.masterService.getFuelType().subscribe(
      res => {
        this.fuelTypeMaster = res.data;
      },
      err => {
        console.error(err);
      }
    );
  }

  getOfferAvailedByCustomer() {
    this.leadService.getOfferAvailedByCustomer(this.data.LeadId).subscribe(
      res => {
        this.offers = res.data;
      },
      err => {
        console.error(err);
      }
    );
  }


}

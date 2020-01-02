import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

import { GlobalService, UserConfig } from '../../services/global.service';
import { MasterService } from '../../services/master.service';
import { GarageService } from '../garage.service';

import { Cities, CityResponse, pagination } from '../garage';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {

  userDetails: UserConfig;
  filterForm: FormGroup;
  cities: Cities[];

  garages: any;
  status = [{ name: 'Not Registered', id: 1 }, { name: 'Registered', id: 2 }, { name: 'Rejected', id: 3 }];
  pages = [5, 10, 20, 50];
  pagination = {
    collectionSize: null,
    pageSize: null,
    page: null,
    totalPages: null
  };
  bulkGarageFile: any;

  constructor(private router: Router,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private masterService: MasterService,
    private garageService: GarageService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.userDetails = this.globalService.getUserCredential()['userData'];
    this.buildForm();
    this.getAllCities();
    this.getAssignedGarages();
  }

  buildForm() {
    this.filterForm = this.fb.group({
      garageid: [''],
      garagename: [''],
      city: [''],
      pincode: [''],
      isagree: [''],
      count: [20],
      sortby: [''],
      sortbytype: [0]
    });
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

  getAssignedGarages() {
    const params = this.setParams();
    this.garageService.getUserAssignedGarages(this.userDetails.UserId, params).subscribe(
      (res) => {
        console.log(res);
        this.garages = res.data.rows;
        this.initializePagination(res.data.paging);
        console.log(this.pagination)
      },
      (err) => {
        console.log(err);
      }
    )
  }

  initializePagination(paging) {
    this.pagination.collectionSize = this.filterForm.value.count * paging.totalPages;
    this.pagination.page = paging.currentPage;
    this.pagination.pageSize = this.filterForm.value.count;
    this.pagination.totalPages = paging.totalPages;
  }

  setParams() {
    let params = new HttpParams();
    params = params.set('garageid', this.filterForm.value.garageid || '')
      .set('garagename', this.filterForm.value.garagename || '')
      .set('pincode', this.filterForm.value.pincode || '')
      .set('isagree', this.filterForm.value.isagree || '')
      .set('city', this.filterForm.value.city || '')
      .set('page', this.pagination.page || 1)
      .set('count', this.filterForm.value.count || '')
      .set('sortby', this.filterForm.value.sortby)
      .set('sortbytype', this.filterForm.value.sortbytype)

    return params;
  }

  PageChanged(event) {
    this.pagination = event;
    this.getAssignedGarages();
  }

  resetPagination() {
    this.pagination.page = 1;
  }

  fileChangeEvent(event) {
    this.bulkGarageFile = <Array<File>>event.target.files[0];
  }

  uploadBulkGarageFile() {
    let formData = new FormData();
    formData.append('files', this.bulkGarageFile);

    this.garageService.bulkUploadGarages(formData).subscribe(
      (res) => {
        console.log(res);
        this.globalService.successResponse(res.message);
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getGarageDetail(garageId) {
    this.router.navigate([`../detail/${btoa(garageId)}`], { relativeTo: this.activatedRoute });
  }

  sortGarageList(sortby, sortOrder) {
    this.filterForm.controls['sortby'].setValue(sortby);
    this.filterForm.controls['sortbytype'].setValue(sortOrder);
    console.log(this.filterForm.value);
    this.getAssignedGarages();
  }

  viewGarage(garageId) {
    let token = this.globalService.getUserCredential()['Token'];
    let subdomain = 'qapartner';
    let isSuperAdmin = 0;
    if (['127.0.0.1:3001', 'qaapi.quickfixcars.com'].indexOf(environment.domain) > -1) {
      subdomain = 'qapartner';
    } else {
      subdomain = 'partner';
    }
    if (environment.superAdmin.indexOf(this.userDetails.UserId) >= 0) {
      isSuperAdmin = 1;
    }
    window.open(`https://${subdomain}.quickfixcars.com/user/agent-login/${token}/${this.userDetails.UserId}/${garageId}/${isSuperAdmin}`);
  }

}

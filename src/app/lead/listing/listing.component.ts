import { Component, OnInit, HostListener } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpParams } from "@angular/common/http";
import {
  Router,
  ActivatedRoute,
  RoutesRecognized,
  Params,
  NavigationEnd
} from "@angular/router";

import { UserConfig, GlobalService } from "../../services/global.service";
import { LeadService } from "../lead.service";

import { statusCount } from "../lead";

import { MasterService } from '../../services/master.service';

@Component({
  selector: "app-listing",
  templateUrl: "./listing.component.html",
  styleUrls: ["./listing.component.css"]
})
export class ListingComponent implements OnInit {
  userId: any;
  filterForm: FormGroup;
  leads: any;
  pagination = {
    collectionSize: null,
    pageSize: null,
    page: null,
    totalPages: null
  };
  statusCount: statusCount[];
  currentStatusId: any = 1;
  leadType = ["QFC", "PBRef"];

  products: any;
  currentStatusMode: any;
  isSearch: any = false;

  @HostListener("window:popstate", ["$event"])
  onPopState(event) {
    window.location.reload();
  }

  constructor(
    private globalService: GlobalService,
    private fb: FormBuilder,
    private leadService: LeadService,
    private router: Router,
    private route: ActivatedRoute,
    private masterService: MasterService
  ) {
    route.params.subscribe(params => {
      this.currentStatusId = parseInt(params.statusid);
      this.userId = atob(params.userid);
    });

    // router.events.subscribe((val) => {
    //   if (val instanceof NavigationEnd) {
    //     console.log(this.route.snapshot.params.statusid, 'RE');
    //   }
    // });
  }

  ngOnInit() {
    this.buildForm();

    // this.getProductMaster();
    // this.getUserProductRole();
  }

  async buildForm() {
    const userProducts = await this.getUserProductRole();
    console.log('userProducts', userProducts)
    this.filterForm = this.fb.group({
      leadid: [""],
      mobileno: [""],
      leadsource: [""],
      count: [20],
      // productid: [userProducts[0].ProductId]
      productid: [4]
    });

    this.getLeadStatusCount();
    this.getLeads();
  }

  getLeadStatusCount() {
    console.log(this.filterForm)
    let params = new HttpParams();
    params = params
      .set("productid", this.filterForm.value.productid);


    this.leadService.getLeadStatusCount(this.userId, params).subscribe(
      res => {
        console.log(res);
        if (this.filterForm.value.productid == 4) {
          this.filterClaimStatuses(res.data);
        } else {
          this.statusCount = res.data;
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  getLeads() {
    const params = this.setParams();
    console.log(params, this.filterForm.value);
    if (this.currentStatusMode == 'PO') {
      this.leadService.getClaimLeads(params).subscribe(
        res => {
          console.log(res);
          this.leads = res.data.rows;
          this.initializePagination(res.data.paging);
        },
        err => {
          console.error(err);
        }
      );
    } else {
      this.leadService.getLeads(params).subscribe(
        res => {
          console.log(res);
          this.leads = res.data.rows;
          this.initializePagination(res.data.paging);
        },
        err => {
          console.error(err);
        }
      );
    }

  }

  setParams() {
    let params = new HttpParams();
    params = params

      .set("userid", this.userId.toString() || "")
      .set("leadid", this.filterForm.value.leadid || "")
      .set("mobileno", this.filterForm.value.mobileno || "")
      .set("leadsource", this.filterForm.value.leadsource || "")
      .set("page", this.pagination.page || 1)
      .set("count", this.filterForm.value.count)
      .set("productid", this.filterForm.value.productid);

    if (this.filterForm.value.productid == 4) {
      params = params.set("statusmode", this.currentStatusMode || 'P')
      if (this.currentStatusId == 6 || this.currentStatusId == 1) {
        params = params.set("statusid", '0')
      } else {
        if (this.isSearch) {
          this.currentStatusId = this.currentStatusId;
          params = params.set("statusid", '0')
        } else {
          this.currentStatusId = this.currentStatusId || 62;
          params = params.set("statusid", this.currentStatusId.toString() || '62')
        }
      }
    } else {
      params = params.set("statusmode", this.currentStatusMode)
        .set("statusid", this.currentStatusId.toString())
    }

    return params;
  }

  initializePagination(paging) {
    this.pagination.collectionSize =
      this.filterForm.value.count * paging.totalPages;
    this.pagination.page = paging.currentPage;
    this.pagination.pageSize = this.filterForm.value.count;
    this.pagination.totalPages = paging.totalPages;
    console.log(this.pagination);
  }

  PageChanged(event) {
    this.pagination = event;
    this.getLeads();
  }

  changeStatus(statusId, statusMode) {
    this.currentStatusId = statusId;
    this.currentStatusMode = statusMode;
    this.isSearch = false;
    this.changeRoute(statusId);
    this.resetPagination();
    this.resetFilter();
    this.getLeads();
  }

  resetPagination() {
    this.pagination.page = 1;
  }

  resetFilter() {
    this.filterForm.value.leadid = null;
    this.filterForm.value.mobileno = null;
    this.filterForm.value.leadsource = null;
  }

  searchFilter() {
    this.currentStatusId = '0';
    this.isSearch = true;
    this.getLeads();
  }

  getLeadDetail(leadId) {
    this.router.navigate([`../../../detail/${btoa(leadId)}`], {
      relativeTo: this.route
    });
  }

  changeRoute(statusId) {
    this.router.navigate([`../${statusId}`], { relativeTo: this.route });
  }

  getProductMaster() {
    this.masterService.getProduct().subscribe(
      (res) => {
        this.products = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  changeProduct() {
    this.searchFilter();
    this.getLeadStatusCount();
  }


  getUserProductRole() {
    return new Promise((resolve, reject) => {
      this.leadService.getUserProductrole(this.userId).subscribe(
        (res) => {
          console.log(res);
          this.products = res.data;
          return resolve(this.products);
        },
        (err) => {
          console.error(err);
          return reject(err);
        }
      )
    })
  }

  filterClaimStatuses(data) {
    const statusArr = [];
    let negStatusLead = 0;
    let otherStatusLead = 0;

    data.filter(status => {
      if (status.StatusMode == 'P' && ([62, 16, 26, 47, 30].includes(status.StatusId))) {
        statusArr.push(status);
      } else if (status.StatusMode == 'N') {
        negStatusLead = negStatusLead + parseInt(status.Total);
      } else if (status.StatusMode && !([62, 16, 26, 47, 30].includes(status.StatusId))) {
        otherStatusLead = otherStatusLead + parseInt(status.Total);
      }
    });

    statusArr.push({
      StatusId: 6,
      StatusMode: "N",
      StatusName: "Rejected",
      Total: negStatusLead
    });

    statusArr.push({
      StatusId: 6,
      StatusMode: "PO",
      StatusName: "My Claims",
      Total: otherStatusLead
    });

    this.statusCount = statusArr;
  }
}

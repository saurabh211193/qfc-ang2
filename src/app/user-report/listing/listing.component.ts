import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserReportService } from '../user-report.service';
import { GlobalService } from '../../services/global.service';

import { DynamicComponentService } from './../../shared/dynamic-component.service';
import { RoleModalComponent } from '../role-modal/role-modal.component';
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {

  userReport: any[];
  constructor(private userReportService: UserReportService,
    private globalService: GlobalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dyCommService: DynamicComponentService) { }

  ngOnInit() {
    this.getUserReports();
  }

  getUserReports() {
    this.userReportService.getUsersReport().subscribe(
      (res) => {
        console.log(res);
        this.userReport = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  saveUserReport(report) {
    console.log(report)
    const userReportDetail = {
      BucketSize: report.BucketSize,
      DailyLimit: report.DailyLimit
    };

    this.userReportService.updateUserDetail(report.UserId, userReportDetail).subscribe(
      (res) => {
        console.log(res);
        this.globalService.successResponse(res.message);
        this.getUserReports();
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getUserReport(userId) {
    this.router.navigate([`../../lead/list/${btoa(userId)}/1`], { relativeTo: this.activatedRoute });
  }

  changeRole(user) {
    const data = {
      UserId: user.UserId,
      Product: user.Product,
    };

    this.dyCommService.loadComponent(RoleModalComponent, data).subscribe(

    )
  }

}

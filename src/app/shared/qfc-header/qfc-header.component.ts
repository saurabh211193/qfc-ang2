import { MasterService } from './../../services/master.service';
import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { GlobalService, UserConfig } from '../../services/global.service';
import { DynamicComponentService } from "../../shared/dynamic-component.service";
// import { GlobalService, UserConfig } from "../../services/global.service";

import { RoleModalComponent } from '../../user-report/role-modal/role-modal.component';

@Component({
  selector: 'app-qfc-header',
  templateUrl: './qfc-header.component.html',
  styleUrls: ['./qfc-header.component.css']
})
export class QfcHeaderComponent implements OnInit {

  userDetails: UserConfig;
  constructor(private router: Router,
    private globalService: GlobalService,
    private masterService: MasterService,
    private dyCommService: DynamicComponentService) { }

  ngOnInit() {
    this.userDetails = this.globalService.getUserCredential()['userData'];
    console.log(this.userDetails);
  }

  async logout() {
    // const res = await this.dialerLogout();
    const data = {
      'logoutUrl': this.router.url
    };

    this.masterService.logout(data).subscribe(
      (res) => {
        console.log('res logout', res);
        this.globalService.deleteUserCredential();
        this.router.navigate(['']);
      },
      (err) => {
        console.error(err);
      }
    )
  }

  dialerLogout() {
    let params = new HttpParams();
    params = params.set('emp_id', this.userDetails.EmployeeId)
      .set('queue_name', 'qfcinbound')
      .set('product_name', 'qfc');

    return new Promise((resolve, reject) => {
      this.globalService.dialerLogout(params).subscribe(
        (res) => {
          return resolve(true);
        },
        (err) => {
          console.error(err);
          return reject(false);
        }
      )
    });
  }

}

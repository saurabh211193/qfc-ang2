import { Component, OnInit } from '@angular/core';

import { GlobalService, UserConfig } from '../../services/global.service';

@Component({
  selector: 'app-sidebar-nav',
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.css']
})
export class SidebarNavComponent implements OnInit {
  userDetails: UserConfig;
  dashboardOptions: Object[];
  constructor(private globalService: GlobalService) { }

  ngOnInit() {
    this.userDetails = this.globalService.getUserCredential()['userData'];
    this.dashboardOptions = [
      {
        name: 'Garages',
        route: 'garage/list',
        image: 'tachometer',
        allowAccess: true
      },
      {
        name: 'Leads',
        route: `lead/list/${btoa(this.userDetails.UserId.toString())}/1`,
        image: 'book',
        allowAccess: true
      },
      {
        name: 'User Report',
        route: 'user-report/list',
        image: 'line-chart',
        allowAccess: false
      },
      {
        name: 'Assign Garages',
        route: 'assignment/garage',
        image: 'handshake-o',
        allowAccess: false
      },
      {
        name: 'Assign Leads',
        route: 'assignment/lead',
        image: 'book',
        allowAccess: false
      },
      {
        name: 'Lead Report',
        route: 'lead/report',
        image: 'flag',
        allowAccess: false
      },
      {
        name: 'Garage Create',
        route: 'garage/create',
        image: 'plus',
        allowAccess: false
      }
    ];

    this.dashboardOptions.map(options => {
      options['access'] = this.userDetails.UserType;
    });
  }

  pbreflink() {
    window.open('http://pbutility.policybazaar.com/');
  }
}

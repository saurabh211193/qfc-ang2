import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';

import { LeadService } from '../lead.service';

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.css']
})
export class AuditTrailComponent implements OnInit {

  @Input() notifier$: Subject<any>;
  @Input() data: any;

  leadCallDetail: any;
  leadCallback: any;
  leadAssignedUser: any[] = [];
  leadAudit: any;
  leadCommDetail: any;

  constructor(private leadService: LeadService) { }

  ngOnInit() {
    console.log(this.data)
    this.getLeadCallDetail();
    this.getLeadCallback();
    this.getLeadAssignedUser();
    this.getLeadAuditTrail();
    this.getLeadCommDetail();
  }

  getLeadCallDetail() {
    this.leadService.getLeadCallDetail(this.data.LeadId).subscribe(
      (res) => {
        console.log(res);
        this.leadCallDetail = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getLeadCallback() {
    this.leadService.getLeadCallbackDetail(this.data.LeadId).subscribe(
      (res) => {
        console.log(res);
        this.leadCallback = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getLeadAssignedUser() {
    this.leadService.getLeadAssignedUser(this.data.LeadId).subscribe(
      (res) => {
        console.log(res);
        this.leadAssignedUser = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getLeadAuditTrail() {
    this.leadService.getLeadAuditTrail(this.data.LeadId).subscribe(
      (res) => {
        console.log(res);
        this.leadAudit = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getLeadCommDetail() {
    this.leadService.getLeadCommDetail(this.data.LeadId).subscribe(
      (res) => {
        console.log(res);
        this.leadCommDetail = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  cancel() {
    this.notifier$.next(false);
    this.notifier$.complete();
  }

  close() {
    this.cancel();
  }
}

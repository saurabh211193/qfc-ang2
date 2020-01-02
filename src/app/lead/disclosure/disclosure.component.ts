import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';

import { LeadService } from '../lead.service';

@Component({
  selector: 'app-disclosure',
  templateUrl: './disclosure.component.html',
  styleUrls: ['./disclosure.component.css']
})
export class DisclosureComponent implements OnInit {

  @Input() notifier$: Subject<any>;
  @Input() data: any;

  leadCallDetail: any;
  leadCallback: any;
  leadAssignedUser: any[] = [];
  leadAudit: any;
  leadCommDetail: any;

  constructor(private leadService: LeadService) { }

  ngOnInit() {
    // console.log('data', this.data);
  }

  submit() {
    this.notifier$.next({ 'isDisclosureSubmitted': true });
    this.notifier$.complete();
  }
  close() {
    this.notifier$.next({ 'isDisclosureSubmitted': false });
    this.notifier$.complete();
  }
}

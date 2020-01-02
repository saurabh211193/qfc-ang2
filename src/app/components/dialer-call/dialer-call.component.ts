import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-dialer-call',
  templateUrl: './dialer-call.component.html',
  styleUrls: ['./dialer-call.component.css']
})
export class DialerCallComponent implements OnInit {

  @Input('callDetails') callDetails: any;
  @Input('leadData') leadData: any;
  @Output() initiateCall = new EventEmitter();
  constructor(private globalService: GlobalService) { }

  ngOnInit() {
    console.log(this.callDetails);
    console.log(this.leadData)
  }

  call() {
    this.initiateCalling().then((res) => {
      console.log(res);
    })
    // let params = new HttpParams();
    // params = params.set('phone', `645740${this.callDetails}`)
    //   .set('leadid', this.leadData.LeadId)
    //   .set('campaign', 'qfccustomer')
    //   .set('campaign', '')
    //   .set('uid', '');

    // this.globalService.dialerCall(params).subscribe(
    //   (res) => {
    //     this.initiateCall.emit(res);
    //   },
    //   (err) => {
    //     console.error(err);
    //   }
    // )
  }

  async initiateCalling() {
    const res = await this.initiateCall.emit(true);
    return Promise.resolve(res);

  }

}

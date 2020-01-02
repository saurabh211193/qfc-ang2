import { statusCount } from './../lead';
import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';

import { MasterService } from '../../services/master.service';
import { GlobalService, UserConfig } from '../../services/global.service';
import { LeadService } from '../lead.service';

@Component({
  selector: 'app-garage-list-modal',
  templateUrl: './garage-list-modal.component.html',
  styleUrls: ['./garage-list-modal.component.css']
})
export class GarageListModalComponent implements OnInit {

  @Input() notifier$: Subject<any>;
  @Input() data: any;
  garageList: any;
  userDetails: UserConfig;
  constructor(private masterService: MasterService,
    private globalService: GlobalService,
    private leadService: LeadService) { }

  ngOnInit() {
    console.log(this.data)
    this.userDetails = this.globalService.getUserCredential()['userData'];
    const options = {
      // claimid: this.data.pbClaimId,
      distance: this.data.distance,
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      make: this.data.make,
      serviceid: this.data.serviceid,
      isagree: 0
    };

    this.masterService.getGarages(options).subscribe(
      (res) => {
        console.log(res);
        this.garageList = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  confirm() {
    this.notifier$.next(true);
    this.notifier$.complete();
  }

  cancel() {
    this.notifier$.next(false);
    this.notifier$.complete();
  }

  close() {
    this.cancel();
  }

  saveCustomerSelection(garageId) {
    const customerSelection = {
      LeadId: this.data.leadId,
      SelectionId: garageId,
      ProductId: 1,
      SelectedBy: this.userDetails.UserId,
      SelectionByType: 'u'
    };
    console.log(customerSelection);

    this.leadService.insertCustomerSelection(customerSelection).subscribe(
      (res) => {
        if (res.statusCode === 200) {
          this.globalService.successResponse('Success');
        }
        console.log(res);
      },
      (err) => {
        console.error(err);
      }
    )
  }

}

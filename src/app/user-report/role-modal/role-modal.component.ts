import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';

import { MasterService } from '../../services/master.service';
import { DashboardService } from '../../dashboard/dashboard.service';

import { GlobalService, UserConfig } from '../../services/global.service';

@Component({
  selector: 'app-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.css']
})
export class RoleModalComponent implements OnInit {

  @Input() notifier$: Subject<any>;
  @Input() data: any;

  products: any;
  selected_products: any;
  UserId: any;

  multiselect_dropdown = {
    singleSelection: false,
    idField: 'ProductId',
    textField: 'ProductName',
    itemsShowLimit: 3,
    allowSearchFilter: false,
    placeholder: 'Select Product',
    enableCheckAll: false,
  };

  constructor(private masterService: MasterService, private dashboardService: DashboardService,
    private globalService: GlobalService) { }

  ngOnInit() {
    console.log(this.data)
    this.UserId = this.data.UserId;
    this.getProductMaster();
    this.getUserProductRole();
  }

  cancel() {
    this.notifier$.next(false);
    this.notifier$.complete();
  }

  close() {
    this.cancel();
  }

  getProductMaster() {
    this.masterService.getProduct().subscribe(
      (res) => {
        console.log(res);
        this.products = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getItems(items) {
    console.log(items);
    this.selected_products = items;
  }

  updateUserProduct() {
    let productArr = [];
    this.selected_products.map(product => {
      productArr.push(product.ProductId);
      return productArr;
    });

    const data = {
      UserId: this.UserId,
      ProductIds: productArr,
    };

    this.dashboardService.updateUserProducts(data).subscribe(
      (res) => {
        console.log(res);
        this.getUserProductRole();
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getUserProductRole() {
    this.dashboardService.getUserProductrole(this.UserId).subscribe(
      (res) => {
        console.log(res);
        this.selected_products = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

}

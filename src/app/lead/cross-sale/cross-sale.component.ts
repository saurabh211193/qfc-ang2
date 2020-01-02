import { UserDetails } from './../../user/user';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MasterService } from '../../services/master.service';
import { GlobalService, UserConfig } from '../../services/global.service';

import { leadData, customerData } from '../lead';

import { LeadService } from '../lead.service';

import { FormErrors, ValidationMessages, GlobalValidator } from '../../global-validator';

@Component({
  selector: 'app-cross-sale',
  templateUrl: './cross-sale.component.html',
  styleUrls: ['./cross-sale.component.css']
})
export class CrossSaleComponent implements OnInit {

  @Input('lead') leadDetails: leadData;
  @Input('customer') customerDetail: customerData;


  crossSaleForm: FormGroup;
  products: any;
  suppliers: any;
  supplierMaster: any;
  userDetails: UserConfig;

  productObj: any;
  supplierObj: any;

  formErrors: FormErrors = {
    'ProductId': '',
    'SelectionId': ''
  };

  validationMessages: ValidationMessages = {
    'ProductId': {
      'required': 'Product is required',
    },
    'SelectionId': {
      'required': 'Supplier is required',
    }
  };

  constructor(private fb: FormBuilder,
    private masterService: MasterService,
    private leadService: LeadService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    this.userDetails = this.globalService.getUserCredential()['userData'];
    console.log(this.leadDetails)
    this.buildForm();
    this.getProductMaster();
    this.getSupplierMaster();
  }

  buildForm() {
    this.crossSaleForm = this.fb.group({
      ProductId: ['', Validators.compose([Validators.required])],
      SelectionId: ['', Validators.compose([Validators.required])]
    });
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

  getSupplierMaster() {
    this.masterService.getSupplier().subscribe(
      (res) => {
        this.supplierMaster = res.data;
        this.suppliers = JSON.parse(JSON.stringify(this.supplierMaster));
      },
      (err) => {
        console.error(err);
      }
    )
  }

  changeSuppliers(value) {
    const suppliers = this.supplierMaster.filter(product => {
      return product.ProductId == value;
    });
    this.suppliers = suppliers;
  }



  createCrossSaleLead() {
    if (this.crossSaleForm.invalid) {
      this.formErrors = GlobalValidator.validateForm(this.crossSaleForm, this.validationMessages, true);
      return;
    } else {
      this.saveCustomerSelection();
    }
  }

  createLead() {
    const data = {
      RequestType: 1,
      MakeId: this.leadDetails.MakeId,
      MakeName: this.leadDetails.MakeName,
      ModelId: this.leadDetails.ModelId,
      ModelName: this.leadDetails.ModelName,
      Location: this.leadDetails.Location,
      FuelType: this.leadDetails.FuelType,
      Latitude: this.leadDetails.Latitude,
      Longitude: this.leadDetails.Longitude,
      MobileNo: this.customerDetail.CustomerMobileNo,
      LeadSource: 'QFC',
      Utm_Source: 'cross-sale',
      Utm_Medium: '',
      ProductId: this.crossSaleForm.value.ProductId,
      ProductName: this.productObj.ProductName
    };

    return new Promise((resolve, reject) => {
      this.leadService.insertLeadDetails(data).subscribe(
        (res) => {
          console.log(res);
          this.globalService.successResponse(`New LeadId : ${res.data.LeadId}`);
          return resolve(res.data);
        },
        (err) => {
          console.error(err);
          return reject(err);
        }
      );
    })
  }



  async saveCustomerSelection() {
    const data = await this.createLead();

    const customerSelection = {
      LeadId: this.leadDetails.LeadId,
      SelectionId: this.crossSaleForm.value.SelectionId,
      ProductId: this.crossSaleForm.value.ProductId,
      SelectedBy: this.userDetails.UserId,
      SelectionByType: 'u'
    };
    console.log(customerSelection);

    this.leadService.insertCustomerSelection(customerSelection).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error(err);
      }
    )
  }


  changeProducts(productId) {
    const data = this.products.filter(product => {
      return product.ProductId == productId;
    });
    this.productObj = data[0];
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpParams } from "@angular/common/http";
import { UserConfig, GlobalService } from '../../services/global.service';
import { AssignmentService } from '../assignment.service';

import { MasterService } from '../../services/master.service';

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.css']
})
export class LeadComponent implements OnInit {

  userDetails: UserConfig;
  filterForm: FormGroup;
  leads: any;
  agents: any;
  selectedAgent: any;
  selectedLeadIds: any = [];
  products: any;
  productId: any = '';

  pagination = {
    collectionSize: null,
    pageSize: null,
    page: null,
    totalPages: null
  };
  currentStatusId = 1;
  leadType = [
    'QFC',
    'PBRef',
    'IB',
    'Both'
  ];

  leadAssign = [
    { id: '', name: 'Both' },
    { id: 0, name: 'Not Assigned' },
    { id: 1, name: 'Assigned' }
  ]

  constructor(private globalService: GlobalService,
    private fb: FormBuilder,
    private assignmentService: AssignmentService,
    private router: Router,
    private masterService: MasterService) {
    this.filterForm = this.fb.group({
      isassigned: [''],
      productid:['']
    });

  }

  ngOnInit() {
    this.userDetails = this.globalService.getUserCredential()['userData'];
    this.getUnassignedLeads();
    // this.getAllAgents();
    this.getProductMaster();
  }

  getUnassignedLeads() {
    let params = new HttpParams();
    params = params
      .set("isassigned", this.filterForm.value.isassigned)
      .set('productid',this.filterForm.value.productid);

    console.log(params,'params');

    this.assignmentService.getUnassignedLeads(params).subscribe(
      (res) => {
        this.leads = res.data;
        this.selectedLeadIds = [];
      },
      (err) => {
        console.error(err);
      }
    )
  }

  // getAllAgents() {
  //   this.assignmentService.getAllAgents().subscribe(
  //     (res) => {
  //       this.agents = res.data;
  //     },
  //     (err) => {
  //       console.error(err);
  //     }
  //   )
  // }

  assignLeads() {
    if (this.selectedAgent == "") {
      this.globalService.errorResponse('Please select an agent');
    }
    else if (!this.selectedLeadIds.length) {
      this.globalService.errorResponse('Please select some leads to assign');
    }
    else {
      let body = {
        AssignBy: this.userDetails.UserId,
        AssignTo: parseInt(this.selectedAgent),
        LeadIds: this.selectedLeadIds
      }
      this.assignmentService.assignLeads(body).subscribe(
        (res) => {
          this.globalService.successResponse(res.message);
          this.selectedAgent = "";
          this.getUnassignedLeads();
        },
        (err) => {
          console.error(err)
        }
      )
    }
  }

  addLeadId(id) {
    let pos = this.selectedLeadIds.indexOf(id);
    pos == -1 ? this.selectedLeadIds.push(id) : this.selectedLeadIds.splice(pos, 1);
  }

  updateAgent(event) {
    this.selectedAgent = event.target.value;
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

  getUserByProductMapping() {
    this.assignmentService.getUserByProductMapping(this.filterForm.value.productid).subscribe(
      (res) => {
        this.agents = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  updateAgentnLeads(){
    this.getUserByProductMapping();
    this.getUnassignedLeads();
  }


}

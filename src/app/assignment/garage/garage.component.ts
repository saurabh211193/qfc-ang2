import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserConfig, GlobalService } from '../../services/global.service';
import { AssignmentService } from '../assignment.service';
import { MasterService } from '../../services/master.service';

@Component({
  selector: 'app-garage',
  templateUrl: './garage.component.html',
  styleUrls: ['./garage.component.css']
})
export class GarageComponent implements OnInit {

  userDetails: UserConfig;
  filterForm: FormGroup;
  garages: any;
  agents: any;
  cities: any;
  selectedCity: any = "ALL";
  selectedAgent: any = "";
  selectedGarages: any = [];
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

  constructor(private globalService: GlobalService,
    private fb: FormBuilder,
    private assignmentService: AssignmentService,
    private masterService: MasterService,
    private router: Router) { }

  ngOnInit() {
    this.userDetails = this.globalService.getUserCredential()['userData'];
    this.getUnassignedGarages();
    this.getAllAgents();
    this.getAllCities();
  }

  getUnassignedGarages() {
    this.selectedGarages = [];
    this.assignmentService.getUnassignedGarages(this.selectedCity).subscribe(
      (res) => {
        this.garages = res.data;
        console.log(1234, this.garages);
      }
    )
  }

  getAllAgents() {
    this.assignmentService.getAllAgents().subscribe(
      (res) => {
        this.agents = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getAllCities() {
    this.masterService.getAllCities().subscribe(
      (res) => {
        this.cities = res.data;
      },
      (err) => {
        console.error(err);
      }
    )
  }

  getGaragesOnCityFilter() {
    // this.garages = this.garages.filter(e => e.City.toUpperCase() == this.selectedCity.toUpperCase());
    // console.log(5555, this.selectedCity, this.garages);
    this.getUnassignedGarages();
  }

  assignGarages() {
    if (this.selectedAgent == "") {
      alert('Please select an agent')
    }
    else if (!this.selectedGarages.length) {
      alert('Please select some garages to assign')
    }
    else {
      let body = {
        AssignBy: this.userDetails.UserId,
        AssignTo: parseInt(this.selectedAgent),
        GarageIds: this.selectedGarages
      }
      this.assignmentService.assignGarages(body).subscribe(
        (res) => {
          alert(res.message);
          this.selectedAgent = "";
          this.getUnassignedGarages();
        },
        (err) => {
          console.error(err)
        }
      )
    }
  }

  addGarageId(id) {
    let pos = this.selectedGarages.indexOf(id);
    pos == -1 ? this.selectedGarages.push(id) : this.selectedGarages.splice(pos, 1);
  }

  getGarageDetail(id) {
    this.router.navigate([`/dashboard/garage/detail/${btoa(id)}`]);
  }

}

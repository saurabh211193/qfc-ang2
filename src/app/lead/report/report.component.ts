import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { ExportToCsv } from 'export-to-csv';

import { MasterService } from '../../services/master.service';
import { LeadService } from './../lead.service';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  reportForm: FormGroup;
  statusMaster: any;

  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private leadService: LeadService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    this.getStatusMaster();
    this.buildForm();
  }

  getStatusMaster() {
    this.masterService.getAllStatus(1).subscribe(
      res => {
        this.statusMaster = res.data;
      },
      err => {
        console.error(err);
      }
    );
  }

  buildForm() {
    this.reportForm = this.fb.group({
      statusid: ['', Validators.compose([Validators.required])],
      createdonstart: ['', Validators.compose([Validators.required])],
      createdonend: ['', Validators.compose([Validators.required])]
    });
  }

  setParams() {
    let params = new HttpParams();
    params = params
      .set('statusid', this.reportForm.value.statusid)
      .set('createdonstart', this.reportForm.value.createdonstart)
      .set('createdonend', this.reportForm.value.createdonend);

    return params;
  }

  getReportData() {
    const params = this.setParams();
    console.log(this.reportForm.value, params);
    this.leadService.getAllLeadReport(params).subscribe(
      res => {
        console.log(res.data);
        if (!res.data.length) {
          this.globalService.errorResponse('No Data');
        }
        this.downloadCsv(res.data);
      },
      err => {
        console.error(err);
      }
    );
  }

  downloadCsv(data) {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: `result_leads`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      filename: `result_leads`
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(data);
  }
}

import { Component, ViewContainerRef, ViewChild } from '@angular/core';

import { DynamicComponentService } from './shared/dynamic-component.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('dclWrapper', { read: ViewContainerRef })
  dclWrapper: ViewContainerRef;

  constructor() {

  }
  ngOnInit() {

  }

  ngAfterViewInit() {
    DynamicComponentService.dclWrapper = this.dclWrapper;
  }
}

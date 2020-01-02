import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { DynamicComponentService, DynamicComponentData } from '../dynamic-component.service';


export class AlertDialogOptions {
  title = 'Alert Title';
  message = 'Alert Message';
  confirmText = 'Confirm';
  cancelText = 'Cancel';
  canCancel = true;
  cancelOnBackdrop = true;
}


@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent implements OnInit, OnDestroy, DynamicComponentData {

  options: AlertDialogOptions = new AlertDialogOptions();
  @Input() data: AlertDialogOptions;
  @Input() notifier$: Subject<any>;
  constructor(private popupService: DynamicComponentService) {
  }

  ngOnInit() {
    Object.assign(this.options, this.data);
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
    if (!this.options.cancelOnBackdrop) {
      return;
    }
    this.cancel();
  }

  ngOnDestroy() {

  }

}

export interface AlertDialogOptionsI {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  canCancel?: boolean;
  animation?: boolean;
  cancelOnBackdrop?: boolean;
}

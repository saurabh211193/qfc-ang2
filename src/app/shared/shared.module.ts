import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { QfcHeaderComponent } from './qfc-header/qfc-header.component';
import { QfcFooterComponent } from './qfc-footer/qfc-footer.component';
import { QfcInputComponent } from './qfc-input/qfc-input.component';
import { QfcLoaderComponent } from './qfc-loader/qfc-loader.component';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { CommentsComponent } from '../components/comments/comments.component';
import { DialerCallComponent } from '../components/dialer-call/dialer-call.component';

import { DynamicComponentService } from './dynamic-component.service';
import { LoaderService } from './loader.service';

import { DisableControlDirective } from '../directives/disable-control.directive';

@NgModule({
  declarations: [
    QfcHeaderComponent,
    QfcFooterComponent,
    QfcInputComponent,
    QfcLoaderComponent,
    AlertDialogComponent,
    CommentsComponent,
    DialerCallComponent,

    DisableControlDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    QfcHeaderComponent,
    QfcFooterComponent,
    QfcInputComponent,
    QfcLoaderComponent,
    AlertDialogComponent,
    CommentsComponent,
    DialerCallComponent,

    DisableControlDirective
  ],
  providers: [DynamicComponentService, LoaderService],
  entryComponents: [AlertDialogComponent]
})
export class SharedModule { }

import { NgModule } from '@angular/core';

import { UserReportRoutingModule } from './user-report-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ListingComponent } from './listing/listing.component';
import { DetailComponent } from './detail/detail.component';

import { RoleModalComponent } from './role-modal/role-modal.component';
import { UiWidgetsModule } from '../ui-widgets/ui-widgets.module';

@NgModule({
  declarations: [ListingComponent, DetailComponent, RoleModalComponent],
  imports: [
    UserReportRoutingModule,
    SharedModule,
    UiWidgetsModule
  ],
  entryComponents: [RoleModalComponent]
})
export class UserReportModule { }

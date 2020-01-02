import { NgModule } from '@angular/core';

import { LeadRoutingModule } from './lead-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UiWidgetsModule } from '../ui-widgets/ui-widgets.module';

import { ListingComponent } from './listing/listing.component';
import { DetailComponent } from './detail/detail.component';

import { LeadService } from './lead.service';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { LeadDetailComponent } from './lead-detail/lead-detail.component';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { SelectionDetailComponent } from './selection-detail/selection-detail.component';
import { GarageListModalComponent } from './garage-list-modal/garage-list-modal.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { PickupContactComponent } from './pickup-contact/pickup-contact.component';
import { BookingModalComponent } from './booking-modal/booking-modal.component';

// import { DisableControlDirective } from '../directives/disable-control.directive';
import { MaskPipe } from '../pipes/mask.pipe';
import { CrossSaleComponent } from './cross-sale/cross-sale.component';
import { DisclosureComponent } from './disclosure/disclosure.component';
import { ReportComponent } from './report/report.component';

@NgModule({
  declarations: [ListingComponent,
    DetailComponent,
    CustomerDetailComponent,
    LeadDetailComponent,
    BookingDetailComponent,
    SelectionDetailComponent,
    GarageListModalComponent,
    AuditTrailComponent,
    PickupContactComponent,
    BookingModalComponent,
    DisclosureComponent,

    // DisableControlDirective
    MaskPipe,

    CrossSaleComponent,

    ReportComponent
  ],
  imports: [
    LeadRoutingModule,
    SharedModule,
    UiWidgetsModule
  ],
  exports: [],
  entryComponents: [GarageListModalComponent, AuditTrailComponent, PickupContactComponent, BookingModalComponent, DisclosureComponent],
  providers: [LeadService]
})
export class LeadModule { }

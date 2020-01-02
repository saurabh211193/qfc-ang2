import { NgModule } from '@angular/core';

import { GarageRoutingModule } from './garage-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UiWidgetsModule } from '../ui-widgets/ui-widgets.module';

import { ListingComponent } from './listing/listing.component';
import { DetailComponent } from './detail/detail.component';

import { GarageService } from './garage.service';
import { CreateComponent } from './create/create.component';
import { AgreementsComponent } from './agreements/agreements.component';

@NgModule({
  declarations: [ListingComponent,
    DetailComponent,
    CreateComponent,
    AgreementsComponent],

  imports: [
    GarageRoutingModule,
    SharedModule,
    UiWidgetsModule
  ],
  exports: [DetailComponent],
  providers: [GarageService]
})
export class GarageModule { }

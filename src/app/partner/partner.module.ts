import { NgModule } from '@angular/core';

import { PartnerRoutingModule } from './partner-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GarageModule } from '../garage/garage.module';
import { UiWidgetsModule } from '../ui-widgets/ui-widgets.module';

import { GarageComponent } from './garage/garage.component';

@NgModule({
  declarations: [GarageComponent],
  imports: [
    PartnerRoutingModule,
    SharedModule,
    GarageModule,
    UiWidgetsModule
  ]
})
export class PartnerModule { }

import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AssignmentRoutingModule } from './assignment-routing.module';

import { GarageComponent } from './garage/garage.component';
import { LeadComponent } from './lead/lead.component';
import { AssignmentService } from './assignment.service';

@NgModule({
  declarations: [
    GarageComponent,
    LeadComponent
  ],
  imports: [
    AssignmentRoutingModule,
    SharedModule
  ],
  providers: [AssignmentService]
})
export class AssignmentModule { }

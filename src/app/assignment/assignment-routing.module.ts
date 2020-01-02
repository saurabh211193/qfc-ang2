import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GarageComponent } from './garage/garage.component';
import { LeadComponent } from './lead/lead.component';

const routes: Routes = [
  { path: '', redirectTo: 'lead', pathMatch: 'full' },
  { path: 'lead', component: LeadComponent },
  { path: 'garage', component: GarageComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AssignmentRoutingModule { }

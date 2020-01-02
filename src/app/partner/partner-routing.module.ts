import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GarageComponent } from './garage/garage.component';

const routes: Routes = [
  { path: '', redirectTo: ':garageid', pathMatch: 'full' },
  { path: ':garageid', component: GarageComponent }
]
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PartnerRoutingModule { }

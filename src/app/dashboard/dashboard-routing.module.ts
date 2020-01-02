import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { dashboardRoutes } from './dashboard-routes';

import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, children: dashboardRoutes }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

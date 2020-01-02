import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav.component';

import { UiWidgetsModule } from '../ui-widgets/ui-widgets.module';
@NgModule({
  declarations: [DashboardComponent, SidebarNavComponent],
  imports: [
    DashboardRoutingModule,
    SharedModule,
    UiWidgetsModule
  ],
  entryComponents: []
})
export class DashboardModule { }

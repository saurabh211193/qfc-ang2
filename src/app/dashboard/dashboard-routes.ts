import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  { path: '', redirectTo: 'lead', pathMatch: 'full' },
  { path: 'garage', loadChildren: '../garage/garage.module#GarageModule' },
  { path: 'lead', loadChildren: '../lead/lead.module#LeadModule' },
  { path: 'user-report', loadChildren: '../user-report/user-report.module#UserReportModule' },
  { path: 'assignment', loadChildren: '../assignment/assignment.module#AssignmentModule' },
];

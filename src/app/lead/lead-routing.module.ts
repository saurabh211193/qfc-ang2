import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ListingComponent } from "./listing/listing.component";
import { DetailComponent } from "./detail/detail.component";
import { ReportComponent } from "./report/report.component";

const routes: Routes = [
  { path: "", redirectTo: "list/:userid", pathMatch: "full" },
  { path: "list/:userid/:statusid", component: ListingComponent },
  { path: "detail/:leadid", component: DetailComponent },
  { path: "detail-claim/:leadid", component: DetailComponent },
  { path: "report", component: ReportComponent }
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadRoutingModule { }

import { NgModule } from '@angular/core';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { SharedModule } from '../shared/shared.module';

import { PaginationComponent } from './pagination/pagination.component';
import { MultiselectDropdownComponent } from './multiselect-dropdown/multiselect-dropdown.component';
import { from } from 'rxjs';
@NgModule({
  declarations: [PaginationComponent, MultiselectDropdownComponent],
  imports: [
    SharedModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  exports: [PaginationComponent, MultiselectDropdownComponent]
})
export class UiWidgetsModule { }

import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';

import { LoginComponent } from './login/login.component';

import { UserService } from './user.service';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    UserRoutingModule,
    SharedModule,
  ],
  providers: [UserService]
})
export class UserModule { }

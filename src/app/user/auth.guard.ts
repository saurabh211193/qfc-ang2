import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { GlobalService } from '../services/global.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private globalService: GlobalService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.globalService.getUserCredential() || window.location.href.indexOf('detail-claim') > -1) return true;
    this.globalService.deleteUserCredential();
    this.router.navigate(['']);
    return false;
  }
}

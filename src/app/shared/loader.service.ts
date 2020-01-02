import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable()
export class LoaderService {

  private loader = new Subject<boolean>();
  loaderSubject$ = this.loader.asObservable();
  constructor() { }

  show() {
    this.loader.next(true);
  }

  hide() {
    this.loader.next(false);
  }
}

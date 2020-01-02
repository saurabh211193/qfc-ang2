import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-qfc-loader',
  templateUrl: './qfc-loader.component.html',
  styleUrls: ['./qfc-loader.component.css']
})
export class QfcLoaderComponent implements OnInit, OnDestroy {

  isActive: boolean;
  private loaderSub$: Subscription;
  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.loaderSubject$.subscribe((isActive: boolean) => {
      this.isActive = isActive;
    })
  }

  ngOnDestroy() {
    this.loaderSub$.unsubscribe();
  }


}

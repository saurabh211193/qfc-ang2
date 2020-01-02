import { Injectable, ViewContainerRef, Type, Component, ComponentFactoryResolver, ElementRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { PlatformLocation } from '@angular/common';

@Injectable()
export class DynamicComponentService {

  static dclWrapper: ViewContainerRef;
  static primaryWrapper: ElementRef;
  viewContainerRef: ViewContainerRef;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver) { }

  public loadComponent(com: Type<DynamicComponentData>,
    data?: any, options?: DynamicComponentOptions): Observable<any> {
    const comFactory = this._componentFactoryResolver.resolveComponentFactory(com);
    this.viewContainerRef = DynamicComponentService.dclWrapper;
    this.viewContainerRef.clear();
    const comRef = this.viewContainerRef.createComponent(comFactory);

    const observer = new Subject<any>();
    observer.asObservable().subscribe(() => { }, () => { },
      () => {
        this.viewContainerRef.clear();
        // this.showPrimary();
      }
    );

    if (options && options.hidePrimary) {
      const el = DynamicComponentService.primaryWrapper.nativeElement;
      el.style.display = 'none';
    }

    if (data) {
      comRef.instance.data = JSON.parse(JSON.stringify(data));
    }
    comRef.instance.notifier$ = observer;

    return observer.asObservable();
  }

  showPrimary() {
    const el = DynamicComponentService.primaryWrapper.nativeElement;
    el.style.display = 'block';
  }

}

export abstract class DynamicComponentData {
  data?: any;
  notifier$?: Subject<any>;
}

export class DynamicComponentOptions {
  hidePrimary: boolean;
  constructor() {
    this.hidePrimary = false;
  }
}

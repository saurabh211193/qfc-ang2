import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupContactComponent } from './pickup-contact.component';

describe('PickupContactComponent', () => {
  let component: PickupContactComponent;
  let fixture: ComponentFixture<PickupContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickupContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

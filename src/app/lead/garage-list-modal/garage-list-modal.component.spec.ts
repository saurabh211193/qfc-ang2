import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GarageListModalComponent } from './garage-list-modal.component';

describe('GarageListModalComponent', () => {
  let component: GarageListModalComponent;
  let fixture: ComponentFixture<GarageListModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GarageListModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GarageListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QfcInputComponent } from './qfc-input.component';

describe('QfcInputComponent', () => {
  let component: QfcInputComponent;
  let fixture: ComponentFixture<QfcInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QfcInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QfcInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

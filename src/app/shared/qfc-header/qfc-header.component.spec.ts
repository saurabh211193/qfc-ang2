import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QfcHeaderComponent } from './qfc-header.component';

describe('QfcHeaderComponent', () => {
  let component: QfcHeaderComponent;
  let fixture: ComponentFixture<QfcHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QfcHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QfcHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

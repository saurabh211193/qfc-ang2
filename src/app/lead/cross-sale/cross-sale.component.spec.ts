import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossSaleComponent } from './cross-sale.component';

describe('CrossSaleComponent', () => {
  let component: CrossSaleComponent;
  let fixture: ComponentFixture<CrossSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrossSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

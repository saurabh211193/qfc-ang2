import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QfcFooterComponent } from './qfc-footer.component';

describe('QfcFooterComponent', () => {
  let component: QfcFooterComponent;
  let fixture: ComponentFixture<QfcFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QfcFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QfcFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QfcLoaderComponent } from './qfc-loader.component';

describe('QfcLoaderComponent', () => {
  let component: QfcLoaderComponent;
  let fixture: ComponentFixture<QfcLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QfcLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QfcLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

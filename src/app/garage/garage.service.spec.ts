import { TestBed } from '@angular/core/testing';

import { GarageService } from './garage.service';

describe('GarageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GarageService = TestBed.get(GarageService);
    expect(service).toBeTruthy();
  });
});

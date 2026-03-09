import { TestBed } from '@angular/core/testing';

import { Couriers } from './couriers';

describe('Couriers', () => {
  let service: Couriers;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Couriers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

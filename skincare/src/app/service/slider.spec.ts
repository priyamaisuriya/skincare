import { TestBed } from '@angular/core/testing';

import { Slider } from './slider';

describe('Slider', () => {
  let service: Slider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Slider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { SumOperationService } from './sum-operation.service';

describe('SumOperationService', () => {
  let service: SumOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SumOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

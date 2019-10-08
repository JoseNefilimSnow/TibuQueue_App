import { TestBed } from '@angular/core/testing';

import { ApilinkService } from './apilink.service';

describe('ApilinkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApilinkService = TestBed.get(ApilinkService);
    expect(service).toBeTruthy();
  });
});

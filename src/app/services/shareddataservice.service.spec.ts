import { TestBed } from '@angular/core/testing';

import { ShareddataserviceService } from './shareddataservice.service';

describe('ShareddataserviceService', () => {
  let service: ShareddataserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareddataserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

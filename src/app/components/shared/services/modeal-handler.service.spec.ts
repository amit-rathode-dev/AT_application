import { TestBed } from '@angular/core/testing';

import { ModealHandlerService } from './modeal-handler.service';

describe('ModealHandlerService', () => {
  let service: ModealHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModealHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

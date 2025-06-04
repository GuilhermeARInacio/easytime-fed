import { TestBed } from '@angular/core/testing';

import { PontoService } from './ponto.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PontoService', () => {
  let service: PontoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PontoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';

describe('UsuarioService', () => {
  let service: UsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

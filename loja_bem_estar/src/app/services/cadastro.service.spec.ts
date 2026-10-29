import { TestBed } from '@angular/core/testing';
import { Cadastro } from './cadastro.service';

describe('Cadastro', () => {
  let service: Cadastro;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cadastro);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

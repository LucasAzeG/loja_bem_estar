import { TestBed } from '@angular/core/testing';
import { Administracao } from './administracao';

describe('Administracao', () => {
  let service: Administracao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Administracao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

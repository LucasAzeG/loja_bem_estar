import { TestBed } from '@angular/core/testing';
import { ProdutoSevice } from './produto.service';

describe('ProdutoSevice', () => {
  let service: ProdutoSevice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdutoSevice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { EntradaProdutoService } from './entrada-produto.service';

describe('EntradaProdutoService', () => {
  let service: EntradaProdutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntradaProdutoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

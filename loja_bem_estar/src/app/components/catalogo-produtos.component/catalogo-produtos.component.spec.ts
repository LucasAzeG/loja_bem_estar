import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogoProdutosComponent } from './catalogo-produtos.component';

describe('CatalogoProdutosComponent', () => {
  let component: CatalogoProdutosComponent;
  let fixture: ComponentFixture<CatalogoProdutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoProdutosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogoProdutosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

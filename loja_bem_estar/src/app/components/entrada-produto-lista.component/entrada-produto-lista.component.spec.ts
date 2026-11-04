import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntradaProdutoListaComponent } from './entrada-produto-lista.component';

describe('EntradaProdutoListaComponent', () => {
  let component: EntradaProdutoListaComponent;
  let fixture: ComponentFixture<EntradaProdutoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradaProdutoListaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EntradaProdutoListaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

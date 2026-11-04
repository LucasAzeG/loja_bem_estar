import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntradaProdutoCadastroComponent } from './entrada-produto-cadastro.component';

describe('EntradaProdutoCadastroComponent', () => {
  let component: EntradaProdutoCadastroComponent;
  let fixture: ComponentFixture<EntradaProdutoCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradaProdutoCadastroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EntradaProdutoCadastroComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

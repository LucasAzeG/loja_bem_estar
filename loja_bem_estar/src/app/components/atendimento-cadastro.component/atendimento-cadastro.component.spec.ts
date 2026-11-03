import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtendimentoCadastroComponent } from './atendimento-cadastro.component';

describe('AtendimentoCadastroComponent', () => {
  let component: AtendimentoCadastroComponent;
  let fixture: ComponentFixture<AtendimentoCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtendimentoCadastroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AtendimentoCadastroComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

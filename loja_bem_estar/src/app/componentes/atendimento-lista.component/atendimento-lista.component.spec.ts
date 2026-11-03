import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtendimentoListaComponent } from './atendimento-lista.component';

describe('AtendimentoListaComponent', () => {
  let component: AtendimentoListaComponent;
  let fixture: ComponentFixture<AtendimentoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtendimentoListaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AtendimentoListaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

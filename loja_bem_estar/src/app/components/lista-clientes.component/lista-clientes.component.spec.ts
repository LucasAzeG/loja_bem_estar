import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaClientesComponent } from './lista-clientes.component';

describe('ListaClientesComponent', () => {
  let component: ListaClientesComponent;
  let fixture: ComponentFixture<ListaClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaClientesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaClientesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

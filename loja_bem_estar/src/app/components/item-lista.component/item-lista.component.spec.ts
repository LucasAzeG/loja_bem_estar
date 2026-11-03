import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemListaComponent } from './item-lista.component';

describe('ItemListaComponent', () => {
  let component: ItemListaComponent;
  let fixture: ComponentFixture<ItemListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemListaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemListaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

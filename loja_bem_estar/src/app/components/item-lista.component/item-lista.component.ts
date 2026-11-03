import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-item-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './item-lista.component.html',
  styleUrl: './item-lista.component.css'
})
export class ItemListaComponent implements OnInit {
  itemService = inject(ItemService);
  categoriaService = inject(CategoriaService);

  // Signal para guardar a categoria selecionada (0 = Todas)
  categoriaSelecionadaId = signal<number>(0);

  // Computa a lista filtrada automaticamente
  itensFiltrados = computed(() => {
    const idCat = Number(this.categoriaSelecionadaId());
    const lista = this.itemService.itens();

    if (!idCat || idCat === 0) {
      return lista;
    }
    return lista.filter(item => item.idcategoria === idCat);
  });

  ngOnInit(): void {
    this.itemService.carregarItens();
    this.categoriaService.carregarCategorias();
  }

  obterNomeCategoria(idcategoria: number): string {
    const cat = this.categoriaService.categorias().find(c => c.idcategoria === idcategoria);
    return cat ? cat.categoria : 'Sem Categoria';
  }

  aoMudarFiltro(event: Event): void {
    const valor = (event.target as HTMLSelectElement).value;
    this.categoriaSelecionadaId.set(Number(valor));
  }
}
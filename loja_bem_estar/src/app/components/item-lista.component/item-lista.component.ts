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

  // Signal para guardar o ID pesquisado
  buscaId = signal<number | null>(null);

  // Computa a lista filtrada por ID e/ou por Categoria automaticamente
  itensFiltrados = computed(() => {
    const idCat = Number(this.categoriaSelecionadaId());
    const idBusca = this.buscaId();
    let lista = this.itemService.itens();

    // Filtra por ID se algum número for digitado
    if (idBusca && idBusca > 0) {
      lista = lista.filter(item => item.iditem === idBusca);
    }

    // Filtra por Categoria se selecionada
    if (idCat && idCat !== 0) {
      lista = lista.filter(item => item.idcategoria === idCat);
    }

    return lista;
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

  aoMudarBuscaId(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.buscaId.set(valor ? Number(valor) : null);
  }

  // Alterna o status do item entre 'S' (Ativo) e 'N' (Inativo)
  alternarStatus(item: any): void {
    const novoStatus = item.ativo_produto_servico === 'S' ? 'N' : 'S';
    
    // Atualização reativa imediata na propriedade do objeto
    item.ativo_produto_servico = novoStatus;

    // Se o seu ItemService possuir método de alteração HTTP, ele é acionado aqui:
    if (typeof (this.itemService as any).alterarStatus === 'function') {
      (this.itemService as any).alterarStatus(item.iditem, novoStatus);
    }
  }
}
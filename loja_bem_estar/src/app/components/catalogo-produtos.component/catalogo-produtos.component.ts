import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { CategoriaService } from '../../services/categoria.service';
import { ProdutoCatalogo } from '../../models/produto';
import { Categoria } from '../../models/categoria';

@Component({
  selector: 'app-catalogo-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './catalogo-produtos.component.html',
  styleUrl: './catalogo-produtos.component.css'
})
export class CatalogoProdutosComponent implements OnInit {
  produtoService = inject(ProdutoService);
  categoriaService = inject(CategoriaService);

  categoriaSelecionadaId = signal<number>(0);

  produtosFiltrados = computed(() => {
    const idCat = Number(this.categoriaSelecionadaId());
    const lista = this.produtoService.produtos();

    if (!idCat || idCat === 0) {
      return lista;
    }
    return lista.filter((p: ProdutoCatalogo) => p.idCategoria === idCat);
  });

  ngOnInit(): void {
    this.produtoService.carregarProdutos();
    this.categoriaService.carregarCategorias();
  }

  obterNomeCategoria(idcategoria: number): string {
    const cat = this.categoriaService.categorias().find((c: Categoria) => c.idcategoria === idcategoria);
    return cat?.categoria ?? 'Sem Categoria';
  }

  aoMudarFiltro(event: Event): void {
    const valor = (event.target as HTMLSelectElement).value;
    this.categoriaSelecionadaId.set(Number(valor));
  }
}
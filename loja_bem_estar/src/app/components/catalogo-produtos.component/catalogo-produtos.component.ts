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
  buscaId = signal<number | null>(null);

  produtosFiltrados = computed(() => {
    const idCat = Number(this.categoriaSelecionadaId());
    const idBusca = this.buscaId();
    let lista = this.produtoService.produtos();

    // Filtra por ID do Item ou Código de Preço (RF02)
    if (idBusca && idBusca > 0) {
      lista = lista.filter((p: ProdutoCatalogo) => p.iditem === idBusca || p.codigoPreco === idBusca);
    }

    // Filtra por Categoria
    if (idCat && idCat !== 0) {
      lista = lista.filter((p: ProdutoCatalogo) => p.idCategoria === idCat);
    }

    return lista;
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

  aoMudarBuscaId(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.buscaId.set(valor ? Number(valor) : null);
  }

  // Verifica se o produto está ativo (suporta 'S', true ou 1)
  isAtivo(prod: any): boolean {
    const status = prod?.ativoItem ?? prod?.ativo ?? 'S';
    return status === 'S' || status === true || status === 1;
  }

  // Alterna o status entre Ativado/Desativado
  alternarStatus(prod: any): void {
    const novoStatus = this.isAtivo(prod) ? 'N' : 'S';
    const id = prod.iditem || prod.codigoPreco;

    // Atualiza localmente no objeto
    if ('ativoItem' in prod) prod.ativoItem = novoStatus;
    if ('ativo' in prod) prod.ativo = novoStatus === 'S';

    // Chama o serviço se houver integração HTTP implementada
    if (typeof (this.produtoService as any).alterarStatus === 'function') {
      (this.produtoService as any).alterarStatus(id, novoStatus);
    }
  }
}
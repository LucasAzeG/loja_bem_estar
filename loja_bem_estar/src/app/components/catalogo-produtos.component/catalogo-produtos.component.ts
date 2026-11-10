import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { CategoriaService } from '../../services/categoria.service';
import { CarrinhoService } from '../../services/carrinho.service';
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
  carrinhoService = inject(CarrinhoService);
  private router = inject(Router);

  categoriaSelecionadaId = signal<number>(0);
  buscaId = signal<number | null>(null);

  produtosFiltrados = computed(() => {
    const idCat = Number(this.categoriaSelecionadaId());
    const idBusca = this.buscaId();
    let lista = this.produtoService.produtos();

    if (idBusca && idBusca > 0) {
      lista = lista.filter((p: ProdutoCatalogo) => (p.iditem ?? p.codigoPreco) === idBusca);
    }

    if (idCat && idCat !== 0) {
      lista = lista.filter((p: ProdutoCatalogo) => p.idCategoria === idCat);
    }

    return lista;
  });

  ngOnInit(): void {
    this.produtoService.carregarProdutos();
    this.categoriaService.carregarCategorias();
  }

  adicionarAoCarrinho(prod: any, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Captura prioritariamente o ID de chave primária real do banco de dados (iditem / idItem / id)
    const idItem = prod.iditem || prod.idItem || prod.id || prod.codigoPreco;
    const nome = prod.item || prod.descricaoItem || 'Produto';
    const preco = prod.precoVenda || prod.preco || 0;

    this.carrinhoService.adicionarItem({
      idItem: Number(idItem),
      item: nome,
      idFuncionario: 0,
      nomeFuncionario: 'A definir',
      quantidade: 1,
      valorUnitario: Number(preco)
    });

    // Permanece no catálogo sem navegar para o carrinho automaticamente
  }

  obterNomeCategoria(idcategoria: number): string {
    const cat = this.categoriaService.categorias().find(
      (c: Categoria) => (c.idcategoria ?? (c as any).idCategoria) === idcategoria
    );
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

  isAtivo(prod: any): boolean {
    const status = prod?.ativoItem ?? prod?.ativo ?? 'S';
    return status === 'S' || status === true || status === 1;
  }

  alternarStatus(prod: any, event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    const novoStatus = this.isAtivo(prod) ? 'N' : 'S';
    const id = prod.iditem || prod.idItem || prod.id || prod.codigoPreco;

    if ('ativoItem' in prod) prod.ativoItem = novoStatus;
    if ('ativo' in prod) prod.ativo = novoStatus === 'S';

    if (typeof (this.produtoService as any).alterarStatus === 'function') {
      (this.produtoService as any).alterarStatus(id, novoStatus);
    }
  }
}
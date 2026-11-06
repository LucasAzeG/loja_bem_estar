import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-item-lista',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './item-lista.component.html',
  styleUrl: './item-lista.component.css'
})
export class ItemListaComponent implements OnInit {
  itemService = inject(ItemService);
  categoriaService = inject(CategoriaService);

  termoBuscaId: string = '';
  termoBuscaNome: string = '';
  categoriaSelecionada: string = 'TODAS';
  tipoSelecionado: string = 'TODOS';

  categorias: any[] = [];

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    if (typeof (this.itemService as any).carregarItens === 'function') {
      (this.itemService as any).carregarItens();
    }

    const catService = this.categoriaService as any;
    if (typeof catService.obterTodas === 'function') {
      catService.obterTodas().subscribe({
        next: (res: any) => this.categorias = res,
        error: (err: any) => console.error('Erro ao carregar categorias:', err)
      });
    } else if (typeof catService.categorias === 'function') {
      this.categorias = catService.categorias();
    }
  }

  getIdItem(item: any): number {
    return Number(item?.iditem ?? item?.idItem ?? item?.id ?? 0);
  }

  isAtivo(item: any): boolean {
    const status = item?.ativoItem ?? item?.ativo ?? item?.status ?? 'S';
    return status === 'S' || status === true || status === 1;
  }

  /**
   * Identifica se o item é um Produto de forma abrangente e flexível
   */
  isProduto(item: any): boolean {
    if (!item) return true;

    const val = (
      item.tipoItem ?? 
      item.tipo ?? 
      item.tipo_item ?? 
      item.flgTipo ?? 
      item.tipoItemEnum ?? 
      ''
    ).toString().trim().toUpperCase();

    if (val === 'S' || val === 'SERVICO' || val === 'SERVIÇO' || val === 'SERVICE' || val === '2') {
      return false;
    }

    if (val === 'P' || val === 'PRODUTO' || val === 'PRODUCT' || val === '1') {
      return true;
    }

    if (typeof item.isProduto === 'boolean') return item.isProduto;
    if (typeof item.isServico === 'boolean') return !item.isServico;

    const nome = (item.item || item.nomeItem || item.nome || '').toString().toLowerCase();
    if (
      nome.includes('serviço') || 
      nome.includes('servico') || 
      nome.includes('formatação') || 
      nome.includes('formatacao') || 
      nome.includes('manutenção') || 
      nome.includes('manutencao')
    ) {
      return false;
    }

    return true;
  }

  limparFiltros(): void {
    this.termoBuscaId = '';
    this.termoBuscaNome = '';
    this.categoriaSelecionada = 'TODAS';
    this.tipoSelecionado = 'TODOS';
  }

  get itensFiltrados(): any[] {
    const service = this.itemService as any;
    let lista: any[] = typeof service.itens === 'function' ? service.itens() : (service.itensList || []);

    // 1. Filtro por ID
    if (this.termoBuscaId.trim()) {
      lista = lista.filter(item => {
        const idStr = this.getIdItem(item).toString();
        return idStr.includes(this.termoBuscaId.trim());
      });
    }

    // 2. Filtro por Nome do Item (insensível a maiúsculas/minúsculas)
    if (this.termoBuscaNome.trim()) {
      const termo = this.termoBuscaNome.trim().toLowerCase();
      lista = lista.filter(item => {
        const nome = (item?.item || item?.nomeItem || item?.nome || '').toString().toLowerCase();
        const desc = (item?.descricao || item?.descricaoItem || '').toString().toLowerCase();
        return nome.includes(termo) || desc.includes(termo);
      });
    }

    // 3. Filtro por Categoria
    if (this.categoriaSelecionada && this.categoriaSelecionada !== 'TODAS') {
      lista = lista.filter(item => {
        const catId = (item?.idcategoria ?? item?.idCategoria ?? item?.categoria?.idcategoria ?? item?.categoria?.idCategoria ?? '').toString();
        const catNome = (item?.categoria?.nomeCategoria ?? item?.nomeCategoria ?? item?.categoria ?? '').toString();
        return catId === this.categoriaSelecionada || catNome === this.categoriaSelecionada;
      });
    }

    // 4. Filtro por Tipo (Produto / Serviço)
    if (this.tipoSelecionado && this.tipoSelecionado !== 'TODOS') {
      lista = lista.filter(item => {
        const ehProduto = this.isProduto(item);
        if (this.tipoSelecionado === 'PRODUTO') return ehProduto;
        if (this.tipoSelecionado === 'SERVICO') return !ehProduto;
        return true;
      });
    }

    return lista;
  }

  toggleStatusItem(item: any): void {
    const id = this.getIdItem(item);
    if (!id) return;

    const service = this.itemService as any;

    if (typeof service.toggleStatus === 'function') {
      service.toggleStatus(id).subscribe({
        next: () => this.carregarDados(),
        error: (err: any) => console.error('Erro ao alterar status:', err)
      });
    } else if (typeof service.alternarStatus === 'function') {
      service.alternarStatus(id).subscribe({
        next: () => this.carregarDados(),
        error: (err: any) => console.error('Erro ao alterar status:', err)
      });
    }
  }
}
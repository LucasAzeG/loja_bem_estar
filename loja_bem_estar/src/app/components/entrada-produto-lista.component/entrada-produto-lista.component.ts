import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EntradaProdutoService } from '../../services/entrada-produto.service';

@Component({
  selector: 'app-entrada-produto-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './entrada-produto-lista.component.html',
  styleUrl: './entrada-produto-lista.component.css'
})
export class EntradaProdutoListaComponent implements OnInit {
  private http = inject(HttpClient);
  private entradaService = inject(EntradaProdutoService);

  estoqueItens: any[] = [];
  historicoEntradas: any[] = [];

  ngOnInit(): void {
    this.carregarEstoque();
    this.carregarEntradas();
  }

  private extrairArray(dados: any): any[] {
    if (!dados) return [];
    if (Array.isArray(dados)) return dados;
    if (Array.isArray(dados.$values)) return dados.$values;
    return [];
  }

  carregarEstoque(): void {
    this.http.get<any>('https://localhost:7126/api/Estoque').subscribe({
      next: (dados) => {
        this.estoqueItens = this.extrairArray(dados);
      },
      error: (err) => console.error('Erro ao carregar estoque:', err)
    });
  }

  carregarEntradas(): void {
    this.entradaService.obterEntradas().subscribe({
      next: (dados) => {
        this.historicoEntradas = this.extrairArray(dados);
      },
      error: (err) => console.error('Erro ao carregar entradas:', err)
    });
  }

  // Leitura das propriedades do EstoqueDTO
  getItemId(item: any): number {
    return Number(item?.iditem ?? item?.idItem ?? item?.id ?? 0);
  }

  getItemNome(item: any): string {
    return item?.nomeItem ?? item?.item ?? `Produto #${this.getItemId(item)}`;
  }

  getQuantidade(item: any): number {
    return Number(item?.quantidadeEstoque ?? item?.quantidade_estoque ?? 0);
  }

  // Leitura do Histórico de Entradas
  getEntradaId(ent: any): number {
    return Number(ent?.identradaProduto ?? ent?.identrada_produto ?? ent?.id ?? 0);
  }

  getEntradaData(ent: any): string {
    return ent?.dataEntradaProduto ?? ent?.data_entrada_produto ?? '-';
  }

  getEntradaIdItem(ent: any): number {
    return Number(ent?.iditem ?? ent?.idItem ?? 0);
  }

  getEntradaQtd(ent: any): number {
    return Number(ent?.quantidadeEntrada ?? ent?.quantidade_entrada ?? 0);
  }

  getEntradaUnidade(ent: any): string {
    return ent?.unidade ?? 'UN';
  }

  getEntradaValor(ent: any): number {
    return Number(ent?.valorUnitarioEntrada ?? ent?.valor_unitario_entrada ?? 0);
  }

  getNomeProduto(iditem: number): string {
    const item = this.estoqueItens.find(i => this.getItemId(i) === Number(iditem));
    return item ? this.getItemNome(item) : `Produto #${iditem}`;
  }
}
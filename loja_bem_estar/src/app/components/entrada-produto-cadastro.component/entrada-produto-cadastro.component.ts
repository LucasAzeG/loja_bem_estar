import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EntradaProdutoService } from '../../services/entrada-produto.service';

@Component({
  selector: 'app-entrada-produto-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './entrada-produto-cadastro.component.html',
  styleUrl: './entrada-produto-cadastro.component.css'
})
export class EntradaProdutoCadastroComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private entradaService = inject(EntradaProdutoService);

  produtos: any[] = [];
  produtoSelecionado: any = null;

  dataEntradaProduto: string = new Date().toISOString().substring(0, 10);
  quantidadeEntrada: number = 1;
  unidade: string = 'UN';
  valorUnitarioEntrada: number = 0;

  ngOnInit(): void {
    this.carregarProdutos();
  }

  private extrairArray(dados: any): any[] {
    if (!dados) return [];
    if (Array.isArray(dados)) return dados;
    if (Array.isArray(dados.$values)) return dados.$values;
    return [];
  }

  carregarProdutos(): void {
    this.http.get<any>('https://localhost:7126/api/ProdutoItem').subscribe({
      next: (dados) => this.produtos = this.extrairArray(dados),
      error: () => {
        this.http.get<any>('https://localhost:7126/api/Item').subscribe({
          next: (d) => this.produtos = this.extrairArray(d)
        });
      }
    });
  }

  getItemId(p: any): number {
    if (!p) return 0;

    // 1. Teste direto das chaves mais comuns de ID
    const idDireto = p.idItem ?? p.iditem ?? p.id ?? p.idProduto ?? p.idproduto ?? p.id_item ?? p.idServico ?? p.idItemService;
    if (idDireto !== undefined && idDireto !== null && !isNaN(Number(idDireto)) && Number(idDireto) > 0) {
      return Number(idDireto);
    }

    // 2. Busca dinâmica por qualquer propriedade no objeto que contenha "id" e valor numérico maior que zero
    for (const key of Object.keys(p)) {
      if (key.toLowerCase().includes('id')) {
        const val = Number(p[key]);
        if (!isNaN(val) && val > 0) {
          return val;
        }
      }
    }

    return 0;
  }

  getItemNome(p: any): string {
    if (!p) return 'Produto';
    return p.item ?? p.descricaoItem ?? p.nome ?? p.nomeItem ?? p.descricao ?? p.servico ?? `Item #${this.getItemId(p)}`;
  }

  getItemPreco(p: any): number {
    if (!p) return 0;
    return Number(p.precoVenda ?? p.preco ?? p.valorUnitario ?? p.valor ?? 0);
  }

  aoMudarProduto(): void {
    if (this.produtoSelecionado) {
      this.valorUnitarioEntrada = this.getItemPreco(this.produtoSelecionado);
    }
  }

  guardarEntrada(): void {
    if (!this.produtoSelecionado) {
      alert('Selecione um produto na lista.');
      return;
    }

    const selectedId = this.getItemId(this.produtoSelecionado);

    if (!selectedId || selectedId === 0) {
      console.error('Objeto selecionado sem ID:', this.produtoSelecionado);
      alert(`O item "${this.getItemNome(this.produtoSelecionado)}" não possui um ID válido na base de dados.\nPropriedades do objeto: ${Object.keys(this.produtoSelecionado).join(', ')}`);
      return;
    }

    if (this.quantidadeEntrada <= 0) {
      alert('A quantidade deve ser maior que zero.');
      return;
    }

    const payload: any = {
      iditem: selectedId,
      idItem: selectedId,
      dataEntradaProduto: this.dataEntradaProduto ? this.dataEntradaProduto.substring(0, 10) : new Date().toISOString().substring(0, 10),
      quantidadeEntrada: Number(this.quantidadeEntrada),
      unidade: (this.unidade || 'UN').trim().substring(0, 10),
      valorUnitarioEntrada: Number(this.valorUnitarioEntrada)
    };

    this.entradaService.adicionarEntrada(payload).subscribe({
      next: () => this.router.navigate(['/estoque']),
      error: (err) => {
        console.error('Erro detalhado da API:', err);
        const detalhe = err?.error?.detail || err?.error?.title || err?.error || err?.message || 'Erro interno 500 no servidor';
        alert(`Erro ao registar entrada:\n${typeof detalhe === 'object' ? JSON.stringify(detalhe) : detalhe}`);
      }
    });
  }
}
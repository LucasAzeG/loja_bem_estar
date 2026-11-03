import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProdutoCatalogo } from '../models/produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7126/api/ProdutoItem';

  private produtosSignal = signal<ProdutoCatalogo[]>([]);
  readonly produtos = this.produtosSignal.asReadonly();

  carregarProdutos(): void {
    this.http.get<ProdutoCatalogo[]>(this.apiUrl).subscribe({
      next: (dados: ProdutoCatalogo[]) => this.produtosSignal.set(dados),
      error: (err: unknown) => console.error('Erro ao carregar catálogo de produtos:', err)
    });
  }
}
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Categoria } from '../models/categoria';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http = inject(HttpClient);
  // Atualizado para a rota exata do backend
  private readonly apiUrl = 'https://localhost:7126/api/Categorium';

  private categoriasSignal = signal<Categoria[]>([]);
  readonly categorias = this.categoriasSignal.asReadonly();

  carregarCategorias(): void {
    this.http.get<Categoria[]>(this.apiUrl).subscribe({
      next: (dados) => this.categoriasSignal.set(dados),
      error: (err) => console.error('Erro ao buscar categorias:', err)
    });
  }

  obterPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  adicionarCategoria(novaCategoria: Omit<Categoria, 'idcategoria'>): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, novaCategoria).pipe(
      tap(() => this.carregarCategorias())
    );
  }

  atualizarCategoria(categoriaAtualizada: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${categoriaAtualizada.idcategoria}`, categoriaAtualizada).pipe(
      tap(() => this.carregarCategorias())
    );
  }
}
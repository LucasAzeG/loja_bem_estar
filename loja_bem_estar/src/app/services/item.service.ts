import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7126/api/Item';

  private itensSignal = signal<Item[]>([]);
  readonly itens = this.itensSignal.asReadonly();

  carregarItens(): void {
    this.http.get<Item[]>(this.apiUrl).subscribe({
      next: (dados: Item[]) => this.itensSignal.set(dados),
      error: (err: any) => console.error('Erro ao buscar itens:', err)
    });
  }

  obterPorId(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`);
  }

  adicionarItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, item);
  }

  atualizarItem(item: Item): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/${item.iditem}`, item);
  }
}
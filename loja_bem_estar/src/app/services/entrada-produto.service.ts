import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EntradaProduto } from '../models/entrada-produto';

@Injectable({
  providedIn: 'root'
})
export class EntradaProdutoService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7126/api/EntradaProduto';

  obterEntradas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  adicionarEntrada(entrada: EntradaProduto): Observable<any> {
    return this.http.post<any>(this.apiUrl, entrada);
  }
}
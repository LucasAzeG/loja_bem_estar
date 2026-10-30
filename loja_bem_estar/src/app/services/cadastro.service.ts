import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../models/cadastro';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private http = inject(HttpClient);
  
  // URL correta capturada do seu Swagger UI
  private readonly apiUrl = 'https://localhost:7126/api/Pessoa';

  private clientesSignal = signal<Cliente[]>([]);
  readonly clientes = this.clientesSignal.asReadonly();

  carregarClientes(): void {
    this.http.get<Cliente[]>(this.apiUrl).subscribe({
      next: (dados) => this.clientesSignal.set(dados),
      error: (err) => console.error('Erro ao buscar clientes no banco:', err)
    });
  }

  obterPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  adicionarCliente(novoCliente: Omit<Cliente, 'idpessoa'>): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, novoCliente).pipe(
      tap(() => this.carregarClientes())
    );
  }

  atualizarCliente(clienteAtualizado: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${clienteAtualizado.idpessoa}`, clienteAtualizado).pipe(
      tap(() => this.carregarClientes())
    );
  }
}
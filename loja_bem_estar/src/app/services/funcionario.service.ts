import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario } from '../models/funcionario';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7126/api/Funcionario';

  private funcionariosSignal = signal<Funcionario[]>([]);
  readonly funcionarios = this.funcionariosSignal.asReadonly();

  carregarFuncionarios(): void {
    this.http.get<Funcionario[]>(this.apiUrl).subscribe({
      next: (dados: Funcionario[]) => this.funcionariosSignal.set(dados),
      error: (err: unknown) => console.error('Erro ao carregar funcionários:', err)
    });
  }

  obterPorId(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.apiUrl}/${id}`);
  }

  adicionarFuncionario(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.post<Funcionario>(this.apiUrl, funcionario);
  }

  atualizarFuncionario(id: number, funcionario: Funcionario): Observable<Funcionario> {
    return this.http.put<Funcionario>(`${this.apiUrl}/${id}`, funcionario);
  }
}
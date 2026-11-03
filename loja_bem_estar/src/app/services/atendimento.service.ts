import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Atendimento } from '../models/atendimento';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7126/api/Atendimento';

  private atendimentosSignal = signal<Atendimento[]>([]);
  readonly atendimentos = this.atendimentosSignal.asReadonly();

  carregarAtendimentos(): void {
    this.http.get<Atendimento[]>(this.apiUrl).subscribe({
      next: (dados: Atendimento[]) => this.atendimentosSignal.set(dados),
      error: (err: unknown) => console.error('Erro ao carregar atendimentos:', err)
    });
  }

  obterPorId(id: number): Observable<Atendimento> {
    return this.http.get<Atendimento>(`${this.apiUrl}/${id}`);
  }

  adicionarAtendimento(atendimento: Atendimento): Observable<Atendimento> {
    return this.http.post<Atendimento>(this.apiUrl, atendimento);
  }
}
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AtendimentoService } from '../../services/atendimento.service';
import { Atendimento, AtendimentoItem } from '../../models/atendimento';

@Component({
  selector: 'app-atendimento-lista',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './atendimento-lista.component.html',
  styleUrl: './atendimento-lista.component.css'
})
export class AtendimentoListaComponent implements OnInit {
  atendimentoService = inject(AtendimentoService);

  // Propriedades vinculadas ao formulário e controle de pesquisa por ID
  termoInput: string = '';
  termoAplicado: string = '';

  ngOnInit(): void {
    this.atendimentoService.carregarAtendimentos();
  }

  buscar(): void {
    this.termoAplicado = this.termoInput.trim();
  }

  limparBusca(): void {
    this.termoInput = '';
    this.termoAplicado = '';
  }

  // Getter reativo com tratamento seguro de propriedades opcionais (evita TS2551 e TS2339)
  get atendimentosFiltrados(): Atendimento[] {
    const lista = this.atendimentoService.atendimentos();

    if (!this.termoAplicado) {
      return lista;
    }

    return lista.filter(atend => {
      const objetoGenerico = atend as any;
      const id = atend.idAtendimento ?? objetoGenerico.idatendimento ?? objetoGenerico.id ?? 0;
      return id.toString().includes(this.termoAplicado);
    });
  }

  calcularTotal(itens: AtendimentoItem[]): number {
    if (!itens) return 0;
    return itens.reduce((acc, item) => acc + (item.quantidade * item.valorUnitario), 0);
  }

  excluirAtendimento(id?: number): void {
    if (!id) return;

    if (confirm('Tem certeza de que deseja excluir este atendimento?')) {
      const service = this.atendimentoService as any;

      if (typeof service.excluirAtendimento === 'function') {
        service.excluirAtendimento(id).subscribe({
          next: () => this.atendimentoService.carregarAtendimentos(),
          error: (err: any) => console.error('Erro ao excluir atendimento:', err)
        });
      } else if (typeof service.deletarAtendimento === 'function') {
        service.deletarAtendimento(id).subscribe({
          next: () => this.atendimentoService.carregarAtendimentos(),
          error: (err: any) => console.error('Erro ao excluir atendimento:', err)
        });
      }
    }
  }
}
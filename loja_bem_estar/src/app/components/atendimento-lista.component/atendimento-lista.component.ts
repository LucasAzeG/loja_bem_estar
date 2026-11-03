import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AtendimentoService } from '../../services/atendimento.service';
import { AtendimentoItem } from '../../models/atendimento';

@Component({
  selector: 'app-atendimento-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './atendimento-lista.component.html',
  styleUrl: './atendimento-lista.component.css'
})
export class AtendimentoListaComponent implements OnInit {
  atendimentoService = inject(AtendimentoService);

  ngOnInit(): void {
    this.atendimentoService.carregarAtendimentos();
  }

  calcularTotal(itens: AtendimentoItem[]): number {
    if (!itens) return 0;
    return itens.reduce((acc, item) => acc + (item.quantidade * item.valorUnitario), 0);
  }
}
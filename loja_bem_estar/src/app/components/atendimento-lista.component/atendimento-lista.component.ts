import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AtendimentoService } from '../../services/atendimento.service';
import { CadastroService } from '../../services/cadastro.service';
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
  cadastroService = inject(CadastroService);

  // Propriedades vinculadas ao formulário e controle de pesquisa por ID e Cliente
  termoInput: string = '';
  termoAplicado: string = '';
  idClienteSelecionado: number = 0;

  ngOnInit(): void {
    this.atendimentoService.carregarAtendimentos();
    this.cadastroService.carregarClientes();
  }

  buscar(): void {
    this.termoAplicado = this.termoInput.trim();
  }

  limparBusca(): void {
    this.termoInput = '';
    this.termoAplicado = '';
    this.idClienteSelecionado = 0;
  }

  getCliId(cli: any): number {
    return Number(cli?.idpessoa ?? cli?.idPessoa ?? cli?.id ?? 0);
  }

  getCliNome(cli: any): string {
    return cli?.nome ?? cli?.pessoa?.nome ?? 'Cliente';
  }

  getCliCpf(cli: any): string {
    return cli?.cpf ?? cli?.pessoa?.cpf ?? '';
  }

  get atendimentosFiltrados(): Atendimento[] {
    let lista = this.atendimentoService.atendimentos();

    // Filtro por ID do Atendimento
    if (this.termoAplicado) {
      lista = lista.filter(atend => {
        const objetoGenerico = atend as any;
        const id = atend.idAtendimento ?? objetoGenerico.idatendimento ?? objetoGenerico.id ?? 0;
        return id.toString().includes(this.termoAplicado);
      });
    }

    // Filtro por Cliente selecionado no dropdown
    const idCliente = Number(this.idClienteSelecionado);
    if (idCliente > 0) {
      lista = lista.filter(atend => {
        const objetoGenerico = atend as any;
        const idCliAtend = Number(atend.idPessoa ?? objetoGenerico.idpessoa ?? objetoGenerico.pessoa?.idPessoa ?? objetoGenerico.pessoa?.idpessoa ?? 0);
        return idCliAtend === idCliente;
      });
    }

    return lista;
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
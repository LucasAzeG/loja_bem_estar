import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CadastroService } from '../../services/cadastro.service';
import { Cliente } from '../../models/cadastro';

@Component({
  selector: 'app-lista-clientes',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './lista-clientes.component.html',
  styleUrl: './lista-clientes.component.css'
})
export class ListaClientesComponent implements OnInit {
  cadastroService = inject(CadastroService);

  termoInput: string = '';
  termoAplicado: string = '';

  ngOnInit(): void {
    this.cadastroService.carregarClientes();
  }

  getIdPessoa(cliente: any): number {
    return Number(cliente?.idPessoa ?? cliente?.idpessoa ?? cliente?.id ?? 0);
  }

  buscar(): void {
    this.termoAplicado = this.termoInput.trim();
  }

  limparBusca(): void {
    this.termoInput = '';
    this.termoAplicado = '';
  }

  get clientesFiltrados(): Cliente[] {
    const lista = this.cadastroService.clientes();

    if (!this.termoAplicado) {
      return lista;
    }

    return lista.filter(cliente => {
      const idStr = this.getIdPessoa(cliente).toString();
      return idStr.includes(this.termoAplicado);
    });
  }

  excluirCliente(id: number): void {
    if (!id) return;

    if (confirm('Tem certeza de que deseja excluir este cliente?')) {
      this.cadastroService.excluirCliente(id).subscribe({
        next: () => {
          this.cadastroService.carregarClientes();
        },
        error: (err: any) => console.error('Erro ao excluir cliente no backend:', err)
      });
    }
  }
}
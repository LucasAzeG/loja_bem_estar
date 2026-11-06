import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FuncionarioService } from '../../services/funcionario.service';

@Component({
  selector: 'app-funcionario-lista',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './funcionario-lista.component.html',
  styleUrl: './funcionario-lista.component.css'
})
export class FuncionarioListaComponent implements OnInit {
  funcionarioService = inject(FuncionarioService);

  termoInput: string = '';
  termoAplicado: string = '';

  ngOnInit(): void {
    this.funcionarioService.carregarFuncionarios();
  }

  getIdFuncionario(func: any): number {
    return Number(func?.idpessoa ?? func?.pessoa?.idPessoa ?? func?.idPessoa ?? func?.idfuncionario ?? func?.idFuncionario ?? 0);
  }

  buscar(): void {
    this.termoAplicado = this.termoInput.trim();
  }

  limparBusca(): void {
    this.termoInput = '';
    this.termoAplicado = '';
  }

  get funcionariosFiltrados(): any[] {
    const lista = this.funcionarioService.funcionarios();

    if (!this.termoAplicado) {
      return lista;
    }

    return lista.filter(func => {
      const idStr = this.getIdFuncionario(func).toString();
      return idStr.includes(this.termoAplicado);
    });
  }

  excluirFuncionario(id: number): void {
    if (!id) return;

    if (confirm('Tem certeza de que deseja excluir este funcionário?')) {
      if (typeof (this.funcionarioService as any).excluirFuncionario === 'function') {
        (this.funcionarioService as any).excluirFuncionario(id).subscribe({
          next: () => this.funcionarioService.carregarFuncionarios(),
          error: (err: any) => console.error('Erro ao excluir funcionário:', err)
        });
      } else if (typeof (this.funcionarioService as any).deletarFuncionario === 'function') {
        (this.funcionarioService as any).deletarFuncionario(id).subscribe({
          next: () => this.funcionarioService.carregarFuncionarios(),
          error: (err: any) => console.error('Erro ao excluir funcionário:', err)
        });
      }
    }
  }
}
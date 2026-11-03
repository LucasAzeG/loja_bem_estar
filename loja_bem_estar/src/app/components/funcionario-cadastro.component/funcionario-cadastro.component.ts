import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FuncionarioService } from '../../services/funcionario.service';
import { Funcionario } from '../../models/funcionario';

@Component({
  selector: 'app-funcionario-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './funcionario-cadastro.component.html',
  styleUrl: './funcionario-cadastro.component.css'
})
export class FuncionarioCadastroComponent implements OnInit {
  funcionarioService = inject(FuncionarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  modoEdicao = false;
  idFuncionarioAtual?: number;

  funcionarioForm = {
    nome: '',
    cargo: '',
    dataAdmissao: new Date().toISOString().substring(0, 10),
    cpf: '',
    email: '',
    telefone: ''
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicao = true;
      this.idFuncionarioAtual = Number(id);
      this.funcionarioService.obterPorId(this.idFuncionarioAtual).subscribe({
        next: (dado: Funcionario) => {
          this.funcionarioForm.cargo = dado.cargo || '';
          if (dado.dataAdmissao) {
            this.funcionarioForm.dataAdmissao = dado.dataAdmissao.substring(0, 10);
          }
          if (dado.pessoa) {
            this.funcionarioForm.nome = dado.pessoa.nome || '';
            this.funcionarioForm.cpf = dado.pessoa.cpf ? String(dado.pessoa.cpf) : '';
            this.funcionarioForm.email = dado.pessoa.email || '';
            this.funcionarioForm.telefone = dado.pessoa.telefone ? String(dado.pessoa.telefone) : '';
          }
        },
        error: (err: unknown) => console.error('Erro ao buscar funcionário:', err)
      });
    }
  }

  salvar(): void {
    const cpfLimpo = this.funcionarioForm.cpf ? Number(this.funcionarioForm.cpf.replace(/\D/g, '')) : null;
    const telLimpo = this.funcionarioForm.telefone ? Number(this.funcionarioForm.telefone.replace(/\D/g, '')) : null;
    const dataFormatada = this.funcionarioForm.dataAdmissao ? `${this.funcionarioForm.dataAdmissao}T00:00:00` : new Date().toISOString();

    const payload: Funcionario = {
      cargo: this.funcionarioForm.cargo,
      dataAdmissao: dataFormatada,
      pessoa: {
        nome: this.funcionarioForm.nome,
        cpf: cpfLimpo,
        telefone: telLimpo,
        email: this.funcionarioForm.email || null,
        sexo: 'M',
        ativoPessoa: 'S',
        dataNascimento: '2000-01-01T00:00:00'
      }
    };

    if (this.modoEdicao && this.idFuncionarioAtual) {
      payload.idpessoa = this.idFuncionarioAtual;
      payload.pessoa!.idPessoa = this.idFuncionarioAtual;

      this.funcionarioService.atualizarFuncionario(this.idFuncionarioAtual, payload).subscribe({
        next: () => this.router.navigate(['/funcionarios']),
        error: (err: unknown) => console.error('Erro ao atualizar funcionário:', err)
      });
    } else {
      this.funcionarioService.adicionarFuncionario(payload).subscribe({
        next: () => this.router.navigate(['/funcionarios']),
        error: (err: unknown) => console.error('Erro ao adicionar funcionário:', err)
      });
    }
  }
}
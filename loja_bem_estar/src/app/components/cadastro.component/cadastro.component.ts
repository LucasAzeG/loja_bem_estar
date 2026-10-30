import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CadastroService } from '../../services/cadastro.service';
import { Cliente } from '../../models/cadastro';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent implements OnInit {
  cadastroForm: FormGroup;
  clienteId: number | null = null;
  isEdicao = false;

  private fb = inject(FormBuilder);
  private cadastroService = inject(CadastroService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern('^[0-9]*$')]],
      dataNascimento: ['', [Validators.required]],
      sexo: ['M', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      telefone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11), Validators.pattern('^[0-9]*$')]],
      ativoPessoa: ['S', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.clienteId = Number(idParam);
      this.isEdicao = true;
      this.cadastroService.obterPorId(this.clienteId).subscribe({
        next: (cliente) => this.cadastroForm.patchValue(cliente),
        error: (err) => console.error('Erro ao buscar cliente:', err)
      });
    }
  }

  onSubmit(): void {
    if (this.cadastroForm.invalid) return;

    if (this.isEdicao && this.clienteId) {
      const clienteAtualizado: Cliente = {
        ...this.cadastroForm.value,
        idpessoa: this.clienteId
      };
      this.cadastroService.atualizarCliente(clienteAtualizado).subscribe({
        next: () => this.router.navigate(['/clientes']),
        error: (err) => console.error('Erro ao atualizar no backend:', err)
      });
    } else {
      const dadosCliente: Cliente = this.cadastroForm.value;
      this.cadastroService.adicionarCliente(dadosCliente).subscribe({
        next: () => this.router.navigate(['/clientes']),
        error: (err) => console.error('Erro ao salvar no backend:', err)
      });
    }
  }
}
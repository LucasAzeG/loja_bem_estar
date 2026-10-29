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
      cpf: ['', [
        Validators.required, 
        Validators.minLength(11), 
        Validators.maxLength(11), 
        Validators.pattern('^[0-9]*$')
      ]],
      data_nascimento: ['', [Validators.required]],
      sexo: ['M', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      telefone: ['', [
        Validators.required, 
        Validators.minLength(10), 
        Validators.maxLength(11), 
        Validators.pattern('^[0-9]*$')
      ]],
      ativo_pessoa: ['S', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.clienteId = Number(idParam);
      const cliente = this.cadastroService.obterPorId(this.clienteId);
      if (cliente) {
        this.isEdicao = true;
        this.cadastroForm.patchValue(cliente);
      }
    }
  }

  onSubmit(): void {
    if (this.cadastroForm.valid) {
      if (this.isEdicao && this.clienteId) {
        const clienteAtualizado: Cliente = {
          ...this.cadastroForm.value,
          idpessoa: this.clienteId
        };
        this.cadastroService.atualizarCliente(clienteAtualizado);
      } else {
        const dadosCliente: Cliente = this.cadastroForm.value;
        this.cadastroService.adicionarCliente(dadosCliente);
      }
      this.router.navigate(['/clientes']);
    }
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CadastroService } from '../../services/cadastro.service';
import { Cliente } from '../../models/cadastro';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  cadastroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cadastroService: CadastroService,
    private router: Router
  ) {
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

  onSubmit(): void {
    if (this.cadastroForm.valid) {
      const dadosCliente: Cliente = this.cadastroForm.value;
      this.cadastroService.adicionarCliente(dadosCliente);
      this.router.navigate(['/clientes']);
    }
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FuncionarioService } from '../../services/funcionario.service';

@Component({
  selector: 'app-funcionario-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './funcionario-lista.component.html',
  styleUrl: './funcionario-lista.component.css'
})
export class FuncionarioListaComponent implements OnInit {
  funcionarioService = inject(FuncionarioService);

  ngOnInit(): void {
    this.funcionarioService.carregarFuncionarios();
  }
}
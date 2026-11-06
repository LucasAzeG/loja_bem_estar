import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-administracao',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './administracao.component.html',
  styleUrl: './administracao.component.css'
})
export class AdministracaoComponent {}
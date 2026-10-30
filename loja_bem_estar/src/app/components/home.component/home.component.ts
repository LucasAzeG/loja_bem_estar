import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  categoriaService = inject(CategoriaService);
  categoriaSelecionada = signal<number | null>(null);

  ngOnInit(): void {
    this.categoriaService.carregarCategorias();
  }

  selecionarCategoria(id?: number): void {
    if (this.categoriaSelecionada() === id) {
      this.categoriaSelecionada.set(null);
    } else {
      this.categoriaSelecionada.set(id ?? null);
    }
  }
}
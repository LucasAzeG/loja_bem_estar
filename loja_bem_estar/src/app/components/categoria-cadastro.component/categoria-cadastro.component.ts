import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria';

@Component({
  selector: 'app-categoria-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './categoria-cadastro.component.html',
  styleUrl: './categoria-cadastro.component.css'
})
export class CategoriaCadastroComponent implements OnInit {
  categoriaForm: FormGroup;
  categoriaId: number | null = null;
  isEdicao = false;

  private fb = inject(FormBuilder);
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.categoriaForm = this.fb.group({
      categoria: ['', [Validators.required, Validators.maxLength(35)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.categoriaId = Number(idParam);
      this.isEdicao = true;
      this.categoriaService.obterPorId(this.categoriaId).subscribe({
        next: (dados: Categoria) => this.categoriaForm.patchValue(dados),
        error: (err: unknown) => console.error('Erro ao buscar categoria:', err)
      });
    }
  }

  onSubmit(): void {
    if (this.categoriaForm.invalid) return;

    if (this.isEdicao && this.categoriaId) {
      const categoriaAtualizada: Categoria = {
        idcategoria: this.categoriaId,
        ...this.categoriaForm.value
      };
      this.categoriaService.atualizarCategoria(categoriaAtualizada).subscribe({
        next: () => this.router.navigate(['/categorias']),
        error: (err: unknown) => console.error('Erro ao atualizar categoria:', err)
      });
    } else {
      const novaCategoria: Categoria = this.categoriaForm.value;
      this.categoriaService.adicionarCategoria(novaCategoria).subscribe({
        next: () => this.router.navigate(['/categorias']),
        error: (err: unknown) => console.error('Erro ao cadastrar categoria:', err)
      });
    }
  }
}
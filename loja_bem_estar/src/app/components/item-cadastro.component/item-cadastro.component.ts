import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { CategoriaService } from '../../services/categoria.service';
import { Item } from '../../models/item';

@Component({
  selector: 'app-item-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './item-cadastro.component.html',
  styleUrl: './item-cadastro.component.css'
})
export class ItemCadastroComponent implements OnInit {
  itemService = inject(ItemService);
  categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  modoEdicao = false;

  itemForm: Item = {
    idcategoria: 0,
    item: '',
    descricao_item: '',
    preco: 0,
    tipo_item: 'P',
    ativo_produto_servico: 'S'
  };

  ngOnInit(): void {
    this.categoriaService.carregarCategorias();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicao = true;
      this.itemService.obterPorId(Number(id)).subscribe({
        next: (dado: Item) => this.itemForm = dado,
        error: (err: unknown) => console.error('Erro ao buscar item:', err)
      });
    }
  }

  salvar(): void {
    if (!this.itemForm.idcategoria || this.itemForm.idcategoria === 0) {
      alert('Selecione uma categoria válida!');
      return;
    }

    if (this.modoEdicao) {
      this.itemService.atualizarItem(this.itemForm).subscribe({
        next: () => this.router.navigate(['/itens']),
        error: (err: unknown) => console.error('Erro ao atualizar item:', err)
      });
    } else {
      this.itemService.adicionarItem(this.itemForm).subscribe({
        next: () => this.router.navigate(['/itens']),
        error: (err: unknown) => console.error('Erro ao adicionar item:', err)
      });
    }
  }
}
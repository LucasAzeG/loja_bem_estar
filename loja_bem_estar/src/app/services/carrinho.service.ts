import { Injectable, signal, computed } from '@angular/core';
import { Cliente } from '../models/cadastro';
import { AtendimentoItem } from '../models/atendimento';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  clienteSelecionado = signal<Cliente | null>(null);
  itens = signal<AtendimentoItem[]>([]);

  valorTotal = computed(() =>
    this.itens().reduce((acc, item) => acc + (item.valorUnitario * item.quantidade), 0)
  );

  selecionarCliente(cliente: Cliente | null): void {
    this.clienteSelecionado.set(cliente);
  }

  adicionarItem(novoItem: AtendimentoItem): void {
    const lista = this.itens();
    // Procura o item no carrinho comparando o idItem como número
    const index = lista.findIndex(i => Number(i.idItem) === Number(novoItem.idItem));

    if (index > -1) {
      const atualizada = [...lista];
      
      // Incrementa a quantidade
      atualizada[index].quantidade += Number(novoItem.quantidade || 1);

      // Se o profissional foi informado no formulário, atualiza o profissional do item
      if (novoItem.idFuncionario && Number(novoItem.idFuncionario) > 0) {
        atualizada[index].idFuncionario = Number(novoItem.idFuncionario);
        atualizada[index].nomeFuncionario = novoItem.nomeFuncionario;
        atualizada[index].cargo = novoItem.cargo;
      }

      // Garante que o valor unitário está atualizado
      if (novoItem.valorUnitario && Number(novoItem.valorUnitario) > 0) {
        atualizada[index].valorUnitario = Number(novoItem.valorUnitario);
      }

      this.itens.set(atualizada);
    } else {
      this.itens.set([
        ...lista,
        {
          ...novoItem,
          idItem: Number(novoItem.idItem),
          idFuncionario: Number(novoItem.idFuncionario || 0),
          quantidade: Number(novoItem.quantidade || 1),
          valorUnitario: Number(novoItem.valorUnitario || 0)
        }
      ]);
    }
  }

  removerItem(index: number): void {
    const atualizada = [...this.itens()];
    atualizada.splice(index, 1);
    this.itens.set(atualizada);
  }

  limpar(): void {
    this.clienteSelecionado.set(null);
    this.itens.set([]);
  }
}
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AtendimentoService } from '../../services/atendimento.service';
import { CadastroService } from '../../services/cadastro.service';
import { FuncionarioService } from '../../services/funcionario.service';
import { ItemService } from '../../services/item.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { AtendimentoItem } from '../../models/atendimento';

@Component({
  selector: 'app-atendimento-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './atendimento-cadastro.component.html',
  styleUrl: './atendimento-cadastro.component.css'
})
export class AtendimentoCadastroComponent implements OnInit {
  private router = inject(Router);
  atendimentoService = inject(AtendimentoService);
  cadastroService = inject(CadastroService);
  funcionarioService = inject(FuncionarioService);
  itemService = inject(ItemService);
  carrinhoService = inject(CarrinhoService);

  idPessoaSelecionada: number = 0;
  statusAtendimento: string = 'A';
  dataAtendimento: string = new Date().toISOString().substring(0, 10);

  precoBase: number = 0;

  itemTemp = {
    idItem: 0,
    idFuncionario: 0,
    quantidade: 1,
    valorUnitario: 0
  };

  ngOnInit(): void {
    this.cadastroService.carregarClientes();
    this.funcionarioService.carregarFuncionarios();
    this.itemService.carregarItens();

    if (this.carrinhoService.clienteSelecionado()) {
      const cli = this.carrinhoService.clienteSelecionado();
      this.idPessoaSelecionada = Number(cli?.idpessoa ?? (cli as any)?.idPessoa ?? 0);
    }
  }

  get itensAtendimento(): AtendimentoItem[] {
    return this.carrinhoService.itens();
  }

  getCliId(cli: any): number {
    return Number(cli?.idpessoa ?? cli?.idPessoa ?? cli?.id ?? 0);
  }

  getCliNome(cli: any): string {
    return cli?.nome ?? cli?.pessoa?.nome ?? 'Cliente';
  }

  getCliCpf(cli: any): string {
    return cli?.cpf ?? cli?.pessoa?.cpf ?? '-';
  }

  getItemId(item: any): number {
    return Number(item?.iditem ?? item?.idItem ?? item?.id ?? 0);
  }

  getItemName(item: any): string {
    return item?.item ?? item?.descricao_item ?? item?.descricaoItem ?? item?.nome ?? 'Item sem nome';
  }

  getItemPrice(item: any): number {
    return Number(item?.preco ?? item?.precoVenda ?? item?.valorUnitario ?? 0);
  }

  getFuncId(func: any): number {
    return Number(func?.idpessoa ?? func?.idPessoa ?? func?.pessoa?.idPessoa ?? func?.pessoa?.idpessoa ?? 0);
  }

  getFuncName(func: any): string {
    return func?.pessoa?.nome ?? func?.nome ?? 'Profissional';
  }

  getFuncCargo(func: any): string {
    return func?.cargo ?? '';
  }

  aoMudarItem(): void {
    const selectedId = Number(this.itemTemp.idItem);
    const itemSelected = this.itemService.itens().find(i => this.getItemId(i) === selectedId);
    
    if (itemSelected) {
      this.precoBase = this.getItemPrice(itemSelected);
      this.atualizarValorTemp();
    } else {
      this.precoBase = 0;
      this.itemTemp.valorUnitario = 0;
    }
  }

  aoMudarQuantidade(): void {
    if (!this.itemTemp.quantidade || this.itemTemp.quantidade < 1) {
      this.itemTemp.quantidade = 1;
    }
    this.atualizarValorTemp();
  }

  private atualizarValorTemp(): void {
    const qtd = Number(this.itemTemp.quantidade) || 1;
    this.itemTemp.valorUnitario = this.precoBase * qtd;
  }

  adicionarItemNaLista(): void {
    const idItem = Number(this.itemTemp.idItem);
    const idFunc = Number(this.itemTemp.idFuncionario);

    if (!idItem || idItem === 0) {
      alert('Selecione um item/serviço válido.');
      return;
    }

    const itemEncontrado = this.itemService.itens().find(i => this.getItemId(i) === idItem);
    const funcEncontrado = this.funcionarioService.funcionarios().find(f => this.getFuncId(f) === idFunc);
    const precoUnitario = this.getItemPrice(itemEncontrado);

    this.carrinhoService.adicionarItem({
      idItem: idItem,
      item: this.getItemName(itemEncontrado),
      idFuncionario: idFunc,
      nomeFuncionario: funcEncontrado ? this.getFuncName(funcEncontrado) : 'A definir',
      cargo: funcEncontrado ? this.getFuncCargo(funcEncontrado) : '',
      quantidade: Number(this.itemTemp.quantidade || 1),
      valorUnitario: Number(precoUnitario)
    });

    this.itemTemp = { idItem: 0, idFuncionario: 0, quantidade: 1, valorUnitario: 0 };
    this.precoBase = 0;
  }

  atualizarFuncionarioItem(index: number, idFuncNovo: any): void {
    const idFunc = Number(idFuncNovo);
    const funcEncontrado = this.funcionarioService.funcionarios().find(f => this.getFuncId(f) === idFunc);
    const lista = [...this.carrinhoService.itens()];
    
    if (lista[index]) {
      lista[index].idFuncionario = idFunc;
      lista[index].nomeFuncionario = funcEncontrado ? this.getFuncName(funcEncontrado) : 'A definir';
      lista[index].cargo = funcEncontrado ? this.getFuncCargo(funcEncontrado) : '';
      this.carrinhoService.itens.set(lista);
    }
  }

  removerItem(index: number): void {
    this.carrinhoService.removerItem(index);
  }

  calcularTotalGeral(): number {
    return this.carrinhoService.valorTotal();
  }

  salvarAtendimento(): void {
    const idPessoa = Number(this.idPessoaSelecionada);

    if (!idPessoa || idPessoa === 0) {
      alert('Selecione um cliente válido.');
      return;
    }

    if (this.itensAtendimento.length === 0) {
      alert('Adicione pelo menos um item ao carrinho antes de finalizar.');
      return;
    }

    const funcionariosLista = this.funcionarioService.funcionarios();
    const primeiroFuncId = funcionariosLista.length > 0 ? this.getFuncId(funcionariosLista[0]) : 1;
    const idFuncPadrao = Number(this.itemTemp.idFuncionario) > 0 ? Number(this.itemTemp.idFuncionario) : primeiroFuncId;

    const dataApenasData = this.dataAtendimento ? this.dataAtendimento.substring(0, 10) : new Date().toISOString().substring(0, 10);

    const payload: any = {
      idPessoa: idPessoa,
      idpessoa: idPessoa,
      dataAtendimento: dataApenasData,
      statusAtendimento: this.statusAtendimento || 'A',
      itens: this.itensAtendimento.map(it => {
        const nomeItemOriginal = (it.item || '').trim().toLowerCase();
        
        const itemDb = this.itemService.itens().find(i => {
          const idDb = this.getItemId(i);
          const nomeDb = this.getItemName(i).trim().toLowerCase();
          return idDb === Number(it.idItem) || (nomeItemOriginal.length > 0 && nomeDb === nomeItemOriginal);
        });
        
        const realIdItem = itemDb ? this.getItemId(itemDb) : Number(it.idItem);
        const idFuncOriginal = Number(it.idFuncionario);
        const idFuncFinal = idFuncOriginal > 0 ? idFuncOriginal : idFuncPadrao;

        return {
          idItem: realIdItem,
          iditem: realIdItem,
          idFuncionario: idFuncFinal,
          idfuncionario: idFuncFinal,
          quantidade: Number(it.quantidade),
          quantidadeItens: Number(it.quantidade),
          valorUnitario: Number(it.valorUnitario),
          valorunitarioEntrada: Number(it.valorUnitario)
        };
      })
    };

    this.atendimentoService.adicionarAtendimento(payload).subscribe({
      next: () => {
        this.carrinhoService.limpar();
        this.router.navigate(['/atendimentos']);
      },
      error: (err: any) => {
        console.error('Erro retornado pela API:', err.error);
        alert('Erro ao guardar atendimento. Verifique os dados selecionados.');
      }
    });
  }
}
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AtendimentoService } from '../../services/atendimento.service';
import { FuncionarioService } from '../../services/funcionario.service';
import { Atendimento, AtendimentoItem } from '../../models/atendimento';

@Component({
  selector: 'app-atendimento-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './atendimento-cadastro.component.html',
  styleUrl: './atendimento-cadastro.component.css'
})
export class AtendimentoCadastroComponent implements OnInit {
  /* ==========================================================================
     PROCESSO 1: Injeção de Serviços e Inicialização do Estado do Carrinho
     ========================================================================== */
  private http = inject(HttpClient);
  private router = inject(Router);
  atendimentoService = inject(AtendimentoService);
  funcionarioService = inject(FuncionarioService);

  // Dados do pedido / atendimento principal
  idPessoaSelecionada: number = 0;
  statusAtendimento: string = 'A'; // 'A' = Ativo / Agendado
  dataAtendimento: string = new Date().toISOString().substring(0, 10);

  // Listas de dados para preenchimento dos combos
  clientes: any[] = [];
  itensDisponiveis: any[] = [];
  funcionarios: any[] = [];
  
  // Lista temporária que armazena os produtos/serviços adicionados ao carrinho (RF05)
  itensAtendimento: AtendimentoItem[] = [];

  // Guarda o preço unitário individual do item selecionado sem a quantidade aplicada
  precoBase: number = 0;

  // Form temporário para o item selecionado atualmente no painel de inclusão
  itemTemp = {
    idItem: 0,
    idFuncionario: 0,
    quantidade: 1,
    valorUnitario: 0
  };

  ngOnInit(): void {
    // Carrega todas as dependências ao iniciar a tela de checkout
    this.carregarClientes();
    this.carregarFuncionarios();
    this.carregarItens();
  }

  /* ==========================================================================
     PROCESSO 2: Utilitários e Carregamento de Dados das APIs
     ========================================================================== */
  
  // Trata retornos flexíveis da API (Arrays puros ou envelopados com $values do EF Core)
  private extrairArray(dados: any): any[] {
    if (!dados) return [];
    if (Array.isArray(dados)) return dados;
    if (Array.isArray(dados.$values)) return dados.$values;
    return [];
  }

  // Busca lista de clientes para vincular ao carrinho
  carregarClientes(): void {
    this.http.get<any>('https://localhost:7126/api/Pessoa').subscribe({
      next: (dados) => this.clientes = this.extrairArray(dados),
      error: (err) => console.error('Erro ao carregar clientes:', err)
    });
  }

  // Busca lista de funcionários responsáveis
  carregarFuncionarios(): void {
    this.http.get<any>('https://localhost:7126/api/Funcionario').subscribe({
      next: (dados) => this.funcionarios = this.extrairArray(dados),
      error: () => this.funcionarioService.carregarFuncionarios()
    });
  }

  // Busca produtos e serviços com sistema de fallback em cascata para evitar erros de rota
  carregarItens(): void {
    this.http.get<any>('https://localhost:7126/api/ItemService').subscribe({
      next: (dados) => {
        const arr = this.extrairArray(dados);
        if (arr.length > 0) {
          this.itensDisponiveis = arr;
        } else {
          this.carregarItensFallback();
        }
      },
      error: () => this.carregarItensFallback()
    });
  }

  private carregarItensFallback(): void {
    this.http.get<any>('https://localhost:7126/api/Item').subscribe({
      next: (dados) => this.itensDisponiveis = this.extrairArray(dados),
      error: () => {
        this.http.get<any>('https://localhost:7126/api/ProdutoItem').subscribe({
          next: (d) => this.itensDisponiveis = this.extrairArray(d)
        });
      }
    });
  }

  /* ==========================================================================
     PROCESSO 3: Getters dinâmicos para suportar variações nos DTOs/Models
     ========================================================================== */
  getItemId(item: any): number {
    return Number(item?.idItem ?? item?.iditem ?? item?.id ?? 0);
  }

  getItemName(item: any): string {
    return item?.item ?? item?.descricaoItem ?? item?.nome ?? item?.nomeItem ?? 'Item sem nome';
  }

  getItemPrice(item: any): number {
    return Number(item?.precoVenda ?? item?.preco ?? item?.valorUnitario ?? 0);
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

  getCliId(cli: any): number {
    return Number(cli?.idPessoa ?? cli?.idpessoa ?? cli?.id ?? 0);
  }

  getCliNome(cli: any): string {
    return cli?.nome ?? cli?.pessoa?.nome ?? 'Cliente';
  }

  getCliCpf(cli: any): string {
    return cli?.cpf ?? cli?.pessoa?.cpf ?? '-';
  }

  /* ==========================================================================
     PROCESSO 4: Operações Dinâmicas do Carrinho de Compras (RF05)
     ========================================================================== */

  // Atualiza o precoBase e recalcula o valor total temporário ao selecionar um item
  aoMudarItem(): void {
    const selectedId = Number(this.itemTemp.idItem);
    const itemSelected = this.itensDisponiveis.find(i => this.getItemId(i) === selectedId);
    
    if (itemSelected) {
      this.precoBase = this.getItemPrice(itemSelected);
      this.atualizarValorTemp();
    } else {
      this.precoBase = 0;
      this.itemTemp.valorUnitario = 0;
    }
  }

  // Método acionado pelo evento (input) do campo de quantidade no HTML
  aoMudarQuantidade(): void {
    this.atualizarValorTemp();
  }

  // Calcula o valor acumulado (preço base * quantidade digitada)
  private atualizarValorTemp(): void {
    const qtd = Number(this.itemTemp.quantidade) || 1;
    this.itemTemp.valorUnitario = this.precoBase * qtd;
  }

  // Valida e insere o produto/serviço no carrinho de compras
  adicionarItemNaLista(): void {
    const idItem = Number(this.itemTemp.idItem);
    const idFunc = Number(this.itemTemp.idFuncionario);

    if (!idItem || idItem === 0) {
      alert('Selecione um item/serviço válido.');
      return;
    }

    if (!idFunc || idFunc === 0) {
      alert('Selecione um profissional responsável.');
      return;
    }

    if (this.itemTemp.quantidade <= 0) {
      alert('Informe uma quantidade maior que zero.');
      return;
    }

    const itemEncontrado = this.itensDisponiveis.find(i => this.getItemId(i) === idItem);
    const listaFuncs = this.funcionarios.length > 0 ? this.funcionarios : this.funcionarioService.funcionarios();
    const funcEncontrado = listaFuncs.find(f => this.getFuncId(f) === idFunc);

    // Adiciona o item formatado na lista acumuladora do carrinho
    this.itensAtendimento.push({
      idItem: idItem,
      item: this.getItemName(itemEncontrado),
      idFuncionario: idFunc,
      nomeFuncionario: this.getFuncName(funcEncontrado),
      cargo: this.getFuncCargo(funcEncontrado),
      quantidade: Number(this.itemTemp.quantidade),
      valorUnitario: Number(this.itemTemp.valorUnitario)
    });

    // Reseta o formulário de inclusão e a preço base para os próximos itens
    this.itemTemp = { idItem: 0, idFuncionario: 0, quantidade: 1, valorUnitario: 0 };
    this.precoBase = 0;
  }

  // Remove um item do carrinho com base no seu índice
  removerItem(index: number): void {
    this.itensAtendimento.splice(index, 1);
  }

  // Calcula o valor total geral somando todos os subtotais do carrinho
  calcularTotalGeral(): number {
    return this.itensAtendimento.reduce((acc, it) => acc + (it.quantidade * it.valorUnitario), 0);
  }

  /* ==========================================================================
     PROCESSO 5: Submissão e Persistência do Atendimento/Pedido no Backend
     ========================================================================== */
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

    // Formatação da data (apenas YYYY-MM-DD para compatibilidade com DateOnly/.NET 8)
    const dataApenasData = this.dataAtendimento ? this.dataAtendimento.substring(0, 10) : new Date().toISOString().substring(0, 10);

    // Montagem do payload completo com propriedades redundantes em camelCase e lowercase para prevenir discrepâncias de DTO
    const payload: any = {
      idPessoa: idPessoa,
      idpessoa: idPessoa,
      dataAtendimento: dataApenasData,
      statusAtendimento: this.statusAtendimento || 'A',
      itens: this.itensAtendimento.map(it => ({
        idItem: Number(it.idItem),
        iditem: Number(it.idItem),
        idFuncionario: Number(it.idFuncionario),
        idfuncionario: Number(it.idFuncionario),
        quantidade: Number(it.quantidade),
        quantidadeItens: Number(it.quantidade),
        valorUnitario: Number(it.valorUnitario),
        valorunitarioEntrada: Number(it.valorUnitario)
      }))
    };

    // Envio do pedido à API
    this.atendimentoService.adicionarAtendimento(payload).subscribe({
      next: () => this.router.navigate(['/atendimentos']),
      error: (err) => {
        console.error('Erro detalhado retornado pela API:', err.error);
        
        let detalhe = '';
        if (err.error?.errors) {
          detalhe = Object.entries(err.error.errors)
            .map(([campo, msgs]: [string, any]) => `${campo}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('\n');
        } else if (typeof err.error === 'string') {
          detalhe = err.error;
        } else if (err.error?.title) {
          detalhe = err.error.title;
        }

        alert(`Erro 400 ao guardar atendimento:\n${detalhe || 'Verifique o console para mais detalhes.'}`);
      }
    });
  }
}
export interface AtendimentoItem {
    idAtendimento?: number;
    idItem: number;
    item?: string;
    idFuncionario: number;
    nomeFuncionario?: string;
    cargo?: string;
    quantidade: number;
    valorUnitario: number;
  }
  
  export interface Atendimento {
    idAtendimento?: number;
    idPessoa: number;
    nomePessoa?: string;
    dataAtendimento: string;
    statusAtendimento: string;
    itens: AtendimentoItem[];
  }
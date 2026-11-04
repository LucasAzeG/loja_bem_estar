export interface EntradaProduto {
    identradaProduto?: number;
    iditem: number;
    dataEntradaProduto: string; // Formato 'YYYY-MM-DD' para compatibilidade com DateOnly
    quantidadeEntrada: number;
    unidade: string;
    valorUnitarioEntrada: number;
    nomeItem?: string;
  }
  
  export interface EstoqueItem {
    iditem: number;
    quantidadeEstoque: number;
    nomeItem?: string;
  }
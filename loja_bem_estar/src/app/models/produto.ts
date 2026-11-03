export interface ProdutoCatalogo {
    iditem?: number;
    idCategoria: number;
    codigoPreco: number;
    precoVenda: number;
    unidade: string;
    item: string;
    descricaoItem?: string;
    preco?: number;
    tipoItem?: string;
    ativoProdutoServico?: string;
  }
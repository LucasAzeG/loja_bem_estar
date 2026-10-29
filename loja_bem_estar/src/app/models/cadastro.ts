export interface Cliente {
  idpessoa?: number;
  nome: string;
  cpf: string;
  data_nascimento: string;
  sexo: 'M' | 'F' | 'O';
  email: string;
  telefone: string;
  ativo_pessoa: 'S' | 'N';
}

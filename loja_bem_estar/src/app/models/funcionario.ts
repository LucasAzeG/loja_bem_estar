export interface PessoaModel {
  idPessoa?: number;
  nome: string;
  cpf?: number | null;
  dataNascimento?: string;
  sexo?: string;
  email?: string | null;
  telefone?: number | null;
  ativoPessoa?: string;
}

export interface Funcionario {
  idpessoa?: number;
  idPessoa?: number;
  cargo: string;
  dataAdmissao: string;
  pessoa?: PessoaModel;
}
// Importações essenciais do Angular Core para criação do componente, hooks de ciclo de vida e injeção de dependências
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importações para manipulação de formulários reativos e suas validações
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Importações do ecossistema de roteamento do Angular (navegação, links e leitura de parâmetros de URL)
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

// Importação do serviço HTTP e da interface/modelo de dados do Cliente
import { CadastroService } from '../../services/cadastro.service';
import { Cliente } from '../../models/cadastro';

@Component({
  // Seletor HTML customizado (<app-cadastro>)
  selector: 'app-cadastro',
  
  // Declaração de Standalone Component (não depende de NgModules tradicionais)
  standalone: true,
  
  // Módulos e recursos necessários diretamente no template deste componente
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  
  // Arquivos de layout HTML e estilização CSS associados
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent implements OnInit {
  
  // Declaração do objeto que gerenciará o formulário reativo e seus controles
  cadastroForm: FormGroup;
  
  // Armazena o ID do cliente retornado da URL quando estiver no modo de edição
  clienteId: number | null = null;
  
  // Flag de controle para alternar dinamicamente a interface entre 'Novo' e 'Edição'
  isEdicao = false;

  // Injeção de dependências moderna utilizando a função 'inject()'
  private fb = inject(FormBuilder);             // Construtor utilitário para formulários reativos
  private cadastroService = inject(CadastroService); // Serviço para comunicação com a API backend
  private router = inject(Router);               // Navegador de rotas programático
  private route = inject(ActivatedRoute);        // Leitor das informações e parâmetros da rota ativa

  constructor() {
    // Inicialização da estrutura do formulário com regras de validação síncronas
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern('^[0-9]*$')]],
      dataNascimento: ['', [Validators.required]],
      sexo: ['M', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      telefone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11), Validators.pattern('^[0-9]*$')]],
      ativoPessoa: ['S', [Validators.required]]
    });
  }

  // Ciclo de vida do Angular (OnInit): executado logo após a criação do componente
  ngOnInit(): void {
    // Captura o parâmetro 'id' da URL (ex: /cadastro/5)
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      // Se houver ID na URL, ativa o modo de edição
      this.clienteId = Number(idParam);
      this.isEdicao = true;

      // Busca os dados cadastrais do cliente no backend pelo ID
      this.cadastroService.obterPorId(this.clienteId).subscribe({
        // Preenche automaticamente todos os campos do formulário com os dados retornados
        next: (cliente) => this.cadastroForm.patchValue(cliente),
        error: (err: any) => console.error('Erro ao buscar cliente:', err)
      });
    }
  }

  /**
   * Método executado na submissão do formulário (ao clicar em Salvar ou dar Enter)
   */
  onSubmit(): void {
    // Interrompe o processo caso algum campo obrigatório ou regra do formulário esteja inválido
    if (this.cadastroForm.invalid) return;

    // Fluxo de Atualização (PUT)
    if (this.isEdicao && this.clienteId) {
      const clienteAtualizado: Cliente = {
        ...this.cadastroForm.value,
        idpessoa: this.clienteId // Anexa a chave primária exigida na atualização
      };

      this.cadastroService.atualizarCliente(clienteAtualizado).subscribe({
        next: () => this.router.navigate(['/clientes']), // Redireciona para a lista após o sucesso
        error: (err: any) => console.error('Erro ao atualizar no backend:', err)
      });
    } 
    // Fluxo de Inserção (POST)
    else {
      const dadosCliente: Cliente = this.cadastroForm.value;

      this.cadastroService.adicionarCliente(dadosCliente).subscribe({
        next: () => this.router.navigate(['/clientes']), // Redireciona para a lista após a criação
        error: (err: any) => console.error('Erro ao salvar no backend:', err)
      });
    }
  }

  /**
   * Exclui o registro do cliente ativo no backend após confirmação do usuário
   */
  excluirCliente(): void {
    // Validação defensiva: garante que há um ID válido antes de requisitar a exclusão
    if (!this.clienteId) return;

    // Exibe caixa de diálogo nativa de confirmação para segurança da operação
    const confirmacao = confirm('Tem certeza de que deseja excluir este cliente?');
    
    if (confirmacao) {
      // Dispara a requisição HTTP DELETE via serviço
      this.cadastroService.excluirCliente(this.clienteId).subscribe({
        next: () => this.router.navigate(['/clientes']), // Redireciona para a listagem após deletar
        error: (err: any) => console.error('Erro ao excluir cliente no backend:', err)
      });
    }
  }
}
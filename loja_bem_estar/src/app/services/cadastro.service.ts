import { Injectable, signal } from '@angular/core';
import { Cliente } from '../models/cadastro';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private clientesSignal = signal<Cliente[]>([
    {
      idpessoa: 1,
      nome: 'Lucas Azevedo',
      cpf: '12345678901',
      data_nascimento: '2002-08-16',
      sexo: 'M',
      email: 'lucaszedde@gmail.com',
      telefone: '11999998888',
      ativo_pessoa: 'S'
    }
  ]);

  readonly clientes = this.clientesSignal.asReadonly();

  obterPorId(id: number): Cliente | undefined {
    return this.clientesSignal().find(c => c.idpessoa === id);
  }

  adicionarCliente(novoCliente: Omit<Cliente, 'idpessoa'>): void {
    const clienteComId: Cliente = {
      ...novoCliente,
      idpessoa: this.clientesSignal().length + 1
    };
    this.clientesSignal.update(lista => [...lista, clienteComId]);
  }

  atualizarCliente(clienteAtualizado: Cliente): void {
    this.clientesSignal.update(lista =>
      lista.map(c => c.idpessoa === clienteAtualizado.idpessoa ? clienteAtualizado : c)
    );
  }
}
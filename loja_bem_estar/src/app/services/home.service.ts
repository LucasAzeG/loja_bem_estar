import { Injectable, signal } from '@angular/core';
import { CardHome } from '../models/home';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private cardsSignal = signal<CardHome[]>([
    {
      id: 1,
      titulo: 'Cadastro de Clientes',
      descricao: 'Cadastre novos clientes no banco de dados',
      rota: '/cadastro'
    },
    {
      id: 2,
      titulo: 'Lista de Clientes',
      descricao: 'Consulte os clientes cadastrados no sistema',
      rota: '/clientes'
    }
  ]);

  readonly cards = this.cardsSignal.asReadonly();
}
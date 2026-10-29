import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component/home.component';
import { CadastroComponent } from './components/cadastro.component/cadastro.component';
import { ListaClientesComponent } from './components/lista-clientes.component/lista-clientes.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'clientes', component: ListaClientesComponent }
];
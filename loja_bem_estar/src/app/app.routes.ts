import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component/home.component';
import { CadastroComponent } from './components/cadastro.component/cadastro.component';
import { ListaClientesComponent } from './components/lista-clientes.component/lista-clientes.component';
import { CategoriaComponent } from './components/categoria.component/categoria.component';
import { CategoriaCadastroComponent } from './components/categoria-cadastro.component/categoria-cadastro.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'cadastro/:id', component: CadastroComponent },
  { path: 'clientes', component: ListaClientesComponent },
  { path: 'categorias', component: CategoriaComponent },
  { path: 'categorias/novo', component: CategoriaCadastroComponent },
  { path: 'categorias/editar/:id', component: CategoriaCadastroComponent },
  { path: '**', redirectTo: '' }
];
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component/home.component';
import { CadastroComponent } from './components/cadastro.component/cadastro.component';
import { ListaClientesComponent } from './components/lista-clientes.component/lista-clientes.component';
import { CategoriaComponent } from './components/categoria.component/categoria.component';
import { CategoriaCadastroComponent } from './components/categoria-cadastro.component/categoria-cadastro.component';
import { ItemListaComponent } from './components/item-lista.component/item-lista.component';
import { ItemCadastroComponent } from './components/item-cadastro.component/item-cadastro.component';
import { CatalogoProdutosComponent } from './components/catalogo-produtos.component/catalogo-produtos.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'cadastro/:id', component: CadastroComponent },
  { path: 'clientes', component: ListaClientesComponent },
  { path: 'categorias', component: CategoriaComponent },
  { path: 'categorias/novo', component: CategoriaCadastroComponent },
  { path: 'categorias/editar/:id', component: CategoriaCadastroComponent },
  { path: 'itens', component: ItemListaComponent },
  { path: 'itens/novo', component: ItemCadastroComponent },
  { path: 'itens/editar/:id', component: ItemCadastroComponent },
  { path: 'produtos/catalogo', component: CatalogoProdutosComponent },
  { path: '**', redirectTo: '' }
];
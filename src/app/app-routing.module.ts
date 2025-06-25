import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardFlipComponent } from './Modules/card-flip/card-flip.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./Modules/Components/home.module').then(m => m.HomeModule) },
  { path: 'map', loadChildren: () => import('./Modules/map-page/map-page.module').then(m => m.MapPageModule) },
  { path: 'card', component: CardFlipComponent },
  { path: '**', redirectTo: 'home' }, // Ruta comodín para 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
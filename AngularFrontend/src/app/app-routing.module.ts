import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { WikiComponent } from './wiki/wiki.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'wiki', component: WikiComponent},
  {path: '**', pathMatch: 'full', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

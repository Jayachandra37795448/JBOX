import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from './homepage/home-page.component';
const routes: Routes = [
  { path: 'home', component: HomePageComponent },
];

@NgModule({
  imports: [ RouterModule, RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

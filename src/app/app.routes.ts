import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', redirectTo:'/login', pathMatch: 'full'},
    {path: 'home', component: HomeComponent}, 

];

import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { TrocarSenhaComponent } from './componentes/trocar-senha/trocar-senha.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', redirectTo:'/login', pathMatch: 'full'},
    {path: 'home', component: HomeComponent}, 
    {path: 'trocar-senha', component: TrocarSenhaComponent }

];

import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { TrocarSenhaComponent } from './componentes/trocar-senha/trocar-senha.component';
import { EnviarCodigoComponent } from './componentes/enviar-codigo/enviar-codigo.component';
import { BaterPontoComponent } from './componentes/bater-ponto/bater-ponto.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo:'/login', pathMatch: 'full' },
    { path: 'home', component: HomeComponent}, 
    { path: 'enviar-codigo', component: EnviarCodigoComponent },
    { path: 'trocar-senha', component: TrocarSenhaComponent },
    { path: 'bater-ponto', component: BaterPontoComponent }

];

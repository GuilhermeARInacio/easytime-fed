import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { TrocarSenhaComponent } from './pages/trocar-senha/trocar-senha.component';
import { EnviarCodigoComponent } from './pages/enviar-codigo/enviar-codigo.component';
import { BaterPontoComponent } from './pages/bater-ponto/bater-ponto.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';

export const routes: Routes = [
    { path: '', redirectTo:'/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'enviar-codigo', component: EnviarCodigoComponent },
    { path: 'trocar-senha', component: TrocarSenhaComponent },
    { path: 'bater-ponto', component: BaterPontoComponent },
    { path: 'consulta', component: ConsultaComponent }

];

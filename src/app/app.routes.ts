import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { TrocarSenhaComponent } from './componentes/trocar-senha/trocar-senha.component';
import { EnviarCodigoComponent } from './componentes/enviar-codigo/enviar-codigo.component';
import { BaterPontoComponent } from './componentes/bater-ponto/bater-ponto.component';
import { ConsultaComponent } from './componentes/consulta/consulta.component';

export const routes: Routes = [
    { path: '', redirectTo:'/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'enviar-codigo', component: EnviarCodigoComponent },
    { path: 'trocar-senha', component: TrocarSenhaComponent },
    { path: 'bater-ponto', component: BaterPontoComponent },
    { path: 'consulta', component: ConsultaComponent }

];

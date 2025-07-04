import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { TrocarSenhaComponent } from './pages/trocar-senha/trocar-senha.component';
import { EnviarCodigoComponent } from './pages/enviar-codigo/enviar-codigo.component';
import { BaterPontoComponent } from './pages/bater-ponto/bater-ponto.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { ConsultaPedidosComponent } from './pages/consulta-pedidos/consulta-pedidos.component';

export const routes: Routes = [
    { path: '', redirectTo:'/login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent, title: 'Easytime | Login' },
    { path: 'enviar-codigo', component: EnviarCodigoComponent, title: 'Easytime | Enviar Código' },
    { path: 'trocar-senha', component: TrocarSenhaComponent, title: 'Easytime | Redefinir Senha' },
    { path: 'bater-ponto', component: BaterPontoComponent, title: 'Easytime | Bater Ponto' },
    { path: 'consulta', component: ConsultaComponent, title: 'Easytime | Consultar Registros' },
    { path: 'pedidos-registro', component: ConsultaPedidosComponent, title: 'Easytime | Consultar Pedidos' }

];

import { Component } from '@angular/core';
import { UsuarioService } from '../../service/usuario/usuario.service';


@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  login: string = '';
  senha: string = '';
  error: string | null = null;

  constructor(private usuarioService: UsuarioService) { }

  enviarLogin() {
    alert(`Login: ${this.login}, Senha: ${this.senha}`);
    // this.usuarioService.login(this.login, this.senha).subscribe({
    //   next: (response) => {
    //     console.log('Login successful:', response);
    //     this.error = null;
    //   },
    //   error: (err) => {
    //     console.error('Login failed:', err);
    //     this.error = 'Login ou senha inválidos';
    //   }
    // })
  }

}

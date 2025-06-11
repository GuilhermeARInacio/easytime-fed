import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-lateral',
  imports: [],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.css'
})
export class MenuLateralComponent {
  menuColapsado: boolean = true;

  constructor(
    private router: Router
  ){}

  sair(){
    localStorage.clear();

    this.router.navigate(['/login']);
  }
  
  navegarParaConsulta() {
    this.router.navigate(['/consulta']);
  }

  navegarParaBaterPonto() {
    this.router.navigate(['/bater-ponto']);
  }

  toggleMenu() {
    console.log('Toggling menu');
    const menu = document.querySelector('.menu-lateral');
    if (menu) {
      menu.classList.toggle('menu-lateral--collapsed');
      this.menuColapsado = !this.menuColapsado;
    }
  }
}

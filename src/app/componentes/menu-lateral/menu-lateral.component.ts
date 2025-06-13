import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-menu-lateral',
  imports: [CommonModule],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.css'
})
export class MenuLateralComponent {
  menuColapsado: boolean = true;
  rotaAtual: string = '';

  constructor(
    private router: Router
  ){
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd){
        this.rotaAtual = e.urlAfterRedirects;
      }
    })
  }

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
    const menu = document.querySelector('.menu-lateral');
    const menuSuspenso = document.querySelector('.menu-suspenso');

    if (menu) {
      menu.classList.toggle('menu-lateral--collapsed');
      menuSuspenso?.classList.toggle('menu-suspenso--shown');
      
      this.menuColapsado = !this.menuColapsado;
    }
  }
}

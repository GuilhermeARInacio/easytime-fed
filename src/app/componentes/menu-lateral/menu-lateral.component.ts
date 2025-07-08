import { CommonModule } from '@angular/common';
import { Component, ElementRef, Host, HostListener, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-lateral',
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.css'
})
export class MenuLateralComponent {
  menuColapsado: boolean = true;
  role: string = localStorage.getItem('role') || '';

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private element: ElementRef,
  ){}

  @HostListener("document:keydown.escape") fecharMenuComEsc() {
    if (!this.menuColapsado) {
      this.toggleMenu();
    }
  }

  sair(){
    localStorage.clear();

    this.router.navigate(['/login']);
  }

  toggleMenu() {
    const menu = document.querySelector('.menu-lateral');
    const menuSuspenso = document.querySelector('.menu-suspenso');

    if (menu) {
      menu.classList.toggle('menu-lateral--collapsed');
      menuSuspenso?.classList.toggle('menu-suspenso--shown');
      
      this.menuColapsado = !this.menuColapsado;
    }

    this.renderer.setStyle(this.element.nativeElement.ownerDocument.body, 'overflow', this.menuColapsado ? 'auto' : 'hidden');
  }
}

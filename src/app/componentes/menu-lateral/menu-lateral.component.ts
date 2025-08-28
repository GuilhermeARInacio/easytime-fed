import { CommonModule } from '@angular/common';
import { Component, ElementRef, Host, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-lateral',
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.css'
})
export class MenuLateralComponent implements OnInit, OnDestroy {
  menuColapsado: boolean = true;
  role: string = localStorage.getItem('role') || '';
  private storageListener: ((event: StorageEvent) => void) | undefined;
  showSessionModal: boolean = false;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private element: ElementRef,
  ){}

  ngOnInit() {
    this.storageListener = (event: StorageEvent) => {
      if (event.key === 'token') {
        this.showSessionModal = true;
      }
    };
    window.addEventListener('storage', this.storageListener);
  }

  ngOnDestroy() {
    if (this.storageListener) {
      window.removeEventListener('storage', this.storageListener);
    }
  }

  confirmarLogout() {
    this.showSessionModal = false;
    this.sair();
  }

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

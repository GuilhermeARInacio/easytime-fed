import { __decorate } from "tslib";
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
let MenuLateralComponent = class MenuLateralComponent {
    router;
    renderer;
    element;
    menuColapsado = true;
    role = localStorage.getItem('role') || '';
    constructor(router, renderer, element) {
        this.router = router;
        this.renderer = renderer;
        this.element = element;
    }
    fecharMenuComEsc() {
        if (!this.menuColapsado) {
            this.toggleMenu();
        }
    }
    sair() {
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
};
__decorate([
    HostListener("document:keydown.escape")
], MenuLateralComponent.prototype, "fecharMenuComEsc", null);
MenuLateralComponent = __decorate([
    Component({
        selector: 'app-menu-lateral',
        imports: [CommonModule, RouterModule],
        templateUrl: './menu-lateral.component.html',
        styleUrl: './menu-lateral.component.css'
    })
], MenuLateralComponent);
export { MenuLateralComponent };

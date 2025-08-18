import { TestBed } from '@angular/core/testing';
import { MenuLateralComponent } from './menu-lateral.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
describe('MenuLateralComponent', () => {
    let component;
    let fixture;
    let routerSpy;
    let routerEvents$;
    beforeEach(async () => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        routerEvents$ = new Subject();
        routerSpy.events = routerEvents$.asObservable();
        await TestBed.configureTestingModule({
            imports: [
                MenuLateralComponent,
                RouterTestingModule
            ],
            providers: [{ provide: Router, useValue: routerSpy }]
        })
            .overrideComponent(MenuLateralComponent, {
            set: { template: '<div></div>' }
        })
            .compileComponents();
        fixture = TestBed.createComponent(MenuLateralComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });
    it('deve limpar localStorage e navegar para login ao sair', () => {
        spyOn(localStorage, 'clear');
        component.sair();
        expect(localStorage.clear).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
    it('deve alternar as classes do menu', () => {
        const menu = document.createElement('div');
        menu.className = 'menu-lateral';
        document.body.appendChild(menu);
        const menuSuspenso = document.createElement('div');
        menuSuspenso.className = 'menu-suspenso';
        document.body.appendChild(menuSuspenso);
        component.menuColapsado = true;
        component.toggleMenu();
        expect(menu.classList.contains('menu-lateral--colapsed')).toBeFalse();
        expect(menuSuspenso.classList.contains('menu-suspenso--shown')).toBeTrue();
        expect(component.menuColapsado).toBeFalse();
        document.body.removeChild(menu);
        document.body.removeChild(menuSuspenso);
    });
    it('deve alternar as classes do menu com ESC', () => {
        const menu = document.createElement('div');
        menu.className = 'menu-lateral';
        document.body.appendChild(menu);
        const menuSuspenso = document.createElement('div');
        menuSuspenso.className = 'menu-suspenso';
        document.body.appendChild(menuSuspenso);
        component.menuColapsado = false;
        component.fecharMenuComEsc();
        expect(menu.classList.contains('menu-lateral--colapsed')).toBeFalse();
        expect(menuSuspenso.classList.contains('menu-suspenso--shown')).toBeTrue();
        expect(component.menuColapsado).toBeTrue();
        document.body.removeChild(menu);
        document.body.removeChild(menuSuspenso);
    });
});

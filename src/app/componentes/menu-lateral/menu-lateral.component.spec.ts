import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuLateralComponent } from './menu-lateral.component';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject } from 'rxjs';

describe('MenuLateralComponent', () => {
  let component: MenuLateralComponent;
  let fixture: ComponentFixture<MenuLateralComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routerEvents$: Subject<any>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerEvents$ = new Subject();
    (routerSpy as any).events = routerEvents$.asObservable();

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

  it('deve atualizar a rotaAtual ao navegar para consulta', () => {
    component.navegarParaConsulta();
    routerEvents$.next(new NavigationEnd(1, '/consulta', '/consulta'));
    expect(component.rotaAtual).toBe('/consulta');
  });

  it('deve limpar localStorage e navegar para login ao sair', () => {
    spyOn(localStorage, 'clear');
    component.sair();
    expect(localStorage.clear).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('deve navegar para consulta', () => {
    component.navegarParaConsulta();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/consulta']);
  });

  it('deve navegar para bater-ponto', () => {
    component.navegarParaBaterPonto();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/bater-ponto']);
  });

  it('deve alternar as classes do menu', () => {
    const menu = document.createElement('div');
    menu.className = 'menu-lateral';
    document.body.appendChild(menu);

    const menuSuspenso = document.createElement('div')
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
});

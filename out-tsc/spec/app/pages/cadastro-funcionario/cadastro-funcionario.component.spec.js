import { TestBed } from '@angular/core/testing';
import { CadastroFuncionarioComponent } from './cadastro-funcionario.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../service/usuario/usuario.service';
import { PopUpService } from '../../service/notificacao/pop-up.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
describe('CadastroFuncionarioComponent', () => {
    let component;
    let fixture;
    let routerSpy;
    let usuarioServiceSpy;
    let popUpServiceSpy;
    beforeEach(async () => {
        usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', [
            'cadastrarUsuario',
        ]);
        popUpServiceSpy = jasmine.createSpyObj('PopUpService', [
            'abrirNotificacao',
        ]);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        await TestBed.configureTestingModule({
            imports: [
                CadastroFuncionarioComponent,
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [
                { provide: ActivatedRoute, useValue: {} },
                { provide: Router, useValue: routerSpy },
                { provide: UsuarioService, useValue: usuarioServiceSpy },
                { provide: PopUpService, useValue: popUpServiceSpy },
            ],
        })
            .overrideComponent(CadastroFuncionarioComponent, {
            set: { template: '<div></div>' },
        })
            .compileComponents();
        fixture = TestBed.createComponent(CadastroFuncionarioComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ConsultaComponent } from './consulta.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PopUpService } from '../../service/notificacao/pop-up.service';
import { PontoService } from '../../service/ponto/ponto.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
describe('ConsultaComponent', () => {
    let component;
    let fixture;
    let routerSpy;
    let pontoServiceSpy;
    let popUpServiceSpy;
    beforeEach(async () => {
        pontoServiceSpy = jasmine.createSpyObj('PontoService', ['consultarPonto', 'consultarAlteracao']);
        pontoServiceSpy.consultarPonto.and.returnValue(of([{
                id: 1,
                login: 'login',
                data: '08/06/2025',
                horasTrabalhadas: '08:00:00',
                entrada1: '08:00:00',
                saida1: '12:00:00',
                entrada2: '13:00:00',
                saida2: '17:00:00',
                entrada3: '',
                saida3: '',
                status: 'PENDENTE',
                temAlteracao: false
            }]));
        popUpServiceSpy = jasmine.createSpyObj('PopUpService', ['abrirNotificacao']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        await TestBed.configureTestingModule({
            imports: [
                ConsultaComponent,
                HttpClientTestingModule,
                RouterTestingModule
            ],
            providers: [
                { provide: ActivatedRoute, useValue: {} },
                { provide: Router, useValue: routerSpy },
                { provide: PontoService, useValue: pontoServiceSpy },
                { provide: PopUpService, useValue: popUpServiceSpy }
            ]
        })
            .overrideComponent(ConsultaComponent, {
            set: { template: '<div></div>' }
        })
            .compileComponents();
        fixture = TestBed.createComponent(ConsultaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });
    it('deve navegar para /login se não houver token no ngOnInit', () => {
        spyOn(localStorage, 'getItem').and.returnValue(null);
        component.ngOnInit();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
    it('deve chamar pontoService.consultarPonto e abrir notificação de sucesso', fakeAsync(() => {
        spyOn(localStorage, 'getItem').and.returnValue('usuarioValido');
        component.formulario.get('inicio')?.setValue('2025-06-01');
        component.formulario.get('final')?.setValue('2025-06-10');
        const response = [
            {
                id: 1,
                login: 'login',
                data: '08/06/2025',
                horasTrabalhadas: '08:00:00',
                entrada1: '08:00:00',
                saida1: '12:00:00',
                entrada2: '13:00:00',
                saida2: '17:00:00',
                entrada3: '',
                saida3: '',
                status: 'PENDENTE',
                temAlteracao: false
            }
        ];
        pontoServiceSpy.consultarPonto.and.returnValue(of(response));
        component.consultar();
        expect(pontoServiceSpy.consultarPonto).toHaveBeenCalledWith({
            login: 'usuarioValido',
            dtInicio: '01/06/2025',
            dtFinal: '10/06/2025'
        });
        tick(1000);
        expect(component.error).toBeNull();
        expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({
            titulo: 'Consulta bem sucedida',
            mensagem: 'Registros consultados com sucesso.',
            tipo: 'sucesso',
            icon: ''
        }));
    }));
    it('deve chamar pontoService.consultarPonto e retornar erro quando lista vazia', fakeAsync(() => {
        spyOn(localStorage, 'getItem').and.returnValue('usuarioValido');
        component.formulario.get('inicio')?.setValue('2025-06-01');
        component.formulario.get('final')?.setValue('2025-06-10');
        pontoServiceSpy.consultarPonto.and.returnValue(of([]));
        component.consultar();
        expect(pontoServiceSpy.consultarPonto).toHaveBeenCalledWith({
            login: 'usuarioValido',
            dtInicio: '01/06/2025',
            dtFinal: '10/06/2025'
        });
        tick(1000);
        expect(component.registros.length).toBe(0);
        expect(component.error).toBe('Nenhum registro encontrado para o período informado.');
    }));
    it('deve tratar erro 401 ao consultar e chamar sair', fakeAsync(() => {
        spyOn(localStorage, 'getItem').and.returnValue('usuarioValido');
        component.formulario.get('inicio')?.setValue('2025-06-01');
        component.formulario.get('final')?.setValue('2025-06-10');
        spyOn(component, 'sair');
        pontoServiceSpy.consultarPonto.and.returnValue(throwError(() => ({ status: 401, error: 'Login expirado. Por favor, faça login novamente.' })));
        component.consultar();
        expect(component.error).toBe('Login expirado. Por favor, faça login novamente.');
        expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({
            titulo: 'Erro',
            mensagem: 'Login expirado. Por favor, faça login novamente.',
            tipo: 'erro',
            icon: ''
        }));
        tick(1000);
        expect(component.sair).toHaveBeenCalled();
    }));
    it('deve tratar erro 400 ao consultar', fakeAsync(() => {
        spyOn(localStorage, 'getItem').and.returnValue('usuarioValido');
        component.formulario.get('inicio')?.setValue('2025-06-01');
        component.formulario.get('final')?.setValue('2025-06-10');
        pontoServiceSpy.consultarPonto.and.returnValue(throwError(() => ({ status: 400, error: 'Nenhum ponto encontrado para o período informado.' })));
        component.consultar();
        tick(1000);
        expect(component.error).toBe('Não existem registros de ponto para o período informado.');
    }));
    it('deve tratar erro 500 ao consultar', fakeAsync(() => {
        spyOn(localStorage, 'getItem').and.returnValue('usuarioValido');
        component.formulario.get('inicio')?.setValue('2025-06-01');
        component.formulario.get('final')?.setValue('2025-06-10');
        pontoServiceSpy.consultarPonto.and.returnValue(throwError(() => ({ status: 500, error: 'Desculpe, ocorreu um erro interno ao tentar consultar o registros. Tente novamente mais tarde.' })));
        component.consultar();
        tick(1000);
        expect(component.error).toBe('Desculpe, ocorreu um erro interno ao tentar consultar o registros. Tente novamente mais tarde.');
    }));
    it('deve marcar controles como touched e setar shakeFields se formulário inválido', () => {
        component.formulario.get('inicio')?.setValue('');
        component.formulario.get('final')?.setValue('');
        spyOn(component.formulario, 'markAllAsTouched').and.callThrough();
        jasmine.clock().install();
        component.consultar();
        expect(component.formulario.markAllAsTouched).toHaveBeenCalled();
        expect(component.shakeFields['inicio']).toBeTrue();
        expect(component.shakeFields['final']).toBeTrue();
        jasmine.clock().tick(301);
        expect(component.shakeFields['inicio']).toBeFalse();
        expect(component.shakeFields['final']).toBeFalse();
        jasmine.clock().uninstall();
        expect(pontoServiceSpy.consultarPonto).not.toHaveBeenCalled();
    });
    it('deve retornar string vazia ao chamar formatarData com data vazia', () => {
        const component = new ConsultaComponent({}, {}, {}, {}, {}, {});
        expect(component.formatarData('')).toBe('');
    });
    it('deve retornar string vazia ao chamar formatarDataRetorno com data vazia', () => {
        const component = new ConsultaComponent({}, {}, {}, {}, {}, {});
        expect(component.formatarDataRetorno('')).toBe('');
    });
    it('deve formatar data para dd/mm/aa ao chamar formatarDataRetorno', () => {
        const component = new ConsultaComponent({}, {}, {}, {}, {}, {});
        expect(component.formatarDataRetorno('12/06/2025')).toBe('12/06/25');
    });
    it('deve limpar localStorage e navegar para login ao sair', () => {
        spyOn(localStorage, 'clear');
        component.sair();
        expect(localStorage.clear).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
    it('deve abrir o modal de exportação e definir overflow hidden no body', () => {
        const rendererSpy = jasmine.createSpyObj('Renderer2', ['setStyle']);
        const elementMock = { nativeElement: { ownerDocument: { body: {} } } };
        const component = new ConsultaComponent({}, {}, {}, {}, rendererSpy, elementMock);
        component.modalExportar = false;
        component.abrirModalExportar();
        expect(component.modalExportar).toBeTrue();
        expect(rendererSpy.setStyle).toHaveBeenCalledWith(elementMock.nativeElement.ownerDocument.body, 'overflow', 'hidden');
    });
    it('deve abrir o modal de alteração e definir overflow hidden no body', () => {
        const rendererSpy = jasmine.createSpyObj('Renderer2', ['setStyle']);
        const elementMock = { nativeElement: { ownerDocument: { body: {} } } };
        const component = new ConsultaComponent({}, {}, {}, {}, rendererSpy, elementMock);
        component.modalAlteracao = false;
        const registro = {
            id: 1,
            login: 'login',
            data: '08/06/2025',
            horasTrabalhadas: '08:00:00',
            entrada1: '08:00:00',
            saida1: '12:00:00',
            entrada2: '13:00:00',
            saida2: '17:00:00',
            entrada3: '',
            saida3: '',
            status: 'PENDENTE',
            temAlteracao: false
        };
        component.abrirModalAlteracao(registro);
        expect(component.modalAlteracao).toBeTrue();
        expect(rendererSpy.setStyle).toHaveBeenCalledWith(elementMock.nativeElement.ownerDocument.body, 'overflow', 'hidden');
    });
    it('deve retornar "status-pendente" para status "PENDENTE"', () => {
        expect(component.statusClass('PENDENTE')).toBe('status-pendente');
    });
    it('deve retornar "status-aprovado" para status "APROVADO"', () => {
        expect(component.statusClass('APROVADO')).toBe('status-aprovado');
    });
    it('deve retornar "status-rejeitado" para status "REJEITADO"', () => {
        expect(component.statusClass('REJEITADO')).toBe('status-rejeitado');
    });
    it('deve retornar string vazia para status desconhecido', () => {
        expect(component.statusClass('INDEFINIDO')).toBe('');
        expect(component.statusClass('')).toBe('');
        expect(component.statusClass('qualquercoisa')).toBe('');
    });
    it('deve chamar pontoService.consultarAlteracao e abrir modal', fakeAsync(() => {
        spyOn(localStorage, 'getItem').and.returnValue('usuarioValido');
        component.formulario.get('inicio')?.setValue('2025-06-01');
        component.formulario.get('final')?.setValue('2025-06-10');
        const response = {
            login: 'user',
            idPonto: 1,
            data: '27/06/2025',
            entrada1: '08:00',
            saida1: '12:00',
            entrada2: '13:00',
            saida2: '17:00',
            entrada3: '',
            saida3: '',
            justificativa: 'teste',
            status: 'PENDENTE',
        };
        const registro = {
            id: 1,
            login: 'user',
            data: '27/06/2025',
            horasTrabalhadas: '08:00',
            entrada1: '08:00',
            saida1: '12:00',
            entrada2: '13:00',
            saida2: '17:00',
            entrada3: '',
            saida3: '',
            status: 'PENDENTE',
            temAlteracao: true,
        };
        pontoServiceSpy.consultarAlteracao.and.returnValue(of(response));
        component.exibirAlteracao(registro);
        expect(pontoServiceSpy.consultarAlteracao).toHaveBeenCalledWith(registro.id);
        tick(1000);
        expect(component.error).toBeNull();
        expect(popUpServiceSpy.abrirNotificacao).not.toHaveBeenCalled();
        expect(component.modalAlteracao).toBeTrue();
    }));
    it('deve tratar erro 401 ao exibirAlteracao e chamar sair', fakeAsync(() => {
        spyOn(localStorage, 'getItem').and.returnValue('usuarioValido');
        component.formulario.get('inicio')?.setValue('2025-06-01');
        component.formulario.get('final')?.setValue('2025-06-10');
        spyOn(component, 'sair');
        pontoServiceSpy.consultarAlteracao.and.returnValue(throwError(() => ({ status: 401, error: 'Login expirado. Por favor, faça login novamente.' })));
        const registro = {
            id: 1,
            login: 'user',
            data: '27/06/2025',
            horasTrabalhadas: '08:00',
            entrada1: '08:00',
            saida1: '12:00',
            entrada2: '13:00',
            saida2: '17:00',
            entrada3: '',
            saida3: '',
            status: 'PENDENTE',
            temAlteracao: true,
        };
        component.exibirAlteracao(registro);
        expect(component.error).toBe('Login expirado. Por favor, faça login novamente.');
        expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({
            titulo: 'Erro',
            mensagem: 'Login expirado. Por favor, faça login novamente.',
            tipo: 'erro',
            icon: ''
        }));
        tick(1000);
        expect(component.sair).toHaveBeenCalled();
    }));
    it('deve tratar erro 400 ao consultar', () => {
        spyOn(localStorage, 'getItem').and.returnValue('usuarioValido');
        component.formulario.get('inicio')?.setValue('2025-06-01');
        component.formulario.get('final')?.setValue('2025-06-10');
        pontoServiceSpy.consultarAlteracao.and.returnValue(throwError(() => ({ status: 400, error: 'Erro ao consultar pedido de alteração.' })));
        const registro = {
            id: 1,
            login: 'user',
            data: '27/06/2025',
            horasTrabalhadas: '08:00',
            entrada1: '08:00',
            saida1: '12:00',
            entrada2: '13:00',
            saida2: '17:00',
            entrada3: '',
            saida3: '',
            status: 'PENDENTE',
            temAlteracao: true,
        };
        component.exibirAlteracao(registro);
        expect(component.error).toBe('Erro ao consultar pedido de alteração.');
        expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({
            titulo: 'Erro',
            mensagem: 'Erro ao consultar pedido de alteração.',
            tipo: 'erro',
            icon: ''
        }));
    });
    it('deve tratar erro 500 ao consultar', () => {
        spyOn(localStorage, 'getItem').and.returnValue('usuarioValido');
        component.formulario.get('inicio')?.setValue('2025-06-01');
        component.formulario.get('final')?.setValue('2025-06-10');
        pontoServiceSpy.consultarAlteracao.and.returnValue(throwError(() => ({ status: 500, error: 'Desculpe, ocorreu um erro interno ao tentar consultar o registros. Tente novamente mais tarde.' })));
        const registro = {
            id: 1,
            login: 'user',
            data: '27/06/2025',
            horasTrabalhadas: '08:00',
            entrada1: '08:00',
            saida1: '12:00',
            entrada2: '13:00',
            saida2: '17:00',
            entrada3: '',
            saida3: '',
            status: 'PENDENTE',
            temAlteracao: true,
        };
        component.exibirAlteracao(registro);
        expect(component.error).toBe('Desculpe, ocorreu um erro interno ao tentar consultar o registros. Tente novamente mais tarde.');
        expect(popUpServiceSpy.abrirNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({
            titulo: 'Erro',
            mensagem: 'Desculpe, ocorreu um erro interno ao tentar consultar o registros. Tente novamente mais tarde.',
            tipo: 'erro',
            icon: ''
        }));
    });
});

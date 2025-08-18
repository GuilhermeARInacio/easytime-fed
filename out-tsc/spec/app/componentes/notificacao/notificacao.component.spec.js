import { TestBed } from '@angular/core/testing';
import { NotificacaoComponent } from './notificacao.component';
import { PopUpService } from '../../service/notificacao/pop-up.service';
import { Subject } from 'rxjs';
describe('NotificacaoComponent', () => {
    let component;
    let fixture;
    let popUpServiceSpy;
    let notificacaoSubject;
    beforeEach(async () => {
        notificacaoSubject = new Subject();
        popUpServiceSpy = jasmine.createSpyObj('PopUpService', ['abrirNotificacao'], {
            notificacao$: notificacaoSubject.asObservable(),
        });
        await TestBed.configureTestingModule({
            imports: [NotificacaoComponent],
            providers: [
                { provide: PopUpService, useValue: popUpServiceSpy },
            ],
        })
            .overrideComponent(NotificacaoComponent, {
            set: { template: '<div></div>' },
        })
            .compileComponents();
        fixture = TestBed.createComponent(NotificacaoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('deve criar componente', () => {
        expect(component).toBeTruthy();
    });
    it('deve chamar abrirNotificacao ao receber uma notificação no ngOnInit', () => {
        spyOn(component, 'abrirNotificacao');
        component.ngOnInit();
        notificacaoSubject.next({ tipo: 'sucesso', mensagem: 'Teste' });
        expect(component.abrirNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({ tipo: 'sucesso', mensagem: 'Teste' }));
    });
    it('deve abrir notificação de tipo enviado', () => {
        const notificacao = {
            titulo: 'Teste Enviado',
            mensagem: 'Teste enviado',
            tipo: 'enviado',
            icon: '',
        };
        component.abrirNotificacao(notificacao);
        expect(component.visivel).toBeTrue();
        expect(component.notificacao).toEqual({ ...notificacao, icon: 'send' });
    });
    it('deve abrir notificação de tipo erro', () => {
        const notificacao = {
            titulo: 'Erro',
            mensagem: 'Ocorreu um erro',
            tipo: 'erro',
            icon: '',
        };
        component.abrirNotificacao(notificacao);
        expect(component.visivel).toBeTrue();
        expect(component.notificacao).toEqual({ ...notificacao, icon: 'warning' });
    });
    it('deve abrir notificação de tipo sucesso', () => {
        const notificacao = {
            titulo: 'Sucesso',
            mensagem: 'Operação realizada',
            tipo: 'sucesso',
            icon: '',
        };
        component.abrirNotificacao(notificacao);
        expect(component.visivel).toBeTrue();
        expect(component.notificacao).toEqual({ ...notificacao, icon: 'check' });
    });
    it('deve esconder notificação após 5 segundos', (done) => {
        const notificacao = {
            titulo: 'Teste',
            mensagem: 'Mensagem',
            tipo: 'enviado',
            icon: '',
        };
        jasmine.clock().install();
        component.abrirNotificacao(notificacao);
        expect(component.visivel).toBeTrue();
        jasmine.clock().tick(5001);
        expect(component.visivel).toBeFalse();
        jasmine.clock().uninstall();
        done();
    });
});

import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuLateralComponent } from '../../componentes/menu-lateral/menu-lateral.component';
import { NotificacaoComponent } from '../../componentes/notificacao/notificacao.component';
import { PopUpService } from '../../service/notificacao/pop-up.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../service/usuario/usuario.service';
import { senhasIguaisValidacao, temEspecialValidacao, temLetraValidacao, temNumeroValidacao } from '../../validators/custom-validators';
import { Notificacao } from '../../interface/notificacao';

@Component({
  selector: 'app-cadastro-funcionario',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MenuLateralComponent, NotificacaoComponent],
  templateUrl: './cadastro-funcionario.component.html',
  styleUrl: './cadastro-funcionario.component.css'
})
export class CadastroFuncionarioComponent {

  formulario!: FormGroup;
  usuario: string = localStorage.getItem('login') || '';
  error: string | null = null;
  sucesso: string | null = null;
  shakeFields: { [key: string]: boolean } = {};
  carregando: boolean = false;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private popUpService: PopUpService,
    private router: Router,
    private renderer: Renderer2,
    private element: ElementRef
  ){}

  ngOnInit() {
    if(!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }

    this.formulario = this.formBuilder.group({
      nome: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      login: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^(?=.*[a-zA-Z]).+$/)
      ])],
      setor: ['', Validators.required],
      cargo: ['', Validators.required],
      senha: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        temLetraValidacao,
        temNumeroValidacao,
        temEspecialValidacao
      ])],
      repetirSenha: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])]
    },
    {
      validators: senhasIguaisValidacao('senha', 'repetirSenha')
    });

    this.formulario.get('nome')?.valueChanges.subscribe(() => {
      this.error = null;
    });
    this.formulario.get('email')?.valueChanges.subscribe(() => {
      this.error = null;
    });
    this.formulario.get('login')?.valueChanges.subscribe(() => {
      this.error = null;
    });
    this.formulario.get('setor')?.valueChanges.subscribe(() => {
      this.error = null;
    });
    this.formulario.get('cargo')?.valueChanges.subscribe(() => {
      this.error = null;
    });
    this.formulario.get('senha')?.valueChanges.subscribe(() => {
      this.error = null;
    });
    this.formulario.get('repetirSenha')?.valueChanges.subscribe(() => {
      this.error = null;
    });
  }

  abrirNotificacao(notificacao: Notificacao) {
    setTimeout(() => {
      this.popUpService.abrirNotificacao(notificacao);
    }, 0);
  }

  cadastrar() {
    
  }

  togglePasswordVisibility(){
    this.showPassword = !this.showPassword;
  }

}

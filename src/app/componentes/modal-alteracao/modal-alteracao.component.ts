import { Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2  } from '@angular/core';
import { RegistroPonto } from '../../interface/ponto/registro-ponto';
import { CapitalizePipe } from "../../shared/capitalize.pipe";

@Component({
  selector: 'app-modal-alteracao',
  imports: [],
  templateUrl: './modal-alteracao.component.html',
  styleUrl: './modal-alteracao.component.css'
})
export class ModalAlteracaoComponent {

  @Output() fecharModal = new EventEmitter<void>();
  @Input() usuario = '';
  @Input() registro: RegistroPonto | undefined;
  
  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
  ) {}

  @HostListener("document:keydown.escape") fecharModalComEsc(){
    this.fecharModal.emit();
    this.renderer.setStyle(this.element.nativeElement.ownerDocument.body, 'overflow', 'auto');
  }

  fechar() {
    this.fecharModal.emit();
    this.renderer.setStyle(this.element.nativeElement.ownerDocument.body, 'overflow', 'auto');
  }

}

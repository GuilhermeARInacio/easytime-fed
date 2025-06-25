import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAlteracaoComponent } from './modal-alteracao.component';

describe('ModalAlteracaoComponent', () => {
  let component: ModalAlteracaoComponent;
  let fixture: ComponentFixture<ModalAlteracaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAlteracaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAlteracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

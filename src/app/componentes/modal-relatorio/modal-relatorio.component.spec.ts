import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRelatorioComponent } from './modal-relatorio.component';

describe('ModalRelatorioComponent', () => {
  let component: ModalRelatorioComponent;
  let fixture: ComponentFixture<ModalRelatorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRelatorioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRelatorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

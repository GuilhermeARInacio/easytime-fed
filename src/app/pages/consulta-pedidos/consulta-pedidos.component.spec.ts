import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaPedidosComponent } from './consulta-pedidos.component';

describe('ConsultaPedidosComponent', () => {
  let component: ConsultaPedidosComponent;
  let fixture: ComponentFixture<ConsultaPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaPedidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

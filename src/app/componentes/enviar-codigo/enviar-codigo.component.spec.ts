import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarCodigoComponent } from './enviar-codigo.component';

describe('EnviarCodigoComponent', () => {
  let component: EnviarCodigoComponent;
  let fixture: ComponentFixture<EnviarCodigoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnviarCodigoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnviarCodigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

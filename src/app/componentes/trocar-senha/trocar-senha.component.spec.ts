import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrocarSenhaComponent } from './trocar-senha.component';
import { ActivatedRoute } from '@angular/router';

describe('TrocarSenhaComponent', () => {
  let component: TrocarSenhaComponent;
  let fixture: ComponentFixture<TrocarSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrocarSenhaComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: {} } // Mocking ActivatedRoute if needed
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrocarSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

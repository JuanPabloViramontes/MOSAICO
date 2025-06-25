import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPracticaComponent } from './modal-practica.component';

describe('ModalPracticaComponent', () => {
  let component: ModalPracticaComponent;
  let fixture: ComponentFixture<ModalPracticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPracticaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPracticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

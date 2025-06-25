import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-practica',
  standalone: false,
  templateUrl: './modal-practica.component.html',
  styleUrls: ['./modal-practica.component.css'],
})
export class ModalPracticaComponent {
  @Input() show = false;
  @Input() practica: any;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}

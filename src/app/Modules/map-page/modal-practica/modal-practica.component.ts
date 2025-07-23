import { Component, EventEmitter, Input, Output, ElementRef, ViewChild  } from '@angular/core';

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
  @Input() filteredData: any[] = [];
  @ViewChild('pdfContent', { static: false }) pdfContentRef!: ElementRef;

volumeLinks: Record<string, string> = {
  'Volumen 1': 'https://mexico.iom.int/sites/g/files/tmzbdl1686/files/documents/2025-07/volumen-1-buenas-practicas-en-politica-migratoria.pdf',
  'Volumen 2': 'https://mexico.iom.int/sites/g/files/tmzbdl1686/files/documents/2024-07/buenas-practicas-volumen-2_final.pdf',
  'Volumen 3':  'https://mexico.iom.int/sites/g/files/tmzbdl1686/files/documents/2025-07/volumen-3-buenas-practicas_web.pdf'
};

openVolumeDoc(volumen: string | undefined) {
  if (!volumen) {
    return;
  }

  const url = this.volumeLinks[volumen];
  if (url) {
    window.open(url, '_blank');
  } else {
    alert('Documento no disponible para ' + volumen);
  }
}

  close() {
    this.closeModal.emit();
  }
  }

  
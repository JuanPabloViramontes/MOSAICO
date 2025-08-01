import { Component } from '@angular/core';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
  standalone: false,
})
export class DocumentsComponent {
  documents = [
    {
      title: 'Buenas Prácticas en Política Migratoria desde el Ámbito Local - Volumen 1',
      link: 'https://mexico.iom.int/sites/g/files/tmzbdl1686/files/documents/2025-07/volumen-1-buenas-practicas-en-politica-migratoria.pdf'
    },
    {
      title: 'Buenas Prácticas en Política Migratoria desde el Ámbito Local - Volumen 2',
      link: 'https://mexico.iom.int/sites/g/files/tmzbdl1686/files/documents/2024-07/buenas-practicas-volumen-2_final.pdf'
    },
    {
      title: 'Buenas Prácticas en Política Migratoria desde el Ámbito Local - Volumen 3',
      link: 'https://mexico.iom.int/sites/g/files/tmzbdl1686/files/documents/2025-07/volumen-3-buenas-practicas_web.pdf'
    },
    {
      title: 'Guía de elementos esenciales para la creación de política migratoria a nivel local en materia de integración',
      description: 'Herramienta práctica dirigida a gobiernos locales para diseñar políticas de integración y reintegración de personas migrantes, con enfoque de atención integral y adaptación a contextos locales diversos.',
      link: 'https://mexico.iom.int/sites/g/files/tmzbdl1686/files/documents/2024-07/guia-de-elementos-esenciales-para-publicacion.pdf'
    },
  ];
}

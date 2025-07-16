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
      link: 'assets/docs/informe-tecnico.pdf'
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
      title: 'Protocolo de Atención a Personas en Contexto de Movilidad para Gobiernos Municipales',
      description: 'Herramienta elaborada por 11 municipios en el marco del Proyecto PROFIL. Ofrece lineamientos para acompañar a personas en movilidad en procesos de regularización, acceso a servicios y protección de derechos, facilitando su integración local.',
      link: 'https://www.bivica.org/file/view/id/6995'
    },
    {
      title: 'Guía de Elementos Esenciales',
      description: 'Herramienta práctica dirigida a gobiernos locales para diseñar políticas de integración y reintegración de personas migrantes, con enfoque de atención integral y adaptación a contextos locales diversos.',
      link: 'https://mexico.iom.int/sites/g/files/tmzbdl1686/files/documents/2024-07/guia-de-elementos-esenciales-para-publicacion.pdf'
    },
  ];
}

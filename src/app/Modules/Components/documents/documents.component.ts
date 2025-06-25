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
      title: 'Protocolo de Atención a Personas en Contexto de Movilidad para Gobiernos Municipales',
      description: 'Documento con lineamientos clave para implementación efectiva.',
      link: 'https://www.bivica.org/file/view/id/6995'
    },
    {
      title: 'Guía de Elementos Esenciales',
      description: 'Procedimientos detallados para usuarios y operadores.',
      link: 'https://mexico.iom.int/sites/g/files/tmzbdl1686/files/documents/2024-07/guia-de-elementos-esenciales-para-publicacion.pdf'
    },
    {
      title: 'Volumen 1 de las buenas prácticas migrantes',
      description: 'Resumen de hallazgos y resultados técnicos relevantes.',
      link: 'assets/docs/informe-tecnico.pdf'
    },
    {
      title: 'Volumen 2 de las buenas prácticas migrantes',
      description: 'Documento con fundamentos normativos y organizacionales.',
      link: 'https://mexico.iom.int/sites/g/files/tmzbdl1686/files/documents/2024-07/buenas-practicas-volumen-2_final.pdf'
    },
    {
      title: 'Volumen 2 de las buenas prácticas migrantes',
      description: 'Síntesis de alto nivel para tomadores de decisiones.',
      link: 'assets/docs/resumen-ejecutivo.pdf'
    }
  ];
}

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

interface Practica {
  estado: string;
  poblaciones: string[];
  subcategoria: string; 
  criterios?: string[];
}

interface Conteo {
  clave: string;
  total: number;
}

@Component({
  selector: 'app-mosaico',
  templateUrl: './mosaico.component.html',
  standalone: false,
  encapsulation: ViewEncapsulation.None
})
export class MosaicoComponent implements OnInit {
  estadosActivos: Conteo[] = [];
  poblacionesCubiertas: Conteo[] = [];
  categoriasInnovadoras: Conteo[] = [];
  subcategoriasSinPractica: string[] = [];
  subcategoriasSinPracticaTexto = '';
  vaciosTexto = '';
  flipped = false;

  practicas: Practica[] = [
    { estado: 'CDMX', poblaciones: ['niños', 'mujeres'], subcategoria: '4.1 Consejos estatales', criterios: ['innovación'] },
    { estado: 'Jalisco', poblaciones: ['mujeres'], subcategoria: '7.2 Acceso a la educación', criterios: ['escalabilidad'] },
    { estado: 'CDMX', poblaciones: ['personas mayores'], subcategoria: '6.1 Vinculación entre los albergues y otras instancias.', criterios: ['innovación'] },
    { estado: 'Nuevo León', poblaciones: ['niños'], subcategoria: '10.1 Fortalecimiento de los vínculos culturales', criterios: ['innovación'] },
    { estado: 'Oaxaca', poblaciones: ['pueblos indígenas'], subcategoria: '5.1 Jornadas de regularización' },
  ];

  categoriasConSubcategorias = [
    { categoria: '1. Buenas prácticas en la creación o reforma...', subcategorias: [
      '1.1 Leyes y reglamentos que facultan...',
      '1.2 Reformas a leyes y reglamentos...'
    ] },
    { categoria: '2. Buenas prácticas para optimizar capacidades...', subcategorias: [
      '2.1 Registros estatales de migrantes...',
      '2.2 Mecanismos para garantizar acceso...'
    ] },
    { categoria: '3. Buenas prácticas en la creación y fortalecimiento...', subcategorias: [] },
    { categoria: '4. Buenas prácticas en el establecimiento...', subcategorias: [
      '4.1 Consejos estatales',
      '4.2 Consejos consultivos',
      '4.3 Mecanismos para articular...',
      '4.4 Vinculación entre estados.'
    ] },
    { categoria: '5. Buenas prácticas que propicien una vinculación...', subcategorias: [
      '5.1 Jornadas de regularización'
    ] },
    { categoria: '6. Buenas prácticas para garantizar servicios...', subcategorias: [
      '6.1 Vinculación entre los albergues y otras instancias.',
      '6.2 Instalación y rehabilitación de albergues del estado.',
      '6.3 Apoyos para albergues de la sociedad civil'
    ] },
    { categoria: '7. Buenas prácticas en la transversalización...', subcategorias: [
      '7.1 Acceso a los servicios de salud',
      '7.2 Acceso a la educación',
      '7.3 Garantizar el derecho a la identidad...',
      '7.4 Garantizar la seguridad...',
      '7.5 Acceso a la justicia'
    ] },
    { categoria: '8. Buenas prácticas en programas asistencialistas', subcategorias: [
      '8.1 Apoyos económicos o en especie'
    ] },
    { categoria: '9. Buenas prácticas que fomentan el empleo...', subcategorias: [
      '9.1 Apoyos económicos para proyectos de autoempleo'
    ] },
    { categoria: '10. Buenas prácticas para la inclusión sociocultural', subcategorias: [
      '10.1 Fortalecimiento de los vínculos culturales'
    ] },
    { categoria: '11. Buenas prácticas en procesos de sensibilización...', subcategorias: [] },
    { categoria: '12. Buenas prácticas para crisis migratoria', subcategorias: [] },
    { categoria: '13. Buenas prácticas en reunificación familiar', subcategorias: [
      '13.1. Reunificación familiar temporal'
    ] }
  ];

  ngOnInit(): void {
    this.estadosActivos = this.contarPor('estado');
    this.poblacionesCubiertas = this.contarPorPoblacion();
    this.categoriasInnovadoras = this.contarPorCriterio('innovación');
    this.subcategoriasSinPractica = this.getSubcategoriasSinCobertura();
    this.subcategoriasSinPracticaTexto = `Hay ${this.subcategoriasSinPractica.length} subcategorías sin prácticas asociadas.`;
    this.vaciosTexto = this.getVacios();
  }

  contarPor(prop: keyof Practica): Conteo[] {
    const conteo: { [key: string]: number } = {};
    this.practicas.forEach(p => {
      const clave = p[prop];
      if (typeof clave === 'string') {
        conteo[clave] = (conteo[clave] || 0) + 1;
      }
    });
    return Object.entries(conteo).map(([clave, total]) => ({ clave, total }));
  }

  contarPorPoblacion(): Conteo[] {
    const conteo: { [key: string]: number } = {};
    this.practicas.forEach(p => {
      p.poblaciones.forEach(poblacion => {
        conteo[poblacion] = (conteo[poblacion] || 0) + 1;
      });
    });
    return Object.entries(conteo).map(([clave, total]) => ({ clave, total }));
  }

  contarPorCriterio(criterio: string): Conteo[] {
    const conteo: { [key: string]: number } = {};
    this.practicas.forEach(p => {
      if (p.criterios?.includes(criterio)) {
        conteo[p.subcategoria] = (conteo[p.subcategoria] || 0) + 1;
      }
    });
    return Object.entries(conteo).map(([clave, total]) => ({ clave, total }));
  }

  getSubcategoriasSinCobertura(): string[] {
    const todas = this.categoriasConSubcategorias.flatMap(c => c.subcategorias);
    const conPractica = new Set(this.practicas.map(p => p.subcategoria));
    return todas.filter(s => !conPractica.has(s));
  }

  getVacios(): string {
    const estadosEsperados = ['CDMX', 'Jalisco', 'Nuevo León', 'Oaxaca', 'Chiapas', 'Puebla'];
    const conPractica = new Set(this.practicas.map(p => p.estado));
    const faltantes = estadosEsperados.filter(e => !conPractica.has(e));
    return faltantes.length
      ? `Faltan prácticas en: ${faltantes.join(', ')}`
      : 'No hay vacíos territoriales detectados.';
  }

  getColor(index: number): string {
    const colors = ['#6D9DC5', '#F4A259', '#8CD17D', '#FF6F59', '#4D9078'];
    return colors[index % colors.length];
  }

  getColorCard(index: number): string {
    const colors = [
      '#A3CEF1', // pastel azul
      '#F8B195', // pastel rosa
      '#C06C84', // oscuro vino
      '#355C7D', // azul oscuro
      '#6C5B7B', // morado oscuro
      '#F67280', // coral
      '#99B898', // verde pastel
      '#FF847C', // salmón
      '#E84A5F', // rojo oscuro
      '#2A363B', // gris oscuro
      '#E0BBE4', // lavanda pastel
      '#FEC8D8'  // rosado pastel
    ];
    return colors[index % colors.length];
  }

  getConteoPorSubcategoria(subcategoria: string): number {
    return this.practicas.filter(p => p.subcategoria === subcategoria).length;
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.categoriasConSubcategorias,
      event.previousIndex,
      event.currentIndex
    );
  }
}

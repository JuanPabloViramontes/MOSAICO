import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { forkJoin } from 'rxjs';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-matriz',
  templateUrl: './matriz.component.html',
  styleUrls: ['./matriz.component.css'],
  standalone: false
})
export class MatrizComponent implements OnInit, OnChanges {
  currentDate: Date = new Date();
  @Input() selectedRegions: string[] = [];
  @Input() selectedState: string | null = null;
  @Input() selectedCategories: number[] = [];
  @Input() selectedBorders: string[] = [];
  @Input() selectedNaturalezas: string[] = [];
  @Input() selectedPoblacionObjetivo: string[] = [];
  @Input() mostrarSoloInterseccionalidad: boolean = false; 
  @Input() selectedTiposDeActor: string | null = null;
  @Output() onDownloadPDF = new EventEmitter<{practica: any, filteredData: any[]}>();
  @Output() filteredStatesChanged = new EventEmitter<string[]>();

descargarPDF(): void {
  const fecha = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

  const container = document.createElement('div');

  // Estilo global para que no se corte
  container.style.transform = 'scale(0.8)';
  container.style.transformOrigin = 'top left';
  container.style.width = '125%'; // importante para que el escalado no corte contenido

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="assets/images/oim-logo.png" alt="Logo OIM" height="60" />
      <h2 style="margin: 0;">Matriz de Buenas Prácticas</h2>
      <h5 style="margin: 0;">Gobiernos locales y migración en México</h5>
      <p style="margin-top: 10px; font-size: 0.9rem;">Fecha de descarga: ${fecha}</p>
    </div>
    <p style="font-size: 0.95rem; text-align: justify;">
      Este documento presenta un conjunto de buenas prácticas implementadas por gobiernos locales en coordinación con diversos actores,
      con el objetivo de atender los retos asociados a la movilidad humana en México. La información contenida es útil para tomadores
      de decisiones, organizaciones de la sociedad civil, y cualquier entidad interesada en replicar o adaptar iniciativas exitosas
      en sus territorios.
    </p>
  `;

  // Clonar tabla
  const tabla = document.querySelector('#matrizTabla')?.cloneNode(true) as HTMLElement;
  if (tabla) {
    container.appendChild(tabla);
  } else {
    console.error('No se encontró la tabla');
    return;
  }

  // Estilos para que se vea mejor en PDF
  const style = document.createElement('style');
  style.textContent = `
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 4px;
      text-align: center;
      vertical-align: top;
      white-space: normal;
      word-wrap: break-word;
    }
    th {
      background-color: #e0e7ff;
    }
  `;
  container.appendChild(style);

  // PDF config
  const options = {
    margin:       [5, 5, 5, 5],
    filename:     'Matriz_Buenas_Practicas.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
  };

  html2pdf().set(options).from(container).save();
}


  matrizNivel: 'resumido' | 'intermedio' | 'completo' = 'completo';

  borderStatesMap: { [key: string]: string[] } = {
    frontera_norte: ['Baja California', 'Sonora', 'Chihuahua', 'Coahuila', 'Nuevo León', 'Tamaulipas'],
    frontera_sur: ['Chiapas', 'Tabasco', 'Campeche', 'Quintana Roo']
  };
  
  regionStatesMap: { [key: string]: string[] } = {
    norte: ['Baja California', 'Baja California Sur', 'Sonora', 'Chihuahua', 'Coahuila', 'Nuevo León', 'Tamaulipas', 'Sinaloa', 'Durango'],
    occidente: ['Nayarit', 'Zacatecas', 'Jalisco', 'Aguascalientes', 'Colima', 'Guanajuato', 'Michoacán', 'San Luis Potosí'],
    centro: ['Querétaro', 'Hidalgo', 'México', 'Ciudad de México', 'Tlaxcala', 'Morelos', 'Puebla'],
    sureste: ['Guerrero', 'Veracruz', 'Oaxaca', 'Tabasco', 'Chiapas', 'Yucatán', 'Campeche', 'Quintana Roo']
  };

  allData: any[] = [];

  constructor(private http: HttpClient) {}
  modalVisible = false;
  selectedPractica: any = null;

  ngOnInit(): void {
    forkJoin([
      this.http.get<any>('assets/data/volumen-1.json'),
      this.http.get<any>('assets/data/volumen-2.json'),
      this.http.get<any>('assets/data/volumen-3.json')
    ]).subscribe({
      next: ([res1, res2, res3]) => {
        const vol1Data = res1.buenas_practicas1 || [];
        const vol2Data = res2.buenas_practicas2 || [];
        const vol3Data = res3.buenas_practicas3 || [];
  
        console.log('Volumen 1:', vol1Data.length, 'objetos');
        console.log('Volumen 2:', vol2Data.length, 'objetos');
        console.log('Volumen 3:', vol3Data.length, 'objetos');
  
        this.allData = [...vol2Data, ...vol3Data, ...vol1Data];
      },
      error: (err) => {
        console.error('Error al cargar uno de los volúmenes:', err);
        this.allData = [];
      }
    });
  }

 ngOnChanges() {
  this.emitFilteredStates();
}

  
  // Agrega esta propiedad
searchTerm: string = '';

// Modifica el getter filteredData para incluir la búsqueda
get filteredData(): any[] {
   const hasSearch = !!this.searchTerm?.trim();

  if (this.showAllPracticas) {
    const all = this.allData;
    return hasSearch
      ? all.filter(row => Object.values(row).some(val =>
          val && val.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        ))
      : all;
  }


  const hasRegion = this.selectedRegions.length > 0;
  const hasBorder = this.selectedBorders.length > 0;
  const hasState = !!this.selectedState;
  const hasCategory = this.selectedCategories.length > 0;
  const hasNaturaleza = this.selectedNaturalezas.length > 0;
  const hasPoblacion = this.selectedPoblacionObjetivo.length > 0;
  const hasInterseccionalidad = this.mostrarSoloInterseccionalidad;
  const hasTipoDeActor = !!this.selectedTiposDeActor;


  const hasAnyFilter = hasRegion || hasBorder || hasState || hasCategory || hasNaturaleza || hasPoblacion || hasInterseccionalidad || hasTipoDeActor || hasSearch;

  // Si no hay filtros activos, no mostrar nada
  if (!hasAnyFilter) {
    return [];
  }

  // 🔁 Obtener todos los estados que coinciden por filtro
  const statesFromBorders = hasBorder ? this.selectedBorders.flatMap(border => this.borderStatesMap[border] || []) : [];
  const statesFromRegions = hasRegion ? this.selectedRegions.flatMap(region => this.regionStatesMap[region] || []) : [];
  const statesFromState = hasState && this.selectedState ? [this.selectedState] : [];

  // 🔁 Intersección entre los filtros geográficos
  let geographicStates: string[] = [];

  if (hasRegion || hasBorder || hasState) {
  const sets = [statesFromBorders, statesFromRegions, statesFromState]
    .filter(arr => arr.length > 0)
    .map(arr => new Set(arr.map(s => s.trim().toLowerCase())));

  if (sets.length === 0) {
    geographicStates = [];
  } else if (sets.length === 1) {
    geographicStates = Array.from(sets[0]);
  } else {
    geographicStates = Array.from(
      sets.reduce((a, b) => new Set([...a].filter(x => b.has(x))))
    );
  }

  if (geographicStates.length === 0) {
    return [];
  }
}


  return this.allData.filter(row => {
    const rowState = row.estado?.trim().toLowerCase();
    const categoriaNum = parseInt(row.categoria?.split('.')[0], 10);
    const naturaleza = row.naturaleza_politica_publica?.trim();
    const tiposActoresArray: string[] = Array.isArray(row.tipos_actores)
  ? row.tipos_actores
  : typeof row.tipos_actores === 'string'
    ? row.tipos_actores.split(',').map((a: string) => a.trim())
    : [];

const selectedActor = this.selectedTiposDeActor?.toLowerCase().trim();

const matchesTipoDeActor = !hasTipoDeActor || tiposActoresArray.some(
  actor => actor.toLowerCase().trim() === selectedActor
);

    const poblacionObj = row.poblacion_objetivo || {};
    const matchesGeo = geographicStates.length === 0 || geographicStates.includes(rowState);
    const matchesCategory = !hasCategory || this.selectedCategories.includes(categoriaNum);
    const matchesNaturaleza = !hasNaturaleza || this.selectedNaturalezas.includes(naturaleza);
    const matchesPoblacion = !hasPoblacion || this.selectedPoblacionObjetivo.some(key => poblacionObj[key] === 1);
    const matchesInterseccionalidad = !hasInterseccionalidad || Object.values(poblacionObj).filter(val => val === 1).length > 1;
    const matchesSearch = !hasSearch || Object.values(row).some(val =>
      val && val.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // 👇 Lógica AND: debe cumplir todo lo activo
    return matchesGeo &&
           matchesCategory &&
           matchesNaturaleza &&
           matchesPoblacion &&
           matchesInterseccionalidad &&
           matchesSearch &&
          matchesTipoDeActor;
  });
}

get stateCounts(): { [estado: string]: number } {
  const counts: { [estado: string]: number } = {};

  for (const row of this.filteredData) {
    const estado = row.estado?.trim();
    if (estado) {
      counts[estado] = (counts[estado] || 0) + 1;
    }
  }

  return counts;
}

@Output() filteredStateCountsChanged = new EventEmitter<{ [estado: string]: number }>();

emitFilteredStates(): void {
  const estados = this.filteredData.map(item => item.estado?.trim()).filter(Boolean);
  const counts: { [estado: string]: number } = {};
  estados.forEach(estado => {
    counts[estado] = (counts[estado] || 0) + 1;
  });

  this.filteredStatesChanged.emit([...new Set(estados)]);
  this.filteredStateCountsChanged.emit(counts);
  
}

showAllPracticas: boolean = false;
toggleShowAll() {
  this.showAllPracticas = !this.showAllPracticas;
}


clearFilters() {
  this.selectedRegions = [];
  this.selectedState = null;
  this.selectedCategories = [];
  this.selectedBorders = [];
  this.selectedNaturalezas = [];
  this.selectedPoblacionObjetivo = [];
  this.mostrarSoloInterseccionalidad = false;
  this.searchTerm = '';
  this.showAllPracticas = true; 
  this.selectedTiposDeActor = null;
}

formatTiposActores(tiposActores: string[] | string | undefined): string {
  if (!tiposActores) return '';
  if (Array.isArray(tiposActores)) {
    return tiposActores.join(', ');
  } else if (typeof tiposActores === 'string') {
    return tiposActores;
  }
  return '';
}

getPoblacionEmojis(poblacion: any): string {
  if (!poblacion) return '';

  const emojis = [];

  if (poblacion.retornados === 1) emojis.push('🔁🙋‍♂️');
  if (poblacion.transito === 1) emojis.push('🚶‍♀️🌫️');
  if (poblacion.mexicanos_extranjero === 1) emojis.push('🇲🇽🤝🌍');
  if (poblacion.refugiados_asilados === 1) emojis.push('🛡️🧍');
  if (poblacion.migracion_destino === 1) emojis.push('🌍🧑‍🤝‍🧑');
  if (poblacion.migracion_interna === 1) emojis.push('🏘️🔄');
  if (poblacion.poblacion_no_migrante === 1) emojis.push('📍🧑‍🤝‍🧑');
  if (poblacion.personas_desplazadas === 1) emojis.push('⚠️🏚️');

  return emojis.join(', ');
}

 
// Método para aplicar la búsqueda
applySearch() {
  // El getter filteredData ya se actualiza automáticamente
}


  openModal(practica: any) {
    this.selectedPractica = practica;
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
    this.selectedPractica = null;
  }
   }
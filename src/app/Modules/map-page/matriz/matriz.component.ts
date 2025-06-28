import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-matriz',
  templateUrl: './matriz.component.html',
  styleUrls: ['./matriz.component.css'],
  standalone: false
})
export class MatrizComponent implements OnInit, OnChanges {
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


descargarPDF(practica: any) {
  this.onDownloadPDF.emit({
    practica: practica,
    filteredData: this.filteredData
  });
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
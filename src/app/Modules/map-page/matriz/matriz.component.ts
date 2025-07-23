import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import html2pdf from 'html2pdf.js';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
declare var bootstrap: any;

@Component({
  selector: 'app-matriz',
  templateUrl: './matriz.component.html',
  styleUrls: ['./matriz.component.css'],
  standalone: false
})
export class MatrizComponent implements OnInit, OnChanges {
  @Input() mapElement: HTMLElement | null = null; 
  @Input() showAllPracticas: boolean = true;
  @ViewChild('matrizTabla', { static: false }) matrizTablaRef!: ElementRef;
  @Input() modoResumen: 'resumido' | 'intermedio' | 'detallado' | 'completo' = 'resumido';
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
  @Output() filteredStateCountsChanged = new EventEmitter<{ [estado: string]: number }>();
  filtrosActivos: any = {};
  currentDate: Date = new Date();
  allData: any[] = [];
  modalVisible = false;
  selectedPractica: any = null;

  poblacionObjetivo = [
    { key: 'retornados', label: 'Retornados', unicode: '0031' },
    { key: 'transito', label: 'En tránsito', unicode: '0032' },
    { key: 'mexicanos_extranjero', label: 'Mexicanos en el extranjero', unicode: '0033' },
    { key: 'refugiados_asilados', label: 'Refugiados y asilados', unicode: '0034' },
    { key: 'migracion_destino', label: 'Migración de destino', unicode: '0035' },
    { key: 'migracion_interna', label: 'Migración interna', unicode: '0036' },
    { key: 'poblacion_no_migrante', label: 'Población no migrante', unicode: '0037' },
    { key: 'personas_desplazadas', label: 'Personas desplazadas', unicode: '0038' }
  ];

  matrizNivel: 'resumido' | 'intermedio' | 'completo' = 'resumido';

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

  ngAfterViewInit(): void {
    this.initializeTooltips();
  }

ngOnChanges() {
    this.emitFilteredStates();
    setTimeout(() => this.initializeTooltips(), 0);
  }

initializeTooltips(): void {
  const tooltipTriggerList = Array.from(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.forEach((el) => new bootstrap.Tooltip(el));
}

async descargarPDF(): Promise<void> {
  const fecha = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const container = document.createElement('div');
  container.style.fontFamily = 'Inter, Arial, sans-serif';
  container.style.width = '297mm';
  container.style.margin = '0 auto';
  container.style.padding = '0';
  container.style.backgroundColor = '#ffffff';

  const portada = document.createElement('div');
  portada.style.padding = '20mm 15mm';
  portada.style.pageBreakAfter = 'always';
  portada.style.height = '190mm';
  portada.style.display = 'flex';
  portada.style.flexDirection = 'column';
  portada.style.justifyContent = 'space-between';

  portada.innerHTML = `
    <div>
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="assets/images/logos.jpg" alt="Logos"
          style="width: 100%; max-width: 500px; height: auto;"
          onerror="this.onerror=null;this.src='https://placehold.co/600x150/0c2e8d/ffffff?text=Logos+Placeholder';" />
      </div>
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="assets/images/Banner.jpg" alt="Banner"
          style="width: 100%; max-width: 600px; height: auto; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.2);" 
          onerror="this.onerror=null;this.src='https://placehold.co/600x200/1e40af/ffffff?text=Banner+Placeholder';" />
      </div>
      <div style="border-bottom: 4px solid #0c2e8d; width: 60%; margin: 30px auto;"></div>
      <h1 style="text-align: center; color: #0c2e8d; font-size: 2.5rem; margin: 20px 0;">Matriz de Buenas Prácticas</h1>
      <h3 style="text-align: center; color: #1e40af; font-size: 1.5rem;">Buenas prácticas en contexto migratorio a nivel local</h3>
      <p style="text-align: center; color: #6b7280; font-size: 1.1rem;">Fecha de descarga: ${fecha}</p>
    </div>
    <div style="text-align: justify; color: #111827; line-height: 1.6; font-size: 1rem;">
      <p>Este documento reúne un conjunto de buenas prácticas impulsadas por gobiernos locales en coordinación con diversos actores
      para atender los desafíos vinculados a la atención de personas migrantes y en otros procesos de movilidad en México.</p>
      <p>La información aquí presentada corresponde a los filtros seleccionados en el mapa interactivo de Mosaico y ofrece
      herramientas útiles para tomadores de decisiones, organizaciones de la sociedad civil y cualquier instancia interesada
      en replicar o adaptar experiencias exitosas en sus territorios.</p>
    </div>
  `;
  container.appendChild(portada);

  const filtrosYMapa = document.createElement('div');
  filtrosYMapa.style.padding = '20mm 15mm';
  filtrosYMapa.style.pageBreakAfter = 'always';
  filtrosYMapa.style.height = '190mm';

  filtrosYMapa.innerHTML = `
    <h2 style="text-align: center; color: #0c2e8d; margin-bottom: 25px; font-size: 2rem;">Detalles de la Búsqueda y Visualización</h2>
    <div style="margin: 20px auto; padding: 20px; border-left: 6px solid #1e40af; background-color: #f0f8ff; border-radius: 10px; max-width: 100%;">
      <h3 style="color: #1e40af; margin-bottom: 15px; font-size: 1.3rem;">Filtros Aplicados</h3>
      <ul style="padding-left: 25px; color: #1f2937; font-size: 1rem; line-height: 1.6;">
        <li><strong>Regiones:</strong> ${this.selectedRegions.length ? this.selectedRegions.join(', ') : 'Ninguna'}</li>
        <li><strong>Fronteras:</strong> ${this.selectedBorders.length ? this.selectedBorders.join(', ') : 'Ninguna'}</li>
        <li><strong>Categorías:</strong> ${this.selectedCategories.length ? this.selectedCategories.join(', ') : 'Ninguna'}</li>
        <li><strong>Naturaleza de política pública:</strong> ${this.selectedNaturalezas.length ? this.selectedNaturalezas.join(', ') : 'Ninguna'}</li>
        <li><strong>Población objetivo:</strong> ${this.selectedPoblacionObjetivo.length ? this.selectedPoblacionObjetivo.map(key => this.poblacionObjetivo.find(p => p.key === key)?.label || key).join(', ') : 'Ninguna'}</li>
        <li><strong>Interseccionalidad:</strong> ${this.mostrarSoloInterseccionalidad ? 'Sí' : 'No'}</li>
        <li><strong>Tipo de actor:</strong> ${this.selectedTiposDeActor || 'Ninguno'}</li>
      </ul>
    </div>
  `;

  if (this.mapElement) {
    try {
      const canvas = await html2canvas(this.mapElement, {
        scale: 1.2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        width: this.mapElement.offsetWidth,
        height: this.mapElement.offsetHeight,
        ignoreElements: (el: Element) => el.classList.contains('tooltip') || el.tagName === 'BUTTON'
      });

      const img = document.createElement('img');
      img.src = canvas.toDataURL('image/png');
      img.style.maxWidth = '70%'; 
      img.style.maxHeight = '45%'; 
      img.style.display = 'block';
      img.style.margin = '15px auto'; 
      img.style.borderRadius = '8px';
      img.style.border = '3px solid #dbeafe';

      filtrosYMapa.appendChild(img);
    } catch (err) {
      const errorMsg = document.createElement('p');
      errorMsg.style.textAlign = 'center';
      errorMsg.style.color = 'red';
      errorMsg.textContent = 'No se pudo generar imagen del mapa.';
      filtrosYMapa.appendChild(errorMsg);
    }
  }

  container.appendChild(filtrosYMapa);

  const matrizSection = document.createElement('div');
  matrizSection.style.padding = '15mm 5mm'; 

  const tituloMatriz = document.createElement('h2');
  tituloMatriz.style.textAlign = 'center';
  tituloMatriz.style.color = '#0c2e8d';
  tituloMatriz.style.marginBottom = '15px';
  tituloMatriz.style.fontSize = '1.5rem';
  tituloMatriz.textContent = 'Matriz de Buenas Prácticas Detallada';
  
  matrizSection.appendChild(tituloMatriz);

  const originalTable = document.getElementById('matrizTabla');
  if (originalTable) {
    const tableClone = originalTable.cloneNode(true) as HTMLElement;

    tableClone.style.width = '100%';
    tableClone.style.tableLayout = 'fixed';
    tableClone.style.borderCollapse = 'collapse';
    tableClone.style.fontSize = '7px';
    tableClone.style.lineHeight = '1.2';
    tableClone.style.marginTop = '10px';
    tableClone.style.marginLeft = '-3mm'; 
    tableClone.style.pageBreakInside = 'auto';
    tableClone.style.wordWrap = 'break-word';

    const headers = tableClone.querySelectorAll('th');
    const columnWidths = [
      '7%',  
      '11%',  
      '4%',  
      '8%',   
      '14%',  
      '11%',  
      '12%',  
      '8%',   
      '13%', 
      '12%' 
    ];

    headers.forEach((th, index) => {
      if (columnWidths[index]) {
        (th as HTMLElement).style.width = columnWidths[index];
        (th as HTMLElement).style.minWidth = columnWidths[index];
        (th as HTMLElement).style.maxWidth = columnWidths[index];
      }
      (th as HTMLElement).style.backgroundColor = '#1e40af';
      (th as HTMLElement).style.color = 'white';
      (th as HTMLElement).style.padding = '5px 2px'; 
      (th as HTMLElement).style.border = '1px solid #1e3a8a';
      (th as HTMLElement).style.fontSize = '7px';
      (th as HTMLElement).style.fontWeight = 'bold';
      (th as HTMLElement).style.textAlign = 'center';
      (th as HTMLElement).style.verticalAlign = 'middle';
      (th as HTMLElement).style.wordWrap = 'break-word';
      (th as HTMLElement).style.hyphens = 'auto';
    });

    const rows = tableClone.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      cells.forEach((td, index) => {
        if (columnWidths[index]) {
          (td as HTMLElement).style.width = columnWidths[index];
          (td as HTMLElement).style.minWidth = columnWidths[index];
          (td as HTMLElement).style.maxWidth = columnWidths[index];
        }
        (td as HTMLElement).style.padding = '4px 2px'; 
        (td as HTMLElement).style.border = '1px solid #d1d5db';
        (td as HTMLElement).style.fontSize = '6px';
        (td as HTMLElement).style.verticalAlign = 'top';
        (td as HTMLElement).style.wordWrap = 'break-word';
        (td as HTMLElement).style.hyphens = 'auto';
        (td as HTMLElement).style.overflowWrap = 'break-word';
        (td as HTMLElement).style.textAlign = 'left';
        
      });
    });

    matrizSection.appendChild(tableClone);
  }

  container.appendChild(matrizSection);

  const options = {
    margin: [5, 3, 5, 3],
    filename: `Matriz_Buenas_Practicas_${fecha.replace(/[/]/g, '-')}.pdf`,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      dpi: 150,
      letterRendering: true,
      ignoreElements: (el: Element) => el.classList.contains('no-print')
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'landscape'
    },
    pagebreak: {
      mode: ['avoid-all', 'css'],
      before: '.page-break-before',
      after: '.page-break-after'
    }
  };

  try {
    await html2pdf().set(options).from(container).save();
  } catch (error) {
    console.error('Error generando PDF:', error);
  }
}

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

ngOnInit(): void {
  forkJoin([
    this.http.get<any>('assets/data/volumen-1.json'),
    this.http.get<any>('assets/data/volumen-2.json'),
    this.http.get<any>('assets/data/volumen-3.json')
  ]).subscribe({
    next: ([res1, res2, res3]) => {
      const vol1Data = res1.buenas_practicas1 || [];
      let vol2Data = res2.buenas_practicas2 || [];
      const vol3Data = res3.buenas_practicas3 || [];

      vol2Data = vol2Data.map((item: any) => ({
        ...item,
        buena_practica: item.buena_practica?.toUpperCase?.() || ''
      }));

      this.allData = [...vol2Data, ...vol3Data, ...vol1Data];
    },
    error: (err) => {
      this.allData = [];
    }
  });
}
searchTerm: string = '';
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
 if (this.showAllPracticas) {
    return this.allData.filter(row => {
      return !hasSearch || Object.values(row).some(val =>
        val && val.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
  }
  if (!hasAnyFilter) {
    return [];
  }

  const statesFromBorders = hasBorder ? this.selectedBorders.flatMap(border => this.borderStatesMap[border] || []) : [];
  const statesFromRegions = hasRegion ? this.selectedRegions.flatMap(region => this.regionStatesMap[region] || []) : [];
  const statesFromState = hasState && this.selectedState ? [this.selectedState] : [];

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

emitFilteredStates(): void {
  const estados = this.filteredData.map(item => item.estado?.trim()).filter(Boolean);
  const counts: { [estado: string]: number } = {};
  estados.forEach(estado => {
    counts[estado] = (counts[estado] || 0) + 1;
  });

  this.filteredStatesChanged.emit([...new Set(estados)]);
  this.filteredStateCountsChanged.emit(counts);
  
}

toggleShowAll() {
  this.showAllPracticas = !this.showAllPracticas;
  this.applySearch(); 
  setTimeout(() => this.initializeTooltips(), 0); 
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

getEmoji(unicode: string): string {
  return String.fromCharCode(parseInt(unicode, 16));
}


getActivePoblaciones(poblacionData: any) {
  if (!poblacionData) return [];
  return this.poblacionObjetivo.filter(item => poblacionData[item.key] === 1);
}

applySearch() {
}

getPoblacionEmojis(poblacion: any): SafeHtml {
  if (!poblacion) return this.sanitizer.bypassSecurityTrustHtml('');

  const emojis = this.poblacionObjetivo
    .filter(item => poblacion[item.key] === 1)
    .map(item => `<span class="emoji-icon">${this.getEmoji(item.unicode)}</span>`);

  return this.sanitizer.bypassSecurityTrustHtml(emojis.join(' '));
}

  openModal(practica: any) {
    this.selectedPractica = practica;
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
    this.selectedPractica = null;
  }

encodeURIComponentWrapper(value: string): string {
  return encodeURIComponent(value);
}
}
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
  filtrosActivos: any = {};
  currentDate: Date = new Date();
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
  container.style.width = '100%';
  container.style.padding = '0';

  // PRIMERA PÁGINA
  const primeraPagina = document.createElement('div');
  primeraPagina.style.padding = '20mm 15mm';
  primeraPagina.style.boxSizing = 'border-box';
  primeraPagina.style.pageBreakAfter = 'always';

primeraPagina.innerHTML += `
  <div style="text-align: center; margin-bottom: 30px; width: 100%; max-width: 600px; margin-left: auto; margin-right: auto;">
    <img src="assets/images/logos.jpg" alt="Logos" style="width: 100%; height: auto; max-height: 200px; border-radius: 8px;"
         onerror="this.onerror=null;this.src='https://placehold.co/600x150/0c2e8d/ffffff?text=Logos+Placeholder';" />
  </div>
`;

  primeraPagina.innerHTML += `
    <div style="text-align: center; margin-bottom: 30px; width: 100%; max-width: 700px; margin-left: auto; margin-right: auto;">
      <img src="assets/images/Banner.jpg" alt="Banner" style="width: 100%; height: auto; max-height: 220px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.2);" onerror="this.onerror=null;this.src='https://placehold.co/600x200/1e40af/ffffff?text=Banner+Placeholder';" />
    </div>
    <div style="border-bottom: 4px solid #0c2e8d; width: 70%; margin: 30px auto 40px auto; border-radius: 2px;"></div>
  `;

  primeraPagina.innerHTML += `
    <h1 style="text-align: center; color: #0c2e8d; margin-bottom: 15px; font-size: 2.2rem; font-weight: 700;">Matriz de Buenas Prácticas</h1>
    <h3 style="text-align: center; color: #1e40af; margin-bottom: 25px; font-size: 1.4rem; font-weight: 600;">Buenas prácticas en contexto migratorio a nivel local</h3>
    <p style="text-align: center; font-size: 1rem; color: #6b7280; margin-bottom: 40px;">Fecha de descarga: ${fecha}</p>
  `;

  primeraPagina.innerHTML += `
    <div style="font-size: 1.05rem; text-align: justify; margin: 30px auto; color: #111827; line-height: 1.7; max-width: 800px;">
      <p style="margin-bottom: 15px;">Este documento reúne un conjunto de buenas prácticas impulsadas por gobiernos locales en coordinación con diversos actores
      para atender los desafíos vinculados a la atención de personas migrantes y en otros procesos de movilidad en México.</p>
      <p>La información aquí presentada corresponde a los filtros seleccionados en el mapa interactivo de Mosaico y ofrece
      herramientas útiles para tomadores de decisiones, organizaciones de la sociedad civil y cualquier instancia interesada
      en replicar o adaptar experiencias exitosas en sus territorios.</p>
    </div>
  `;
  container.appendChild(primeraPagina);

  // SEGUNDA PÁGINA
  const segundaPagina = document.createElement('div');
  segundaPagina.style.padding = '20mm 15mm';
  segundaPagina.style.boxSizing = 'border-box';
  segundaPagina.style.pageBreakAfter = 'always';

  segundaPagina.innerHTML += `
    <h2 style="text-align: center; color: #0c2e8d; margin-bottom: 30px; font-size: 1.8rem; font-weight: 700;">Detalles de la Búsqueda y Visualización</h2>
    <div style="margin: 20px auto 40px auto; padding: 20px; border-left: 6px solid #1e40af; background-color: #f0f8ff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 800px;">
      <h3 style="color: #1e40af; margin-bottom: 15px; border-bottom: 2px solid #dbeafe; padding-bottom: 10px; font-size: 1.3rem; font-weight: 600;">Filtros Aplicados</h3>
      <ul style="font-size: 1rem; margin: 0; padding-left: 25px; color: #1f2937; line-height: 2;">
        <li><strong>Regiones:</strong> ${this.selectedRegions.length > 0 ? this.selectedRegions.join(', ') : 'Ninguna'}</li>
        <li><strong>Fronteras:</strong> ${this.selectedBorders.length > 0 ? this.selectedBorders.join(', ') : 'Ninguna'}</li>
        <li><strong>Categorías:</strong> ${this.selectedCategories.length > 0 ? this.selectedCategories.join(', ') : 'Ninguna'}</li>
        <li><strong>Naturaleza de política pública:</strong> ${this.selectedNaturalezas.length > 0 ? this.selectedNaturalezas.join(', ') : 'Ninguna'}</li>
        <li><strong>Población objetivo:</strong> ${this.selectedPoblacionObjetivo.length > 0 ? this.selectedPoblacionObjetivo.join(', ') : 'Ninguna'}</li>
        <li><strong>Interseccionalidad:</strong> ${this.mostrarSoloInterseccionalidad ? 'Sí' : 'No'}</li>
        <li><strong>Tipo de actor:</strong> ${this.selectedTiposDeActor || 'Ninguno'}</li>
      </ul>
    </div>
  `;

  const mapaElem = this.mapElement;
  if (mapaElem) {
    try {
      const canvas = await html2canvas(mapaElem as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: true
      });
      const imgData = canvas.toDataURL('image/png');
      const wrapper = document.createElement('div');
      wrapper.style.textAlign = 'center';
      wrapper.style.marginTop = '40px';
      wrapper.style.marginBottom = '20px';

      const img = document.createElement('img');
      img.src = imgData;
      img.style.maxWidth = '90%';
      img.style.height = 'auto';
      img.style.border = '4px solid #dbeafe';
      img.style.borderRadius = '12px';
      img.style.boxShadow = '0 10px 20px rgba(0,0,0,0.25)';
      img.style.padding = '5px';
      img.style.backgroundColor = '#ffffff';

      const caption = document.createElement('p');
      caption.style.fontSize = '0.9rem';
      caption.style.color = '#4b5563';
      caption.style.marginTop = '15px';
      caption.textContent = 'Visualización del mapa interactivo con los filtros aplicados.';

      wrapper.appendChild(img);
      wrapper.appendChild(caption);
      segundaPagina.appendChild(wrapper);
    } catch (error) {
      console.warn('Error capturando imagen del mapa:', error);
      segundaPagina.innerHTML += `<p style="text-align: center; color: #cc0000; font-size: 0.9rem; margin-top: 30px; padding: 10px; background-color: #ffebeb; border-radius: 8px;">
                                    (No se pudo generar la imagen del mapa.)
                                  </p>`;
    }
  }
  container.appendChild(segundaPagina);

  // TERCERA PÁGINA
  const terceraPagina = document.createElement('div');
  terceraPagina.style.padding = '20mm 15mm';
  terceraPagina.style.boxSizing = 'border-box';

  terceraPagina.innerHTML += `
    <h2 style="text-align: center; color: #0c2e8d; margin-bottom: 30px; font-size: 1.8rem; font-weight: 700;">Matriz de Buenas Prácticas Detallada</h2>
    <p style="text-align: center; font-size: 0.95rem; color: #4b5563; margin-bottom: 20px;">A continuación se presenta la tabla completa de buenas prácticas basada en los filtros seleccionados.</p>
  `;

  const tabla = document.querySelector('#matrizTabla')?.cloneNode(true) as HTMLElement;
  if (tabla) {
    tabla.style.fontSize = '9px';
    tabla.style.marginTop = '20px';
    tabla.style.marginBottom = '30px';
    tabla.style.borderCollapse = 'collapse';
    tabla.style.width = '100%';
    tabla.style.tableLayout = 'fixed';

    tabla.querySelectorAll('th').forEach(th => {
      (th as HTMLElement).style.backgroundColor = '#1e40af';
      (th as HTMLElement).style.color = 'white';
      (th as HTMLElement).style.padding = '8px 5px';
      (th as HTMLElement).style.border = '1px solid #1e3a8a';
      (th as HTMLElement).style.textAlign = 'left';
      (th as HTMLElement).style.fontWeight = 'bold';
    });

    tabla.querySelectorAll('td').forEach(td => {
      (td as HTMLElement).style.padding = '7px 5px';
      (td as HTMLElement).style.border = '1px solid #d1d5db';
      (td as HTMLElement).style.verticalAlign = 'top';
      (td as HTMLElement).style.wordWrap = 'break-word';
    });

    tabla.querySelectorAll('tr:nth-child(even)').forEach(tr => {
      (tr as HTMLElement).style.backgroundColor = '#f9fafb';
    });

    terceraPagina.appendChild(tabla);
  } else {
    terceraPagina.innerHTML += `<p style="text-align: center; color: #cc0000; font-size: 0.9rem; margin-top: 30px; padding: 10px; background-color: #ffebeb; border-radius: 8px;">
                                  (No se pudo encontrar la tabla con ID 'matrizTabla'.)
                                </p>`;
  }

  container.appendChild(terceraPagina);

  const options = {
    margin: [15, 15, 15, 15],
    filename: `Matriz_Buenas_Practicas_${new Date().toISOString().slice(0, 10)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      logging: true,
      useCORS: true,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      hotfixes: ["px_scaling"]
    }
  };

  await html2pdf().set(options).from(container).save();
}

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

  allData: any[] = [];

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

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
      let vol2Data = res2.buenas_practicas2 || [];
      const vol3Data = res3.buenas_practicas3 || [];

      // ✅ Convertir nombres del volumen 2 a mayúsculas
      vol2Data = vol2Data.map((item: any) => ({
        ...item,
        buena_practica: item.buena_practica?.toUpperCase?.() || ''
      }));

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
 if (this.showAllPracticas) {
    return this.allData.filter(row => {
      return !hasSearch || Object.values(row).some(val =>
        val && val.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
  }
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

toggleShowAll() {
  this.showAllPracticas = !this.showAllPracticas;
  this.applySearch(); // actualiza el filtrado
  setTimeout(() => this.initializeTooltips(), 0); // espera a que el DOM se actualice
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

// Método para aplicar la búsqueda
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

 // matriz.component.ts
encodeURIComponentWrapper(value: string): string {
  return encodeURIComponent(value);
}
   }
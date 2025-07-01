import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.css'],
  standalone: false
})
export class LayersComponent {
  @Input() side: 'left' | 'right' = 'left';
  @Output() filtersChanged = new EventEmitter<{
    regions: string[],
    categories: number[],
    borders: string[],
    naturaleza_politica_publica: string[],
    poblacion_objetivo: string[],
    conInterseccionalidades: boolean
    tipos_de_actor: string | null ,
  }>();
  showRegions = false;
  showCategories = false;
  showBorders = false;
  selectedCategories: number[] = [];
selectedRegions: string[] = [];
selectedBorders: string[] = [];
selectedNaturalezas: string[] = [];
selectedPoblacionesObjetivo: string[] = [];
mostrarConInterseccionalidades = false;
showNaturaleza = false;
selectedTipoDeActor: string | null = null;
showTiposDeActor = false;
showPoblaciones = false;

  tiposDeActor = [
  "Organismos internacionales",
  "Autoridades federales",
  "Autoridades municipales",
  "OSC",
  "Albergues",
  "Instituciones académicas",
  "Organizaciones religiosas",
  "Colectivos de personas en contexto de movilidad",
  "Iniciativa privada",
  "Representaciones consulares",
  "Autoridades del sector salud",
  "Autoridades del sector educación",
  "Autoridades del sector de seguridad",
  "Autoridades del sector de empleo",
  "Autoridades del sector económico",
  "Autoridades que atienden agendas de protección a derechos humanos",
  "Autoridades registrales",
  "Autoridades del sector cultural",
  "Autoridades de desarrollo urbano, vivienda y/o ordenamiento territorial",
  "Autoridades legislativas",
  "OFAMs"
];

naturaleza_politica_publica = [
  { key: 'Creación de instituciones', label: 'Creación de instituciones' },
  { key: 'Fortalecimiento de instituciones ya existentes', label: 'Fortalecimiento de instituciones ya existentes' },
  { key: 'Creación de comités o espacios de vinculación interinstitucional', label: 'Creación de comités o espacios de vinculación interinstitucional' },
  { key: 'Protocolos o mecanismos de actuación', label: 'Protocolos o mecanismos de actuación' },
  { key: 'Creación o reformas a leyes o reglamentos', label: 'Creación o reformas a leyes o reglamentos' },
  { key: 'Programas públicos', label: 'Programas públicos' }
];

  borders = [
    { key: 'frontera_norte', label: 'Frontera Norte' },
    { key: 'frontera_sur', label: 'Frontera Sur' }
  ];
  
  regions = [
    {
      key: 'norte',
      name: 'Norte',
      states: ['Baja California', 'Baja California Sur', 'Sonora', 'Chihuahua', 'Coahuila', 'Nuevo León', 'Tamaulipas', 'Sinaloa', 'Durango']
    },
    {
      key: 'occidente',
      name: 'Occidente',
      states: ['Nayarit', 'Zacatecas', 'Jalisco', 'Aguascalientes', 'Colima', 'Guanajuato', 'Michoacán', 'San Luis Potosí']
    },
    {
      key: 'centro',
      name: 'Centro',
      states: ['Querétaro', 'Hidalgo', 'México', 'Ciudad de México', 'Tlaxcala', 'Morelos', 'Puebla']
    },
    {
      key: 'sureste',
      name: 'Sur-Sureste',
      states: ['Guerrero', 'Veracruz', 'Oaxaca', 'Tabasco', 'Chiapas', 'Yucatán', 'Campeche', 'Quintana Roo']
    }
  ];

  categorias = [
    { categoria: '1. Buenas prácticas en la creación o reforma las legislaciones locales y/o sus reglamentos', id: 'categoria1', label: 'Buenas prácticas en la creación o reforma las legislaciones locales y/o sus reglamentos' },
    { categoria: '2. Registros y rendición de cuentas', id: 'categoria2', label: 'Registros y rendición de cuentas' },
    { categoria: '3. Instituciones de atención e integración', id: 'categoria3', label: 'Instituciones de atención e integración' },
    { categoria: '4. Buenas prácticas en el establecimiento de mecanismos de vinculación interinstitucional así como de mecanismos que involucren a la sociedad civil y otros sectores', id: 'categoria4', label: 'Buenas prácticas en el establecimiento de mecanismos de vinculación interinstitucional así como de mecanismos que involucren a la sociedad civil y otros sectores' },
    { categoria: '5. Regularización migratoria', id: 'categoria5', label: 'Regularización migratoria' },
    { categoria: '6. Servicios de albergue', id: 'categoria6', label: 'Servicios de albergue' },
    { categoria: '7. Buenas prácticas en la transversalización de servicios para la atención a personas en situación de migración (acceso a la identidad; salud; educación; seguridad; etc.)', id: 'categoria7', label: 'Buenas prácticas en la transversalización de servicios para la atención a personas en situación de migración (acceso a la identidad; salud; educación; seguridad; etc.)' },
    { categoria: '8. Programas y apoyos sociales', id: 'categoria8', label: 'Programas y apoyos sociales' },
    { categoria: '9. Buenas prácticas en la transversalización de programas y acciones que fomentan el empleo y autoempleo a personas en situación de migración', id: 'categoria9', label: 'Buenas prácticas en la transversalización de programas y acciones que fomentan el empleo y autoempleo a personas en situación de migración' },
    { categoria: '10. Inclusión sociocultural', id: 'categoria10', label: 'Inclusión sociocultural' },
    { categoria: '11. Sensibilización a población no migrante', id: 'categoria11', label: 'Sensibilización a población no migrante' },
    { categoria: '12. Crisis o emergencia migratoria', id: 'categoria12', label: 'Crisis o emergencia migratoria' },
    { categoria: '13. Reunificación familiar', id: 'categoria13', label: 'Reunificación familiar' }
  ];  

 poblacionObjetivo = [
  { key: 'retornados', label: '🔁🙋‍♂️ Retornados' },
  { key: 'transito', label: '🚶‍♀️🌫️ En tránsito' },
  { key: 'mexicanos_extranjero', label: '🤝🌍 Mexicanos en el extranjero' },
  { key: 'refugiados_asilados', label: '🛡️🧍 Refugiados y asilados' },
  { key: 'migracion_destino', label: '🌍🧑‍🤝‍🧑 Migración de destino' },
  { key: 'migracion_interna', label: '🏘️🔄 Migración interna' },
  { key: 'poblacion_no_migrante', label: '📍🧑‍🤝‍🧑 Población no migrante' },
  { key: 'personas_desplazadas', label: '⚠️🏚️ Personas desplazadas' }
];

  // Regiones
toggleRegion(region: any, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
    this.selectedRegions = [...this.selectedRegions, region.key];
  } else {
    this.selectedRegions = this.selectedRegions.filter(r => r !== region.key);
  }
  this.emitFilters();
}

isRegionChecked(region: any): boolean {
  return this.selectedRegions.includes(region.key);
}

// Fronteras
toggleBorder(border: any, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
    this.selectedBorders = [...this.selectedBorders, border.key];
  } else {
    this.selectedBorders = this.selectedBorders.filter(b => b !== border.key);
  }
  this.emitFilters();
}

isBorderChecked(border: any): boolean {
  return this.selectedBorders.includes(border.key);
}

// Naturaleza (antes guardabas labels, ahora siempre keys)
toggleNaturaleza(naturaleza: { key: string; label: string }, event: Event): void {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
    this.selectedNaturalezas = [...this.selectedNaturalezas, naturaleza.key];
  } else {
    this.selectedNaturalezas = this.selectedNaturalezas.filter(n => n !== naturaleza.key);
  }
  this.emitFilters();
}

isNaturalezaChecked(naturaleza: { key: string; label: string }): boolean {
  return this.selectedNaturalezas.includes(naturaleza.key);
}

// Categorías (usando número, igual creamos nuevos arrays)
toggleCategory(categoria: any, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  const catNum = Number(categoria.categoria.split('.')[0].trim());
  if (checked) {
    this.selectedCategories = [...this.selectedCategories, catNum];
  } else {
    this.selectedCategories = this.selectedCategories.filter(c => c !== catNum);
  }
  this.emitFilters();
}

isCategoryChecked(categoria: any): boolean {
  const catNum = Number(categoria.categoria.split('.')[0].trim());
  return this.selectedCategories.includes(catNum);
}

// Población objetivo
togglePoblacion(poblacion: any, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
    this.selectedPoblacionesObjetivo = [...this.selectedPoblacionesObjetivo, poblacion.key];
  } else {
    this.selectedPoblacionesObjetivo = this.selectedPoblacionesObjetivo.filter(p => p !== poblacion.key);
  }
  this.emitFilters();
}

isPoblacionChecked(poblacion: any): boolean {
  return this.selectedPoblacionesObjetivo.includes(poblacion.key);
}

  emitFilters() {
  this.filtersChanged.emit({
    regions: this.selectedRegions,
    categories: this.selectedCategories,
    borders: this.selectedBorders,
    naturaleza_politica_publica: this.selectedNaturalezas,
    poblacion_objetivo: this.selectedPoblacionesObjetivo,
    conInterseccionalidades: this.mostrarConInterseccionalidades,
    tipos_de_actor: this.selectedTipoDeActor || null }
  );
}
}

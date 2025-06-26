import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Stroke, Fill, Text } from 'ol/style';
import { Select } from 'ol/interaction';
import { click, pointerMove } from 'ol/events/condition';
import { fromLonLat } from 'ol/proj';
import { forkJoin, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  standalone: false,
})
export class MapComponent implements OnInit  {
  private map!: Map;
  private allData: any[] = [];
  private statesLayer!: VectorLayer<VectorSource>;
  private selectedFeature: any = null;
  private selectedStyle!: Style;
  public selectedBorders: string[] = []; 
  private regionLayers: { [key: string]: VectorLayer<VectorSource> } = {};
  public selectedMatrixState: string | null = null;
  categoriasSeleccionadas: number[] = [];
  public selectedState: {name: string, practices: string} | null = null;
  regionesSeleccionadas: string[] = ['Norte', 'Centro', 'Occidente', 'Sureste']; 
  public selectedNaturalezas: string[] = [];
  public poblacionSeleccionada: string[] = [];
  public carouselImages: string[] = [];
  public mostrarConInterseccionalidades: boolean = false;



  private stateImages: {[key: string]: string[]} = {
    'Nuevo León': ['assets/images/Estados/nuevoleon1.jpeg', 'assets/images/Estados/nuevoleon2.jpg', 'assets/images/Estados/nuevoleon3.jpg'],
    // ...
  };
  
  private statePractices: {[key: string]: string} = {
    'Aguascalientes': 'Aguascalientes ha implementado programas de regularización migratoria...',
    'Baja California': 'Baja California cuenta con centros de atención humanitaria...',
    'Baja California Sur': 'Programas de integración laboral en el sector turístico...',
    'Campeche': 'Estrategias de protección a migrantes en tránsito...',
    'Chiapas': 'Modelo de atención integral en la frontera sur...',
    'Chihuahua': 'Programas de cooperación transfronteriza...',
    'Ciudad de México': 'La CDMX cuenta con centros de atención integral para migrantes...',
    'Coahuila': 'Sistema de documentación para migrantes...',
    'Colima': 'Programas de salud para población migrante...',
    'Durango': 'Estrategias contra la discriminación...',
    'Guanajuato': 'Red de albergues comunitarios...',
    'Guerrero': 'Programas de retorno voluntario asistido...',
    'Hidalgo': 'Proyectos productivos para migrantes retornados...',
    'Jalisco': 'Jalisco ha implementado programas de integración laboral para migrantes...',
    'México': 'Sistema de alerta temprana para migrantes...',
    'Michoacán': 'Red de defensores comunitarios...',
    'Morelos': 'Programas educativos interculturales...',
    'Nayarit': 'Estrategias de protección a menores migrantes...',
    'Nuevo León': 'Sistema de información sobre derechos migratorios...',
    'Oaxaca': 'Programas de preservación cultural para comunidades migrantes...',
    'Puebla': 'Red de traductores para procedimientos administrativos...',
    'Querétaro': 'Programas de vivienda temporal...',
    'Quintana Roo': 'Estrategias de protección en zonas turísticas...',
    'San Luis Potosí': 'Programas contra la trata de personas...',
    'Sinaloa': 'Red de atención a migrantes extracontinentales...',
    'Sonora': 'Programas fronterizos de protección consular...',
    'Tabasco': 'Estrategias de adaptación climática para comunidades migrantes...',
    'Tamaulipas': 'Protocolos de seguridad para migrantes...',
    'Tlaxcala': 'Programas de reunificación familiar...',
    'Veracruz': 'Red de atención a víctimas de violencia...',
    'Yucatán': 'Programas de integración lingüística...',
    'Zacatecas': 'Estrategias de desarrollo económico para comunidades expulsoras...'
  };

  borderStatesMap: { [key: string]: string[] } = {
    frontera_norte: ['Baja California', 'Sonora', 'Chihuahua', 'Coahuila', 'Nuevo León', 'Tamaulipas'],
    frontera_sur: ['Chiapas', 'Tabasco', 'Campeche', 'Quintana Roo']
  };
  
  highlightedBorderStates: Set<string> = new Set();

  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.loadData().then(() => {
      this.initializeMap();
    });
  }
private _estadosDesdeMatriz: string[] = [];

set estadosDesdeMatriz(value: string[]) {
  this._estadosDesdeMatriz = value;
  if (this.map && value) {
    this.applyMatrixStates(value);
  }
}

get estadosDesdeMatriz() {
  return this._estadosDesdeMatriz;
}
public applyMatrixStates(states: string[]): void {
  const source = this.statesLayer.getSource();
  if (!source) return;

  const normalizedCounts: Record<string, number> = {};

  // Contar ocurrencias normalizadas
  for (const raw of states) {
    const norm = this.normalizeStateName(raw);
    normalizedCounts[norm] = (normalizedCounts[norm] || 0) + 1;
  }

  source.forEachFeature((feature) => {
    const name = this.normalizeStateName(feature.get('name') || '');
    const count = normalizedCounts[name] || 0;
    const highlight = count > 0;

    feature.set('count', count);
    feature.set('highlight', highlight);
    feature.setStyle(this.getFeatureStyle(feature));
  });

  this.statesLayer.changed();
}
private normalizeStateName(stateName: string): string {
  return stateName
    .toLowerCase()
    .normalize("NFD")                  // separa acentos
    .replace(/[\u0300-\u036f]/g, "")  // elimina acentos
    .replace(/\s+/g, '')              // elimina espacios
    .replace(/[^a-z]/g, '');          // elimina caracteres especiales si hubiera
}


filteredMatrixStates: string[] = [];

onFilteredStatesChanged(filteredStates: string[]) {
  this.filteredMatrixStates = filteredStates || [];
  this.applyMatrixStates(this.filteredMatrixStates);
}



  private async loadData(): Promise<void> {
    try {
      const [res2, res3] = await lastValueFrom(forkJoin([
        this.http.get<any>('assets/data/volumen-2.json'),
        this.http.get<any>('assets/data/volumen-3.json')
      ]));

      this.allData = [
        ...(res2.buenas_practicas2 || []),
        ...(res3.buenas_practicas3 || [])
      ];
    } catch (error) {
      console.error('Error loading data:', error);
      this.allData = [];
    }
  }

  private initializeMap(): void {
    // 1. Configuración del visor centrado en México
    const view = new View({
      center: fromLonLat([-102.0, 23.8]),
      zoom: 5,
      minZoom: 4,
      maxZoom: 10
    });

    // 2. Capa base
    const baseLayer = new TileLayer({
      source: new OSM()
    });

    // 3. Cargar archivo GeoJSON
    const statesSource = new VectorSource({
      url: 'assets/data/mx.json',
      format: new GeoJSON()
    });

    // Estilo normal con etiquetas
    const normalStyle = (feature: any) => {
      const stateName = feature.get('name') || '';
      return new Style({
        stroke: new Stroke({
          color: '#3388ff',
          width: 1.5
        }),
        fill: new Fill({
          color: 'rgba(51, 136, 255, 0.2)'
        }),
        text: new Text({
          text: stateName,
          font: 'bold 12px Arial',
          fill: new Fill({ color: '#000' }),
          stroke: new Stroke({ color: '#fff', width: 2 })
        })
      });
    };

    // Estilo para selección
    const selectedText = new Text({
      text: '',
      font: 'bold 14px Arial',
      fill: new Fill({ color: '#000' }),
      stroke: new Stroke({ color: '#fff', width: 3 }),
      offsetY: -15
    });

    this.selectedStyle = new Style({
      stroke: new Stroke({
        color: '#ff0000',
        width: 3
      }),
      fill: new Fill({
        color: 'rgba(255, 0, 0, 0.3)'
      }),
      text: selectedText
    });

    this.statesLayer = new VectorLayer({
  source: new VectorSource({
    url: 'assets/data/mx.json',
    format: new GeoJSON()
  }),
  style: (feature) => this.getFeatureStyle(feature),
  zIndex: 3
});


    // 4. Crear el mapa
    this.map = new Map({
      target: 'map-container',
      layers: [baseLayer, this.statesLayer],
      view: view
    });

    // 5. Interacción de selección con clic (modificado)
    const select = new Select({
      condition: click,
      layers: [this.statesLayer],
      style: null
    });

    select.on('select', (e) => {
      if (this.selectedFeature) {
        this.selectedFeature.setStyle(null);
      }
    
      this.selectedFeature = e.selected[0];
    
      if (this.selectedFeature) {
        const stateName = this.selectedFeature.get('name') || '';
    
        selectedText.setText(stateName);
        this.selectedFeature.setStyle(this.selectedStyle);
    
        this.selectedState = {
          name: stateName,
          practices: this.statePractices[stateName] || 'Información no disponible.'
        };
    
        this.selectedMatrixState = stateName;
    
        // Normalizar nombre para buscar imágenes
        const normalizedState = this.normalizeStateName(stateName);
    
        // Cargar las imágenes del estado seleccionado desde el diccionario, si existen
        this.carouselImages = this.stateImages[stateName] || [];
    
        // Ajustar vista al estado seleccionado
        const extent = this.selectedFeature.getGeometry()?.getExtent();
        if (extent) {
          this.map.getView().fit(extent, { padding: [50, 50, 50, 50], duration: 500, maxZoom: 8 });
        }
    
        // Determinar región a partir de capas visibles
        const regionesEstado = Object.entries(this.regionLayers)
        .filter(([region, layer]) => {
          const features = layer.getSource()?.getFeatures() || [];
          return features.some(f => f.get('name') === stateName);
        })
        .map(([region]) => region);

      this.regionesSeleccionadas = regionesEstado; // Guardar referencia sin activar

    } else {
      // Limpiar selección
      this.selectedState = null;
      this.selectedMatrixState = null;
      this.carouselImages = [];
      this.regionesSeleccionadas = [];
    }

    this.statesLayer.changed();
  });

  this.map.addInteraction(select);


    // 6. Interacción hover opcional
    const hoverSelect = new Select({
      condition: pointerMove,
      layers: [this.statesLayer],
      style: new Style({
        stroke: new Stroke({
          color: '#ff9900',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(19, 82, 207, 0.2)'
        })
      })
    });
    this.map.addInteraction(hoverSelect);
  }
private getFeatureStyle(feature: any): Style {
  const count = feature.get('count') || 0; // Número de veces que aparece
  const maxCount = 13;

  // Escala de opacidad para el fondo normal (sin highlight)
  const baseOpacity = Math.min(0.1 + (0.5 * count / maxCount), 0.6);

  if (feature.get('highlight')) {
    // Para resaltado: relleno más fuerte y borde más grueso
    return new Style({
      fill: new Fill({ color: `rgba(70, 130, 180, ${Math.min(0.4 + 0.6 * count / maxCount, 0.9)})` }), // azul steelblue con opacidad variable y más alta
      stroke: new Stroke({ color: '#483D8B', width: 4 }) // borde dark slate blue más grueso
    });
  }

  // Para estado normal: relleno más claro y borde más fino
  return new Style({
    fill: new Fill({ color: `rgba(173, 216, 230, ${baseOpacity * 0.6})` }), // azul claro con opacidad proporcional menor
    stroke: new Stroke({ color: '#7B68EE', width: 1.5 }) // borde lavanda suave, más fino
  });
}


  // Método para limpiar la selección (modificado)
  clearSelection(): void {
  const source = this.statesLayer.getSource();
  if (source) {
    source.forEachFeature(feature => feature.set('highlight', false));
    this.statesLayer.changed();
  }

  this.selectedState = null;
  this.selectedMatrixState = null;
  this.regionesSeleccionadas = [];
  this.categoriasSeleccionadas = [];
  this.carouselImages = [];
  
  // Centrar vista
  this.map.getView().animate({ center: fromLonLat([-102.0, 23.8]), zoom: 5, duration: 500 });
}

  

    // NUEVO: Crear capas regionales
    
  
   

    onBordersChanged(feature: any): boolean {
  if (this.regionesSeleccionadas.length === 0) return true;
  
  const stateName = feature.get('name');
  return this.regionesSeleccionadas.includes(stateName);
}
   onFiltersChanged(event: {
  regions: string[],
  categories: number[],
  borders: string[],
  naturaleza_politica_publica: string[],
  poblacion_objetivo: string[],
  conInterseccionalidades: boolean
}) {
  this.regionesSeleccionadas = event.regions;
  this.categoriasSeleccionadas = event.categories;
  this.selectedBorders = event.borders;
  this.selectedNaturalezas = event.naturaleza_politica_publica;
  this.poblacionSeleccionada = event.poblacion_objetivo || [];
  this.mostrarConInterseccionalidades = event.conInterseccionalidades;

  // Forzar actualización de estados filtrados
  this.emitFilteredStates();
  this.applyMatrixStates(this.filteredMatrixStates);
  this.statesLayer.changed();
}

emitFilteredStates(): void {
  const estadosUnicos = [...new Set(this.filteredMatrixStates.map(s => s.trim()))].filter(s => !!s);
  // Aquí emites un evento o actualizas algo con estadosUnicos
  console.log('Estados filtrados emitidos:', estadosUnicos);
}


    private updateLayerStyle(): void {
  // Solo forzamos que la capa reevalúe estilos
  this.statesLayer.changed();
}

    get carouselBackgroundStyle(): { [klass: string]: any } {
      if (this.carouselImages.length > 0) {
        return {
          backgroundImage: `url(${this.carouselImages[0]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(5px)', // se aplica si el fondo está separado
          position: 'relative',
        };
      } else {
        return this.defaultBackgroundStyle;
      }
    }
        
    public defaultBackgroundStyle = {
      'background-color': '#123456', // o el color/fondo que tenías antes
      'min-height': '300px'
    };
    
    
}
import { Component, OnInit } from '@angular/core';
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
export class MapComponent implements OnInit {
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
  private normalizeStateName(stateName: string): string {
    return stateName
      .toLowerCase()
      .normalize("NFD")                  // separa acentos
      .replace(/[\u0300-\u036f]/g, "")  // elimina acentos
      .replace(/\s+/g, '')              // elimina espacios
      .replace(/[^a-z]/g, '');          // elimina caracteres especiales si hubiera
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
          color: 'rgba(255, 153, 0, 0.2)'
        })
      })
    });
    this.map.addInteraction(hoverSelect);
    
    this.regionLayers = {
      norte: this.createRegionLayer(['Baja California', 'Baja California Sur', 'Sonora', 'Chihuahua', 'Coahuila', 'Durango', 'Nuevo León', 'Tamaulipas', 'Sinaloa']),
      occidente: this.createRegionLayer(['Jalisco', 'Colima', 'Nayarit', 'Zacatecas', 'Aguascalientes']),
      centro: this.createRegionLayer(['México', 'Ciudad de México', 'Hidalgo', 'Querétaro', 'Tlaxcala', 'Puebla', 'Morelos', 'Michoacán', 'Guanajuato']),
      sureste: this.createRegionLayer(['Chiapas', 'Tabasco', 'Campeche', 'Yucatán', 'Quintana Roo', 'Oaxaca', 'Veracruz', 'Guerrero', 'San Luis Potosí'])
    };

    Object.values(this.regionLayers).forEach(layer => {
      this.map.addLayer(layer);
      layer.setVisible(false); // ocultas por default
    });
  }
  
 private getFeatureStyle(feature: any): Style | Style[] {
  const styles: Style[] = [];

  if (feature.get('highlightByInterseccionalidad')) {
    styles.push(new Style({
      fill: new Fill({ color: 'rgba(142, 68, 173, 0.2)' }),
      stroke: new Stroke({ color: '#8e44ad', width: 2 })
    }));
  }

  if (feature.get('highlightByPoblacion')) {
    styles.push(new Style({
      fill: new Fill({ color: 'rgba(230, 126, 34, 0.2)' }),
      stroke: new Stroke({ color: '#e67e22', width: 2 })
    }));
  }

  if (feature.get('highlightByNaturaleza')) {
    styles.push(new Style({
      fill: new Fill({ color: 'rgba(41, 128, 185, 0.2)' }),
      stroke: new Stroke({ color: '#2980b9', width: 2 })
    }));
  }

  if (feature.get('highlightByCategory')) {
    styles.push(new Style({
      fill: new Fill({ color: 'rgba(39, 174, 96, 0.2)' }),
      stroke: new Stroke({ color: '#27ae60', width: 2 })
    }));
  }

  if (feature.get('highlight')) {
    styles.push(new Style({
      fill: new Fill({ color: 'rgba(211, 84, 0, 0.2)' }),
      stroke: new Stroke({ color: '#d35400', width: 2 })
    }));
  }

  // Si no hay filtros activos, estilo gris base
  if (styles.length === 0) {
    styles.push(new Style({
      stroke: new Stroke({ color: '#cccccc', width: 1 }),
      fill: new Fill({ color: 'rgba(200, 200, 200, 0.2)' })
    }));
  }

  return styles;
}


  // Método para limpiar la selección (modificado)
  clearSelection(): void {
    if (this.selectedFeature) {
      this.selectedFeature.setStyle(null);
      this.selectedFeature = null;
    }
  
    this.selectedState = null;
    this.selectedMatrixState = null;
    this.regionesSeleccionadas = [];
    this.categoriasSeleccionadas = [];
    this.carouselImages  = [];
  
    // Resetear estilos
    const source = this.statesLayer.getSource();
    if (source) {
      source.forEachFeature((feature) => {
        feature.set('highlight', false);
      });
      this.updateLayerStyle();
    }
  
    this.map.getView().animate({ center: fromLonLat([-102.0, 23.8]), zoom: 5, duration: 500 });
  }
  

    // NUEVO: Crear capas regionales
    private createRegionLayer(states: string[]): VectorLayer<VectorSource> {
      const source = new VectorSource({
        url: 'assets/data/mx.json',
        format: new GeoJSON()
      });
    
      return new VectorLayer({
        source,
        style: (feature) => {
          const stateName = feature.get('name');
          if (!states.includes(stateName)) return undefined;
    
          const stateData = this.allData.find(item => item.estado === stateName);
          const categoriaNum = parseInt(stateData?.categoria?.split('.')[0], 10) || 0;
          const isHighlighted = this.categoriasSeleccionadas.length === 0 || 
                              this.categoriasSeleccionadas.includes(categoriaNum);
    
          return new Style({
            stroke: new Stroke({
              color: isHighlighted ? '#00b894' : '#cccccc',
              width: isHighlighted ? 2 : 1
            }),
            fill: new Fill({
              color: isHighlighted ? 'rgba(0, 184, 148, 0.4)' : 'rgba(200, 200, 200, 0.2)'
            })
          });
        },
        zIndex: 5
      });
    }
  
    // NUEVO: Método que se llama desde <app-region-layer-toggle>
    onRegionsChanged(selectedRegions: string[]) {
      this.regionesSeleccionadas = selectedRegions;
      for (const key in this.regionLayers) {
        this.regionLayers[key].setVisible(selectedRegions.includes(key));
      }
    }

    onBordersChanged(borders: string[]) {
      // Obtener todos los estados de esas fronteras
      this.highlightedBorderStates.clear();
      for (const border of borders) {
        const states = this.borderStatesMap[border] || [];
        states.forEach(state => this.highlightedBorderStates.add(state));
      }
    
      // Marcar estados en el mapa
      const source = this.statesLayer.getSource();
      if (source) {
        source.forEachFeature(f => {
          const name = f.get('name');
          f.set('highlight', this.highlightedBorderStates.has(name));
        });
        this.updateLayerStyle();
      }
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
    
      // Mostrar capas regionales
      for (const key in this.regionLayers) {
        this.regionLayers[key].setVisible(this.regionesSeleccionadas.includes(key));
      }
    
      this.onBordersChanged(this.selectedBorders);
      this.applyInterseccionalidadFilter(); 
this.applyPoblacionFilter();
this.applyNaturalezaFilter();
this.applyCategoryFilter();
this.updateLayerStyle(); // Esto forza el redibujado

    }
private applyInterseccionalidadFilter(): void {
  const source = this.statesLayer.getSource();
  if (!source) return;

  source.forEachFeature(feature => {
    const stateName = feature.get('name');
    const stateData = this.allData.find(item => 
      item.estado?.trim().toLowerCase() === stateName?.trim().toLowerCase()
    );

    // Resetear siempre el highlight primero
    feature.set('highlightByInterseccionalidad', false);

    // Solo proceder si el filtro está activado y hay datos
    if (this.mostrarConInterseccionalidades && stateData?.condicion_vulnerabilidad) {
      const vulnerabilidades = stateData.condicion_vulnerabilidad;
      
      // Verificar si alguna condición de vulnerabilidad es 1 (true)
      const tieneInterseccionalidad = Object.values(vulnerabilidades).some(
        val => val === 1 || val === '1' || val === true
      );
      
      feature.set('highlightByInterseccionalidad', tieneInterseccionalidad);
    }
  });

  this.updateLayerStyle();
}

private applyPoblacionFilter(): void {
  const source = this.statesLayer.getSource();
  if (!source) return;

  source.forEachFeature(feature => {
    const stateName = feature.get('name');
    const stateData = this.allData.find(item => item.estado === stateName);

    if (!stateData || !stateData.poblacion_objetivo) {
      feature.set('highlightByPoblacion', false);
      return;
    }

    const poblacionObj = stateData.poblacion_objetivo;
const hasMatch = this.poblacionSeleccionada.length > 0 && this.poblacionSeleccionada.some(key => poblacionObj[key] === 1);

    feature.set('highlightByPoblacion', hasMatch);
  });

  this.updateLayerStyle();
}

    private applyNaturalezaFilter(): void {
  const source = this.statesLayer.getSource();
  if (!source) return;

  if (this.selectedNaturalezas.length === 0) {
    source.forEachFeature(f => f.set('highlightByNaturaleza', false));
    this.updateLayerStyle();
    return;
  }

  source.forEachFeature(feature => {
    const stateName = feature.get('name');
    const stateData = this.allData.find(item => item.estado === stateName);

    if (!stateData) {
      feature.set('highlightByNaturaleza', false);
      return;
    }

    const naturalezaState = stateData.naturaleza_politica_publica || '';
    const naturalezaMatch = this.selectedNaturalezas.includes(naturalezaState);

    feature.set('highlightByNaturaleza', naturalezaMatch);
  });

  this.updateLayerStyle();
}

    
   private applyCategoryFilter(): void {
  const source = this.statesLayer.getSource();
  if (!source) return;

  if (this.categoriasSeleccionadas.length === 0) {
    source.forEachFeature(f => f.set('highlightByCategory', false));
    this.updateLayerStyle();
    return;
  }

  source.forEachFeature(feature => {
    const stateName = feature.get('name');
    const stateData = this.allData.find(item => item.estado === stateName);

    if (stateData) {
      const categoriaNum = parseInt(stateData.categoria?.split('.')[0], 10) || 0;
      const shouldHighlight = this.categoriasSeleccionadas.includes(categoriaNum);
      feature.set('highlightByCategory', shouldHighlight);
    } else {
      feature.set('highlightByCategory', false);
    }
  });

  this.updateLayerStyle();
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
    
    private getStyledFeature(name: string, strokeColor: string, fillColor: string): Style {
      return new Style({
        stroke: new Stroke({
          color: strokeColor,
          width: 3
        }),
        fill: new Fill({
          color: fillColor
        }),
        text: new Text({
          text: name,
          font: 'bold 12px Arial',
          fill: new Fill({ color: '#000' }),
          stroke: new Stroke({ color: '#fff', width: 2 })
        })
      });
    }
        
    public defaultBackgroundStyle = {
      'background-color': '#123456', // o el color/fondo que tenías antes
      'min-height': '300px'
    };
    
    
}
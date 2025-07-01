import { Component, OnInit} from '@angular/core';
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
import html2pdf from 'html2pdf.js';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  standalone: false,
})
export class MapComponent implements OnInit  {
  private map!: Map;
  private mapView!: View;
  mostrarFiltrosYMapa = false;
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
  public selectedTiposDeActor: string | null = null;
  

  private stateImages: {[key: string]: string[]} = {
    'Nuevo León': ['assets/images/Estados/nuevoleon1.jpeg', 'assets/images/Estados/nuevoleon2.jpg', 'assets/images/Estados/nuevoleon3.jpg'],
    'Jalisco': ['assets/images/Estados/nuevoleon1.jpeg', 'assets/images/OIM3.jpeg', 'assets/images/OIM4.jpeg'],

  };
  
  private statePractices: {[key: string]: string} = {
    'Aguascalientes': 'Aguascalientes es un estado con presencia migratoria moderada y diversa. Recibe personas extranjeras en tránsito, solicitantes de asilo y residentes temporales, principalmente de Guatemala, Cuba, Nicaragua, Haití, Honduras y Venezuela. También es punto de retorno para personas mexicanas repatriadas desde Estados Unidos, y registra baja incidencia de migración irregular, incluida la de niñas, niños y adolescentes.',
    'Baja California': 'Baja California es un estado fronterizo con alto flujo migratorio: personas en tránsito, solicitantes de asilo haitianos y centroamericanos, trabajadores agrícolas (incluyendo población indígena), y deportados. Cuenta con una Ley estatal para la atención de migrantes que garantiza trato digno, no discriminación y protección especial a niñas, niños y víctimas de delito así como ONGs  y albergues locales complementan con asistencia legal, humanitaria e integración comunitaria.',
    'Baja California Sur': 'Programas de integración laboral en el sector turístico...',
    'Campeche': 'Campeche es un estado que se caracteriza principalmente por flujos internos y de retorno. Su perfil migratorio destaca la articulación entre gobiernos y sociedad civil mediante comités estatales y municipales para atender a migrantes y garantizar su acceso a derechos humanos, así cómo la implemetación protocolos de atención, mecanismos de quejas ante la CNDH y acciones con enfoque en no discriminación.',
    'Chiapas': 'Modelo de atención integral en la frontera sur...',
    'Chihuahua': 'Chihuahua es un estado fonterizo con grandes flujos de tránsito, retorno y presencia de personas desplazadas internas de otras entidades federativas. Cuenta con programas de protección a solicitantes de asilo y deportados desde EE. UU, e implementa atención a niñez migrante, albergues y brigadas móviles, en coordinación con organismos internacionales, con enfoque humanitario y de derechos.',
    'Ciudad de México': 'Ciudad de México es el principal punto de llegada y destino, con atención a solicitantes de asilo, refugio, tránsito y retorno. Cuenta con una legislación avanzada protege contra la discriminación; se facilitan asilo, salud, albergue y asesoría jurídica. La capital opera con un enfoque interseccional, atendiendo prioridades por género, edad y condición migratoria.',
    'Coahuila': 'Coahuila es un estado fronterizo con presencia priniciplamente de flujo migratorio de tránsito; cuenta con albergues, brigadas de salud y asesoría legal cerca de cruces. Asimismo tiene programas por medio de los cuales se gestiona el retorno asistido y promueve la integración laboral de deportados y refugiados. Sus protocolos incluyen atención psicosocial, protección de infancia migrante y denuncia de violaciones de derechos.',
    'Colima': 'Colima es un estado  con flujos de tránsito y retorno. Se enfoca en asistencia a migrantes centroamericanos en ruta hacia el norte, y establece colaboradores entre autoridades municipales y colectivos para otorgar atención médica, jurídica y prevención de trata, especialmente a mujeres y niñas.',
    'Durango': 'Durango es un estado con presencia de persoans en tránsito, movilidad interna y retorno. Opera programas de identificación de víctimas de trata, campañas de sensibilización en municipios rurales, y colaboración con la CNDH. Atiende a poblaciones indígenas migrantes con enfoque diferencial.',
    'Guanajuato': 'Red de albergues comunitarios...',
    'Guerrero': 'Estado de origen, tránsito y retorno, con alta vulnerabilidad. Promueve acciones contra la trata de personas y la migración forzada, asimismo opera brigadas, módulos de atención y acompañamiento psicosocial para población retornada, con especial atención a mujeres, niñas y comunidades indígenas.',
    'Hidalgo': 'Proyectos productivos para migrantes retornados...',
    'Jalisco': 'Jalisco es una entidad clave en el panorama migratorio nacional, ya que confluyen en su territorio los cuatro principales flujos: tránsito, destino, retorno y migración interna. Además, alberga a personas solicitantes y sujetas de Protección Internacional. En coordinación con organismos internacionales, el estado ha fortalecido sus programas con enfoque de integración local, promoviendo el acceso a servicios de salud, empleo y educación para personas migrantes y refugiadas. Cuenta con albergues tanto gubernamentales como de la sociedad civil, varios de ellos con enfoque familiar, y atención a niñas, niños y adolescentes en situación de movilidad.',
    'México': 'Sistema de alerta temprana para migrantes...',
    'Michoacán': 'Michoacán es un estado perteneciente a la región historíca de la migración con presencia principalmente de flujos migratorios de de origen, tránsito, y retorno con presencia de personas retornadas desde EE. UU, asimismo se han identificado personas Desplazadas Internas. Entre sus servicios, ofrece asistencia legal y vocacional a deportados, y programas de prevención de tráfico de personas.',
    'Morelos': 'Programas educativos interculturales...',
    'Nayarit': 'Estrategias de protección a menores migrantes...',
    'Nuevo León': 'Sistema de información sobre derechos migratorios...',
    'Oaxaca': 'Oaxaca es un estado de origen, tránsito y retorno, con una importante presencia de comunidades indígenas migrantes. Las dinámicas migratorias están marcadas por la pobreza, la desigualdad y la migración forzada, tanto interna como internacional, el estado ha impulsado acciones de protección para personas retornadas, búsqueda de personas desaparecidas, atención psicojurídica a familiares y mecanismos de acompañamiento comunitario. Sus acciones y políticas destacan por sus enfoques intercultural e interseccional, especialmente en la atención a mujeres, niñez migrante e integrantes de pueblos originarios, promoviendo procesos dignos y seguros.',
    'Puebla': 'Puebla es un estado de tránsito, destino y retorno para personas migrantes, incluyendo población repatriada desde Estados Unidos, cuenta con centros estatales que ofrecen asistencia médica, jurídica y psicosocial a quienes retornan, así como talleres de reintegración social y laboral. Se destaca la protección a mujeres, infancia y población LGBTTTIQ+, junto con iniciativas comunitarias y campañas interculturales que promueven la inclusión y combaten la discriminación.',
    'Querétaro': 'Querétaro es un estado de destino, tránsito y retorno, con una creciente presencia de personas migrantes y repatriadas desde Estados Unidos. A través del Consejo Estatal de Atención a Migrantes y un marco normativo local, se implementan programas de acompañamiento integral para personas en retorno voluntario, que incluyen asistencia psicosocial, orientación legal, capacitación laboral y apoyo al emprendimiento. También se han fortalecido mecanismos de protección a solicitantes de asilo y población en situación de vulnerabilidad, con especial atención a mujeres, niñez migrante.',
    'Quintana Roo': 'Estrategias de protección en zonas turísticas...',
    'San Luis Potosí': 'San Luis Potosí es un estado de tránsito, destino y retorno, con población extranjera en movilidad y personas mexicanas repatriadas desde Estados Unidos. Cuenta con una red de 58 enlaces municipales coordinados por el Instituto de Migración y Enlace Internacional, que promueven acceso a servicios, derechos humanos e integración comunitaria. Destacan programas de reunificación familiar para adultos mayores, atención a niñas, niños y adolescentes en movilidad, y colaboración con albergues y organizaciones civiles. El estado impulsa acciones con enfoque intercultural e interseccional, priorizando a mujeres, pueblos indígenas y personas en situación de vulnerabilidad.',
    'Sinaloa': 'Red de atención a migrantes extracontinentales...',
    'Sonora': 'Programas fronterizos de protección consular...',
    'Tabasco': 'Estrategias de adaptación climática para comunidades migrantes...',
    'Tamaulipas': 'Protocolos de seguridad para migrantes...',
    'Tlaxcala': 'Programas de reunificación familiar...',
    'Veracruz': 'Red de atención a víctimas de violencia...',
    'Yucatán': 'Programas de integración lingüística...',
    'Zacatecas': 'Zacatecas es un estado históricamente expulsor de población, con fuerte vínculo con comunidades migrantes en Estados Unidos. Registra flujos de retorno y tránsito. La entidad destaca por un robusto marco institucional liderado por la Secretaría del Zacatecano Migrante (SEZAMI), que implementa programas de reunificación familiar, reintegración laboral, traslado humanitario y asesoría jurídica para personas en movilidad. A través de leyes locales, consejos interinstitucionales y plataformas digitales, promueve la protección de derechos, el vínculo con la diáspora y la participación comunitaria, con énfasis en mujeres, personas adultas mayores y niñez migrante.'
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

public hacerZoomAMexico(): void {
  this.mostrarFiltrosYMapa = true;
  if (this.map) {
    const mexicoCenter = fromLonLat([-102.0, 23.8]);

    this.map.getView().animate({
      center: mexicoCenter,
      zoom: 5,
      duration: 1000
    });
  }
}

  private initializeMap(): void {
    // 1. Configuración del visor centrado en México
   this.mapView = new View({
  center: fromLonLat([0, 20]), // Vista global
  zoom: 2,
  minZoom: 2,
  maxZoom: 10
});


    // 2. Capa base
    const baseLayer = new TileLayer({
      source: new OSM()
    });

   

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
      view: this.mapView
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
  conInterseccionalidades: boolean,
  tipos_de_actor: string | null
}) {
  this.regionesSeleccionadas = event.regions;
  this.categoriasSeleccionadas = event.categories;
  this.selectedBorders = event.borders;
  this.selectedNaturalezas = event.naturaleza_politica_publica;
  this.poblacionSeleccionada = event.poblacion_objetivo || [];
  this.mostrarConInterseccionalidades = event.conInterseccionalidades;
  this.selectedTiposDeActor = event.tipos_de_actor;

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
    generarPDF({ practica, filteredData }: { practica: any, filteredData: any[] }) {
  const element = document.createElement('div');
  element.innerHTML = `
    <h1>Buenas prácticas</h1>
    <ul>
      ${filteredData.map(row => `
        <li>
          <strong>${row.buena_practica}</strong> - ${row.estado} - ${row.naturaleza_politica_publica}
        </li>
      `).join('')}
    </ul>
  `;

  const opt = {
    margin:       0.5,
    filename:     'buenas-practicas.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
}
    
}
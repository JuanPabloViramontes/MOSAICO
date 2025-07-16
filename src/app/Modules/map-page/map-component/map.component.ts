import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild('stateCard') stateCard!: ElementRef<HTMLDivElement>;
   @ViewChild('mapaYmatriz') mapaYmatriz!: ElementRef;
    @ViewChild('introVideo') introVideoRef!: ElementRef<HTMLVideoElement>;
  private _estadosDesdeMatriz: string[] = [];
   public mapaAnimado = false;
  private map!: Map;
  private mapView!: View;
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
  public tooltipText: string = '';
  public tooltipX: number = 0;
  public tooltipY: number = 0;
  public showTooltip: boolean = false;
mostrarFiltrosYMapa = false;
mostrarOpcionesIniciales = true;
mostrarVideo = false;
mostrarMapa = false;
public modoResumen: 'resumido' | 'intermedio' | 'completo' = 'resumido';
public selectedCategories: string[] = [];




  private stateImages: {[key: string]: string[]} = {
    'Nuevo León': ['assets/images/Estados/nuevoleon1.jpeg', 'assets/images/Estados/nuevoleon2.jpg', 'assets/images/Estados/nuevoleon3.jpg'],
    'Jalisco': ['assets/images/Estados/nuevoleon1.jpeg', 'assets/images/OIM3.jpeg', 'assets/images/OIM4.jpeg'],
     'Chihuahua': ['assets/images/Estados/chihuahua.png'],

  };
  
  private statePractices: {[key: string]: string} = {
    'Aguascalientes': 'Aguascalientes es un estado con presencia migratoria moderada y diversa. Recibe personas extranjeras en tránsito, solicitantes de asilo y residentes temporales, principalmente de Guatemala, Cuba, Nicaragua, Haití, Honduras y Venezuela. También es punto de retorno para personas mexicanas repatriadas desde Estados Unidos, y registra baja incidencia de migración irregular, incluida la de niñas, niños y adolescentes.',
    'Baja California': 'Baja California es un estado fronterizo con alto flujo migratorio: personas en tránsito, solicitantes de asilo haitianos y centroamericanos, trabajadores agrícolas (incluyendo población indígena), y deportados. Cuenta con una Ley estatal para la atención de migrantes que garantiza trato digno, no discriminación y protección especial a niñas, niños y víctimas de delito así como ONGs  y albergues locales complementan con asistencia legal, humanitaria e integración comunitaria.',
    'Baja California Sur': 'Programas de integración laboral en el sector turístico...',
    'Campeche': 'Campeche es un estado que se caracteriza principalmente por flujos internos y de retorno. Su perfil migratorio destaca la articulación entre gobiernos y sociedad civil mediante comités estatales y municipales para atender a migrantes y garantizar su acceso a derechos humanos, así cómo la implemetación protocolos de atención, mecanismos de quejas ante la CNDH y acciones con enfoque en no discriminación.',
    'CDMX': 'Ciudad de México es el principal punto de llegada y destino, con atención a solicitantes de asilo, refugio, tránsito y retorno. Cuenta con una legislación avanzada protege contra la discriminación; se facilitan asilo, salud, albergue y asesoría jurídica. La capital opera con un enfoque interseccional, atendiendo prioridades por género, edad y condición migratoria.',
    'Chiapas': 'Chiapas, puerta de entrada sur y estado con ley sobre desplazamiento interno, cuenta con normas específicas para albergues de niñez migrante. Destacan el proyecto “Oficios con Perspectiva de Género y DD. HH.”, que capacita a mujeres (incluidas mujeres migrantes), en oficios de la construcción para su autonomía económica; un Protocolo DIF que estandariza la protección de niñas, niños y adolescentes en movilidad y cinco Centros de Asistencia Social rehabilitados para su primera acogida; la profesionalización de Protección Civil y su protocolo para caravanas migrantes; y el Programa de Educación Migrante (PEMCH), que asegura inscripción y regularización escolar de NNA sin importar estatus migratorio.',
    'Chihuahua': 'Chihuahua es un estado fonterizo con grandes flujos de tránsito, retorno y presencia de personas desplazadas internas de otras entidades federativas. Cuenta con programas de protección a solicitantes de asilo y deportados desde EE. UU, e implementa atención a niñez migrante, albergues y brigadas móviles, en coordinación con organismos internacionales, con enfoque humanitario y de derechos.',
    'Ciudad de México': 'Ciudad de México es el principal punto de llegada y destino, con atención a solicitantes de asilo, refugio, tránsito y retorno. Cuenta con una legislación avanzada protege contra la discriminación; se facilitan asilo, salud, albergue y asesoría jurídica. La capital opera con un enfoque interseccional, atendiendo prioridades por género, edad y condición migratoria.',
    'Coahuila': 'Coahuila es un estado fronterizo con presencia priniciplamente de flujo migratorio de tránsito; cuenta con albergues, brigadas de salud y asesoría legal cerca de cruces. Asimismo tiene programas por medio de los cuales se gestiona el retorno asistido y promueve la integración laboral de deportados y refugiados. Sus protocolos incluyen atención psicosocial, protección de infancia migrante y denuncia de violaciones de derechos.',
    'Colima': 'Colima es un estado  con flujos de tránsito y retorno. Se enfoca en asistencia a migrantes centroamericanos en ruta hacia el norte, y establece colaboradores entre autoridades municipales y colectivos para otorgar atención médica, jurídica y prevención de trata, especialmente a mujeres y niñas.',
    'Durango': 'Durango es un estado con presencia de persoans en tránsito, movilidad interna y retorno. Opera programas de identificación de víctimas de trata, campañas de sensibilización en municipios rurales, y colaboración con la CNDH. Atiende a poblaciones indígenas migrantes con enfoque diferencial.',
    'Guanajuato': 'Guanajuato, entidad con alta emigración y destino de jornaleros indígenas, cuenta con la Secretaría del Migrante y una ley estatal especializada. Destaca el Operativo Jornaleros Agrícolas Indígenas, que brinda asistencia y kits de salud en campos; el programa de reunificación “Mineros de Plata” para adultos mayores que visitan a sus familias en EE. UU.; y un Protocolo de Atención a Caravanas que coordina salud, seguridad y ayuda humanitaria. Además, homologa reglas de programas sociales para evitar la discriminación hacia personas migrantes.',
    'Guerrero': 'Estado de origen, tránsito y retorno, con alta vulnerabilidad. Promueve acciones contra la trata de personas y la migración forzada, asimismo opera brigadas, módulos de atención y acompañamiento psicosocial para población retornada, con especial atención a mujeres, niñas y comunidades indígenas.',
    'Hidalgo': 'Hidalgo, entidad del centro del país con importantes flujos de migración interna y salida internacional, cuenta con la Subsecretaría de Desarrollo Social y Humano para atender a personas en movilidad y con la Ley de Migrantes Hidalguenses y en Contextos de Movilidad como marco de protección. A través del Programa de Asistencia Social Migratoria se ofrece acompañamiento jurídico, repatriación, búsqueda de personas y cobertura de costos para documentos de viaje y trámites consulares. La legislación estatal garantiza principios de no discriminación, unidad familiar e interés superior de la niñez, y obliga a coordinar acciones de seguridad, salud y orientación junto con dependencias federales y municipales.',
    'Jalisco': 'Jalisco es una entidad clave en el panorama migratorio nacional, ya que confluyen en su territorio los cuatro principales flujos: tránsito, destino, retorno y migración interna. Además, alberga a personas solicitantes y sujetas de Protección Internacional. En coordinación con organismos internacionales, el estado ha fortalecido sus programas con enfoque de integración local, promoviendo el acceso a servicios de salud, empleo y educación para personas migrantes y refugiadas. Cuenta con albergues tanto gubernamentales como de la sociedad civil, varios de ellos con enfoque familiar, y atención a niñas, niños y adolescentes en situación de movilidad.',
    'Estado de México': 'El Estado de México es una entidad receptora de retornados y movilidad interna. Ofrece asesoría jurídica, salud y regularización migratoria en centros de atención estatales y prioriza la infancia, la población indígena y los grupos vulnerables. Adicionalmente fomenta la participación comunitaria y combate la discriminación en escuelas y albergues.',
    'Michoacán': 'Michoacán es un estado perteneciente a la región historíca de la migración con presencia principalmente de flujos migratorios de de origen, tránsito, y retorno con presencia de personas retornadas desde EE. UU, asimismo se han identificado personas Desplazadas Internas. Entre sus servicios, ofrece asistencia legal y vocacional a deportados, y programas de prevención de tráfico de personas.',
    'Morelos': 'Programas educativos interculturales...',
    'Nayarit': 'Nayarit, estado de origen, retorno y migración interna, cuenta con el Instituto de Atención y Protección a Migrantes y su propia ley estatal. Destacan el programa “La Mujer Nayarita Migrante”, que canaliza casos de mujeres en movilidad a salud, educación y justicia; el plan de reunificación temporal “Uniendo Corazones Nayaritas” que facilita el viaje de personas adultas mayores para reencontrarse con hijos en EE. UU.; ventanilla de Registro Civil en la sede del instituto para trámites de identidad; y vínculos con ICATEN para capacitación laboral de migrantes retornados. Cada año se otorga el Premio “Ernesto Galarza” a personas o asociaciones migrantes que impulsan el desarrollo y la cultura del estado.',
    'Nuevo León': 'Nuevo León es destino laboral y educativo para migrantes internos, solicitantes de refugio y personas desplazadas, y mantiene vínculos de emigración hacia EE. UU. La atención se articula desde la Dirección para la No Discriminación e Igualdad y la Mesa de Igualdad e Inclusión, que coordina salud, empleo, educación e identidad con COMAR, INM y OSC. Destacan un Espacio de Atención junto a COMAR con ventanilla informativa y asesoría jurídica; la vinculación de albergues y estancias infantiles con escuelas que inscriben a niñas y niños sin documentación plena; y la feria mensual “Tequio Hub Intercultural” que impulsa emprendimientos. Siete centros de salud brindan consulta y vacunas COVID‑19 sin exigir CURP, y la Ley estatal de Víctimas reconoce el desplazamiento forzado interno.',
    'Oaxaca': 'Oaxaca es un estado de origen, tránsito y retorno, con una importante presencia de comunidades indígenas migrantes. Las dinámicas migratorias están marcadas por la pobreza, la desigualdad y la migración forzada, tanto interna como internacional, el estado ha impulsado acciones de protección para personas retornadas, búsqueda de personas desaparecidas, atención psicojurídica a familiares y mecanismos de acompañamiento comunitario. Sus acciones y políticas destacan por sus enfoques intercultural e interseccional, especialmente en la atención a mujeres, niñez migrante e integrantes de pueblos originarios, promoviendo procesos dignos y seguros.',
    'Puebla': 'Puebla es un estado de tránsito, destino y retorno para personas migrantes, incluyendo población repatriada desde Estados Unidos, cuenta con centros estatales que ofrecen asistencia médica, jurídica y psicosocial a quienes retornan, así como talleres de reintegración social y laboral. Se destaca la protección a mujeres, infancia y población LGBTTTIQ+, junto con iniciativas comunitarias y campañas interculturales que promueven la inclusión y combaten la discriminación.',
    'Querétaro': 'Querétaro es un estado de destino, tránsito y retorno, con una creciente presencia de personas migrantes y repatriadas desde Estados Unidos. A través del Consejo Estatal de Atención a Migrantes y un marco normativo local, se implementan programas de acompañamiento integral para personas en retorno voluntario, que incluyen asistencia psicosocial, orientación legal, capacitación laboral y apoyo al emprendimiento. También se han fortalecido mecanismos de protección a solicitantes de asilo y población en situación de vulnerabilidad, con especial atención a mujeres, niñez migrante.',
    'Quintana Roo': 'Quintana Roo es un estado fronterizo y turístico con el mayor flujo de entradas internacionales, en su mayoría documentadas y de carácter recreativo, además de visitantes regionales provenientes de Belice. Atrae residentes temporales y permanentes —principalmente de Cuba, Estados Unidos, Argentina y Canadá— y expide tarjetas humanitarias a personas caribeñas y sudamericanas, mientras mantiene baja incidencia de migración irregular y repatriaciones. El gobierno estatal impulsa un sólido marco de protección: programas de identidad civil flexibles, representación y acogida para niñas, niños y adolescentes migrantes, asesoría jurídica especializada, refugios y atención integral para mujeres en movilidad víctimas de violencia, así como políticas y capacitación para prevenir la trata de personas. Ventanillas municipales y acciones de sensibilización garantizan el acceso a derechos con enfoque diferencial e intercultural.',
    'San Luis Potosí': 'San Luis Potosí es un estado de tránsito, destino y retorno, con población extranjera en movilidad y personas mexicanas repatriadas desde Estados Unidos. Cuenta con una red de 58 enlaces municipales coordinados por el Instituto de Migración y Enlace Internacional, que promueven acceso a servicios, derechos humanos e integración comunitaria. Destacan programas de reunificación familiar para adultos mayores, atención a niñas, niños y adolescentes en movilidad, y colaboración con albergues y organizaciones civiles. El estado impulsa acciones con enfoque intercultural e interseccional, priorizando a mujeres, pueblos indígenas y personas en situación de vulnerabilidad.',
    'Sinaloa': 'Red de atención a migrantes extracontinentales...',
    'Sonora': 'Sonora, estado fronterizo con EE. UU., concentra flujos de tránsito, deportaciones y migración interna. Cuenta con una Ley de Protección a Migrantes y un Consejo Estatal que coordina salud, seguridad y programas de movilidad laboral y atención a NNA. Destacan el albergue “Tin Otoch” para niñas, niños y adolescentes no acompañados, y un programa de reunificación familiar en EE. UU. Implementa módulos de orientación jurídica y acciones humanitarias conjuntas con Grupos Beta, priorizando género y derechos humanos. ',
    'Tabasco': 'Tabasco es un estado estratégico en la frontera sur, con alto tránsito migratorio, especialmente por vías terrestres como El Ceibo y Tenosique. En 2022 fue la segunda entidad con más personas detectadas en situación migratoria irregular y registró un aumento notable en repatriaciones. Ante este contexto, ha desarrollado acciones como albergues para NNA migrantes, programas de educación para personas retornadas, licencias de conducir para personas extranjeras, ferias de empleo, campañas de registro civil, vacunación abierta y un programa estatal sobre migración. Estas medidas buscan garantizar derechos y atención integral con enfoque humanitario.',
    'Tamaulipas': 'Estado estratégico por su ubicación fronteriza con EE.UU., Tamaulipas concentra una intensa movilidad internacional, particularmente en cruces terrestres y flujos de repatriación. Aunque no es un destino frecuente de residencia para personas extranjeras, sí representa un punto clave de tránsito y retorno, lo que le otorga una alta complejidad migratoria. A través del Instituto Tamaulipeco para los Migrantes, se implementan programas centrados en identidad, salud, acceso a derechos, reunificación familiar, migración laboral segura y vinculación con comunidades en EE.UU. Las acciones incluyen atención médica, legal y social, certificación de habilidades, proyectos productivos y gestión de trámites binacionales.',
    'Tlaxcala': 'Tlaxcala es un estado principalmente de origen y retorno, con migración interna moderada y una Dirección de Atención a Migrantes respaldada por una ley estatal específica. A través del programa “La DAM cerca de ti” instala ventanillas municipales capacitadas para asesorar sobre trámites consulares y derechos en el exterior. Además, el programa de reunificación “Uniendo Historias” subsidia parte de los costos de viaje para familias tlaxcaltecas que visitan a parientes en EE. UU., fortaleciendo vínculos y protección consular.',
    'Veracruz': 'Estado costero del Golfo que combina migración de origen, tránsito y retorno. Cuenta con la Dirección General de Atención a Migrantes, creada para coordinar asistencia, proyectos productivos e identidad civil. Entre sus acciones sobresale un Programa Piloto de Regularización que orienta y acompaña a personas extranjeras en sus trámites ante el INM, además de gestiones de doble nacionalidad, traslado de restos, pensiones y traducción de documentos. La DGAM articula registro civil, consulados, albergues y autoridades federales para garantizar derechos y arraigar a la población en sus comunidades.',
    'Yucatán': 'Estado de origen y destino con fuerte identidad maya; INDEMAYA lidera la atención migratoria. Mesas interinstitucionales y una red de enlaces municipales acercan trámites de identidad, pensiones y visas a comunidades mayahablantes. “Cabecitas Blancas/Sueños del Mayab” reúne a personas adultas mayores con sus familias en EE. UU. y promueve la cultura. Un programa escolar previene riesgos de migración irregular; INDEMAYA traduce documentos oficiales y gestiona la “Casa del Yucateco” en San Francisco para asesoría y difusión cultural.',
    'Zacatecas': 'Zacatecas es un estado históricamente expulsor de población, con fuerte vínculo con comunidades migrantes en Estados Unidos. Registra flujos de retorno y tránsito. La entidad destaca por un robusto marco institucional liderado por la Secretaría del Zacatecano Migrante (SEZAMI), que implementa programas de reunificación familiar, reintegración laboral, traslado humanitario y asesoría jurídica para personas en movilidad. A través de leyes locales, consejos interinstitucionales y plataformas digitales, promueve la protección de derechos, el vínculo con la diáspora y la participación comunitaria, con énfasis en mujeres, personas adultas mayores y niñez migrante.'
  };

  borderStatesMap: { [key: string]: string[] } = {
    frontera_norte: ['Baja California', 'Sonora', 'Chihuahua', 'Coahuila', 'Nuevo León', 'Tamaulipas'],
    frontera_sur: ['Chiapas', 'Tabasco', 'Campeche', 'Quintana Roo']
  };
  
  highlightedBorderStates: Set<string> = new Set();

  constructor(private http: HttpClient) {}

ngOnInit(): void {
  this.modoResumen = 'resumido';
  this.selectedCategories = this.obtenerTodasLasCategorias();
  this.loadData();
}

ngAfterViewInit() {
  this.initializeMapWhenReady();
}

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
  if (!this.statesLayer) return;

  const source = this.statesLayer.getSource();
  if (!source) return;

  const normalizedCounts: Record<string, number> = {};

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
private obtenerTodasLasCategorias(): string[] {
  const categorias = new Set<string>();
  for (const practica of this.allData) {
    for (const cat of practica.categorias || []) {
      categorias.add(cat);
    }
  }
  return Array.from(categorias);
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

    // Emitir estados filtrados iniciales (sin filtros aplicados)
    this.emitFilteredStates();
  } catch (error) {
    console.error('Error loading data:', error);
    this.allData = [];
  }
  this.setPracticeCountsForAllStates();
  this.hacerZoomAMexico(); // 👈 AÑADE ESTA LÍNEA
}

private setPracticeCountsForAllStates(): void {
  const source = this.statesLayer?.getSource();
  if (!source) return;

  // Crear un mapa de conteo por estado
  const counts: Record<string, number> = {};
  for (const practice of this.allData) {
    const rawState = practice.estado || practice.entidad || '';
    const normalized = this.normalizeStateName(rawState);
    counts[normalized] = (counts[normalized] || 0) + 1;
  }

  // Asignar conteos a cada feature (estado)
  source.forEachFeature((feature) => {
    const name = this.normalizeStateName(feature.get('name') || '');
    const count = counts[name] || 0;

    feature.set('count', count);
    feature.set('highlight', count > 0); // opcional: marcar si tiene prácticas
    feature.setStyle(this.getFeatureStyle(feature));
  });

  this.statesLayer.changed(); // actualizar visualmente
}


public hacerZoomAMexico(): void {
  
  this.mostrarFiltrosYMapa = true;

  // Reinicia la animación por si ya se había activado antes
  this.mapaAnimado = false;
  setTimeout(() => this.mapaAnimado = true, 50); // delay mínimo para reiniciar

  // Zoom al mapa
  if (this.map) {
    const mexicoCenter = fromLonLat([-102.0, 23.8]);

    this.map.getView().animate({
      center: mexicoCenter,
      zoom: 5,
      duration: 1000
    });
  }

  // Scroll casi al mismo tiempo que el zoom
setTimeout(() => {
  if (!this.mapaYmatriz || !this.mapaYmatriz.nativeElement) {
    console.warn('mapaYmatriz no está disponible');
    return;
  }

  const offset = 100; // distancia desde el top (ajústalo a tu gusto)
  const y = this.mapaYmatriz.nativeElement.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top: y, behavior: 'smooth' });
}, 300);
}


  private initializeMap(): void {
    if (!document.getElementById('map-container')) {
    console.error('El contenedor del mapa no existe');
    return;
  }
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
    this.setPracticeCountsForAllStates();

    // 5. Interacción de selección con clic (modificado)
    const select = new Select({
      condition: click,
      layers: [this.statesLayer],
      style: null
    });

    select.on('select', (e) => {
  // Si había una selección previa, quitar estilo y desmarcar highlight
  if (this.selectedFeature) {
    this.selectedFeature.set('highlight', false);
    this.selectedFeature.setStyle(null);
  }

  // Asignar nueva selección
  this.selectedFeature = e.selected[0];

  if (this.selectedFeature) {
    const stateName = this.selectedFeature.get('name') || '';

    // ✅ Establecer nombre en el texto de selección
    selectedText.setText(stateName);

    // ✅ Marcar como seleccionado y resaltar visualmente
    this.selectedFeature.set('highlight', true);
    this.selectedFeature.setStyle(this.selectedStyle);

    // ✅ Actualizar estado seleccionado
    this.selectedState = {
      name: stateName,
      practices: this.statePractices[stateName] || 'Información no disponible.'
    };
  setTimeout(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, 100);

    this.selectedMatrixState = stateName;

    // ✅ Cargar imágenes del estado seleccionado
    const normalizedState = this.normalizeStateName(stateName);
    this.carouselImages = this.stateImages[stateName] || [];

    // ✅ Zoom al estado seleccionado
    const extent = this.selectedFeature.getGeometry()?.getExtent();
    if (extent) {
      this.map.getView().fit(extent, { padding: [50, 50, 50, 50], duration: 500, maxZoom: 8 });
    }

    // ✅ Determinar región a partir de capas visibles (si usas esto)
    const regionesEstado = Object.entries(this.regionLayers)
      .filter(([region, layer]) => {
        const features = layer.getSource()?.getFeatures() || [];
        return features.some(f => f.get('name') === stateName);
      })
      .map(([region]) => region);

    this.regionesSeleccionadas = regionesEstado;

    // ✅ Forzar refresco visual
    this.statesLayer.changed();
  } else {
    // Si se deseleccionó todo
    this.selectedState = null;
    this.selectedMatrixState = null;
    this.carouselImages = [];
    this.regionesSeleccionadas = [];
  }
    this.statesLayer.changed();
  });

  this.map.addInteraction(select);

  const hoverSelect = new Select({
  condition: pointerMove,
  layers: [this.statesLayer],
  style: (feature) => {
    return new Style({
      stroke: new Stroke({
        color: '#ff9900',
        width: 2
      }),
      fill: new Fill({
        color: 'rgba(19, 82, 207, 0.2)'
      })
    });
  }
});
this.map.addInteraction(hoverSelect);
this.map.on('pointermove', (event) => {
  const pixel = this.map.getEventPixel(event.originalEvent);
  const feature = this.map.forEachFeatureAtPixel(pixel, f => f);

 if (feature && feature.get('highlight')) {
  const stateName = feature.get('name');
  const count = feature.get('count') || 0;

  this.tooltipText = `${stateName}: ${count} práctica${count === 1 ? '' : 's'}`;

  const pointerEvent = event.originalEvent as PointerEvent;
  const tooltipWidth = 80;
  const tooltipHeight = 80;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let x = pointerEvent.clientX - tooltipWidth / 2;
  let y = pointerEvent.clientY - 100;

  if (x < 10) x = 10;
  if (x + tooltipWidth > viewportWidth - 10) {
    x = viewportWidth - tooltipWidth - 10;
  }
  if (y + tooltipHeight > viewportHeight - 10) {
    y = pointerEvent.clientY - tooltipHeight - 20;
  }

  this.tooltipX = x;
  this.tooltipY = y;
  this.showTooltip = true;
} else {
  this.showTooltip = false;
}
});
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
    source.forEachFeature(feature => {
      feature.set('highlight', false);   // ❗ quitar highlight
      feature.setStyle(undefined);            // ❗ quitar estilo aplicado manualmente
    });
    this.statesLayer.changed();
  }

  this.selectedFeature = null;           // ❗ limpiar selección visual
  this.selectedState = null;
  this.selectedMatrixState = null;
  this.regionesSeleccionadas = [];
  this.categoriasSeleccionadas = [];
  this.carouselImages = [];

  // Centrar vista en México
  this.map.getView().animate({ center: fromLonLat([-102.0, 23.8]), zoom: 5, duration: 500 });
}

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
  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.fontSize = '12px';
  container.style.color = '#333';

  const selectedState = this.selectedState?.name || 'Estado no identificado';
  const introduction = this.selectedState?.practices || 'Sin descripción disponible.';

    container.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="assets/images/logos.jpg" alt="Logo OIM" style="height: 60px; margin-bottom: 10px;" />
      <h2 style="margin: 0; color: #002e6d;">Buenas Prácticas en ${selectedState}</h2>
    </div>

    <p style="margin-bottom: 20px;">${introduction}</p>

    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #004080; color: white;">
          <th style="padding: 8px; border: 1px solid #ccc;">Buena práctica</th>
          <th style="padding: 8px; border: 1px solid #ccc;">Estado</th>
          <th style="padding: 8px; border: 1px solid #ccc;">Naturaleza política</th>
        </tr>
      </thead>
      <tbody>
        ${filteredData.map(row => `
          <tr>
            <td style="padding: 8px; border: 1px solid #ccc;">${row.buena_practica}</td>
            <td style="padding: 8px; border: 1px solid #ccc;">${row.estado}</td>
            <td style="padding: 8px; border: 1px solid #ccc;">${row.naturaleza_politica_publica}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  const options = {
    margin: 0.5,
    filename: `buenas-practicas-${selectedState.toLowerCase().replace(/\s/g, '-')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(options).from(container).save();
}

updateCountsOnMap(counts: { [estado: string]: number }) {
   if (!this.statesLayer || !this.statesLayer.getSource()) return;
  const source = this.statesLayer.getSource();
  if (!source) return;

  // Función para normalizar nombres: quitar acentos, espacios y pasar a minúsculas
  const normalizeStateName = (name: string): string => {
    return name
      .toLowerCase()
      .normalize('NFD')                // Descomponer acentos
      .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
      .replace(/\s+/g, '')             // Quitar espacios
      .replace(/[^\w]/g, '');          // Quitar caracteres no alfanuméricos
  };

  // Crear un nuevo objeto con las claves normalizadas
  const normalizedCounts: { [estadoNormalizado: string]: number } = {};
  for (const estado in counts) {
    normalizedCounts[normalizeStateName(estado)] = counts[estado];
  }

  // Recorrer las features y asignar el count correspondiente
  source.forEachFeature((feature) => {
    const featureName = normalizeStateName(feature.get('name') || '');
    const count = normalizedCounts[featureName] || 0;

    feature.set('count', count);
    feature.setStyle(this.getFeatureStyle(feature));
  });

  this.statesLayer.changed();
}

private mapInitialized = false;
mostrarTodasLasPracticas = true;
ocultarVideoYMostrarMapa(): void {
  this.mostrarOpcionesIniciales = false;
  this.mostrarMapa = true;
  this.mostrarVideo = false;

  this.selectedCategories = [];
  this.regionesSeleccionadas = [];
  this.selectedBorders = [];
  this.selectedNaturalezas = [];
  this.poblacionSeleccionada = [];
  this.selectedTiposDeActor = null;
  this.selectedMatrixState = null;

  this.mostrarTodasLasPracticas = false; // 👈 Esto es lo que cambia la lógica
  this.modoResumen = 'resumido';
  if (!this.mapInitialized) {
    setTimeout(() => this.initializeMapWhenReady(), 300);
  } else if (this.map) {
    // Si el mapa ya existe, solo actualizar
    this.map.updateSize();
    this.hacerZoomAMexico();
  }

     setTimeout(() => {
    if (this.mostrarMapa) {
      this.initializeMapWhenReady();
    }
  }, 300);
}

private initializeMapWhenReady(): void {
  const container = document.getElementById('map-container');
  if (!container) {
    setTimeout(() => this.initializeMapWhenReady(), 100);
    return;
  }

  if (!this.map) {
    this.initializeMap();
  } else {
    this.map.updateSize();
    this.hacerZoomAMexico();
  }
}
mostrarVideoTutorial() {
  this.mostrarOpcionesIniciales = false;
  this.mostrarVideo = true;
}
cerrarVideoTutorial() {
  this.mostrarVideo = false;
  this.mostrarOpcionesIniciales = true;
}
volverAInicio(): void {
  this.mostrarOpcionesIniciales = true;
  this.mostrarMapa = false;
  this.mostrarVideo = false;
  this.selectedState = null;

  // 🔴 Destruye el mapa para evitar errores al volver
  if (this.map) {
    this.map.setTarget(undefined); // Quita la referencia al DOM
    this.map = null as any;   // Asegura que se cree uno nuevo después
  }
}
getColorPorVolumen(): string {
  if (!this.selectedState || !this.allData) return '#1a365d';

  const estado = this.selectedState.name;
  const normalizado = this.normalizeStateName(estado);

  const tieneVolumen3 = this.allData.some(p =>
    this.normalizeStateName(p.estado || p.entidad || '') === normalizado &&
    p.volumen === 3
  );

  const tieneVolumen2 = this.allData.some(p =>
    this.normalizeStateName(p.estado || p.entidad || '') === normalizado &&
    p.volumen === 2
  );

  if (tieneVolumen3) return '#28a745'; // verde
  if (tieneVolumen2) return '#ffc107'; // amarillo
  return '#dc3545'; // rojo por defecto (volumen 1)
}



}

    

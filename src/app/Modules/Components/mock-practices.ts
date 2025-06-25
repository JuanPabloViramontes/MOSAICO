export const BUENAS_PRACTICAS = [
    {
      entidad: 'CDMX',
      nombre: 'Inclusión Digital',
      resumen: 'Educación en línea para adultos mayores',
      categoria: 'Educación',
      subcategoria: 'Tecnología educativa',
      region: 'Centro',
      covid: true,
      vigente: true,
      poblacionObjetivo: ['Adultos mayores'],
      criterios: ['innovación', 'escalabilidad'],
      actores: ['Gobierno', 'OSC'],
      resultados: 'Más de 10,000 personas capacitadas',
      volumen: 10000
    },
    {
      entidad: 'Jalisco',
      nombre: 'Salud para Todos',
      resumen: 'Unidades móviles en zonas rurales',
      categoria: 'Salud',
      subcategoria: 'Atención primaria',
      region: 'Occidente',
      covid: false,
      vigente: true,
      poblacionObjetivo: ['Comunidades rurales'],
      criterios: ['colaboración', 'sostenibilidad'],
      actores: ['Gobierno'],
      resultados: 'Cobertura en 30 municipios',
      volumen: 15000
    },
];

    interface Conteo {
        [key: string]: string | number;
      }
      
      interface ConteoEstado {
        estado: string;
        total: number;
      }
      
      interface ConteoPoblacion {
        poblacion: string;
        total: number;
      }
      
      interface ConteoCategoria {
        categoria: string;
        total: number;
      }
      

  
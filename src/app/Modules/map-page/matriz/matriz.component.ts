import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-matriz',
  templateUrl: './matriz.component.html',
  styleUrls: ['./matriz.component.css'],
  standalone: false
})
export class MatrizComponent implements OnInit {
  @Input() selectedRegions: string[] = [];
  @Input() selectedState: string | null = null;
  @Input() selectedCategories: number[] = [];
  @Input() selectedBorders: string[] = [];
  @Input() selectedNaturalezas: string[] = [];
  @Input() selectedPoblacionObjetivo: string[] = [];
  @Input() mostrarSoloInterseccionalidad: boolean = false; // <-- ESTA LÍNEA

  matrizNivel: 'resumido' | 'intermedio' | 'completo' = 'completo';


  borderStatesMap: { [key: string]: string[] } = {
    frontera_norte: ['Baja California', 'Sonora', 'Chihuahua', 'Coahuila', 'Nuevo León', 'Tamaulipas'],
    frontera_sur: ['Chiapas', 'Tabasco', 'Campeche', 'Quintana Roo']
  };
  
  regionStatesMap: { [key: string]: string[] } = {
    norte: ['Baja California', 'Baja California sur', 'Sonora', 'Chihuahua', 'Coahuila', 'Nuevo León', 'Tamaulipas', 'Sinaloa', 'Durango'],
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
  
  // Agrega esta propiedad
searchTerm: string = '';

// Modifica el getter filteredData para incluir la búsqueda
get filteredData(): any[] {
  const hasRegion = this.selectedRegions.length > 0;
  const hasBorder = this.selectedBorders.length > 0;
  const hasState = !!this.selectedState;

  let filteredStates: string[] = [];

  if (hasBorder) {
    filteredStates = this.selectedBorders.flatMap(border => this.borderStatesMap[border] || []);
  } else if (hasRegion) {
    filteredStates = this.selectedRegions.flatMap(region => this.regionStatesMap[region] || []);
  }

  if (hasState && this.selectedState) {
    filteredStates.push(this.selectedState);
  }

  const allFilteredStates = Array.from(new Set(filteredStates.map(s => s.trim())));

  return this.allData.filter(row => {
    const rowState = row.estado?.trim();
    const categoriaNum = parseInt(row.categoria?.split('.')[0], 10);
    const naturaleza = row.naturaleza_politica_publica?.trim();

    const matchesState = allFilteredStates.length === 0 || allFilteredStates.includes(rowState);
    const matchesCategory = this.selectedCategories.length === 0 || this.selectedCategories.includes(categoriaNum);
    const matchesNaturaleza = this.selectedNaturalezas.length === 0 || this.selectedNaturalezas.includes(naturaleza);

    const poblacionObj = row.poblacion_objetivo || {};
    const matchesPoblacion = this.selectedPoblacionObjetivo.length === 0 ||
      this.selectedPoblacionObjetivo.some(key => poblacionObj[key] === 1);

    const matchesInterseccionalidad = !this.mostrarSoloInterseccionalidad ||
      Object.values(poblacionObj).filter(val => val === 1).length > 1;

    // Nueva condición para la búsqueda
    const matchesSearch = !this.searchTerm || 
      Object.values(row).some(val => 
        val && val.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      );

    return matchesState && matchesCategory && matchesNaturaleza && 
           matchesPoblacion && matchesInterseccionalidad && matchesSearch;
  });
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

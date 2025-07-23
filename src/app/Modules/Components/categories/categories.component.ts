import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  standalone: false,
})
export class CategoriesComponent implements AfterViewInit {
  @ViewChild('carouselTrack', { static: true }) carousel!: ElementRef;
  selectedCard: any = null;
  activeImageIndex: number = 0;

  cards = [
    {
      title: 'Estado o región',
      image: 'assets/images/variables/variables-01.jpg',
      modalContent: {
      question: '¿DÓNDE SE IMPLEMENTÓ LA BUENA PRÁCTICA?',
      description: 'Este campo indica en qué estado de la República Mexicana se desarrolló la acción. Nos permite reconocer qué territorios están construyendo respuestas locales a los retos de la migración, visibilizando esfuerzos que promueven la dignidad, inclusión y derechos de las personas en movilidad.',
          images: [
          { src: 'assets/images/variables/regiones.png', caption: 'Regiones' },
        ],
      }
    },
    {
      title: 'Estado fronterizo',
      image: 'assets/images/variables/variables-02.jpg',
      modalContent: {
        question: '¿LA ENTIDAD TIENE FRONTERA INTERNACIONAL?',
        description: 'Aquí se señala si el estado colinda con Estados Unidos, Guatemala o Belice. Esta información es clave, ya que las dinámicas migratorias en zonas fronterizas suelen marcar lógicas específicas y requieren estrategias específicas para garantizar derechos y responder a contextos de alta movilidad.',
        images: [
          { src: 'assets/images/variables/fronterizo.png', caption: 'Estado fronterizo de Chihuahua' },
        ],
      }
    },
    {
      title: 'Tema de la buena práctica',
      image: 'assets/images/variables/variables-03.jpg',
      modalContent: {
        question: '¿CUÁL FUE EL ENFOQUE DE LA ACCIÓN IMPLEMENTADA?',
        description: 'Identifica el área central de la buena práctica, como salud, educación, vivienda, integración, atención humanitaria, regularización o participación ciudadana. Visibilizar estos enfoques permite mapear las prioridades territoriales y detectar áreas que requieren mayor atención o fortalecimiento.',
        images: [
          { src: 'assets/images/variables/buenapractica.png', caption: 'Niña recibe su acta de nacimiento acompañada de sus padres guatemaltecos' },
        ],
      }
    },
    {
      title: 'Flujo o situación migratoria',
      image: 'assets/images/variables/variables-05.jpg',
      modalContent: {
        question: '¿A QUÉ TIPO DE MOVILIDAD RESPONDE LA ACCIÓN?',
        description: 'Esta categoría permite identificar a qué perfil de población migrante se dirige la práctica: personas en tránsito, solicitantes de asilo, retornadas, desplazadas internas o comunidades receptoras. Diferenciar estos perfiles ayuda a comprender mejor las necesidades específicas de cada grupo.',
        images: [
      { src: 'assets/images/variables/situacionmigratoria.png', caption: 'El Paso, Texas' },
        ],
      }
    },
    {
      title: 'Interseccionalidad',
      image: 'assets/images/variables/variables-06.jpg',
      modalContent: {
        question: '¿LA ACCIÓN TOMA EN CUENTA OTRAS CONDICIONES DE VULNERABILIDAD?',
        description: 'Señala si la práctica considera factores como género, edad, discapacidad, diversidad, pertenencia étnica o situación socioeconómica. Esto permite identificar acciones con enfoque interseccional.',
        images: [
           { src: 'assets/images/variables/interseccionalidades.png', caption: 'Caravana de migrantes pasando por Chiapas' },
        ],
      }
    },
    {
      title: 'Volumen de procedencia',
      image: 'assets/images/variables/variables-07.jpg',
      modalContent: {
        question: '¿EN QUÉ VOLUMEN DEL REPOSITORIO SE ENCUENTRA LA PRÁCTICA?',
        description: 'Este campo ubica la buena práctica dentro del repositorio, de acuerdo con el año en que fue registrada o integrada. Es útil para conocer la transformación de las respuestas institucionales a lo largo del tiempo y facilitar la consulta organizada de la información.',
        images: [
           { src: 'assets/images/variables/volumen1.png', caption: 'Portada de volumen 1' },
           { src: 'assets/images/variables/volumen2.png', caption: 'Portada de volumen 2' },
           { src: 'assets/images/variables/volumen3.png', caption: 'Portada de volumen 3' },
        ],
      }
    },
    {
      title: 'Actores involucrados',
      image: 'assets/images/variables/variables-08.jpg',
      modalContent: {
        question: '¿QUIÉNES PARTICIPARON EN LA IMPLEMENTACIÓN?',
        description: 'Describe los actores clave involucrados en la puesta en marcha de la práctica, como gobiernos locales, organizaciones de la sociedad civil, agencias internacionales, sector privado o comunidades migrantes. Reconocer la participación multisectorial refuerza la importancia de la colaboración para lograr impactos sostenibles.',
        images: [
          { src: 'assets/images/variables/actores.png', caption: 'Sede del Instituto Nacional de Migración (INM) en CDMX' },
        ],
      }
    },
    {
      title: 'Temporalidad',
      image: 'assets/images/variables/variables-09.jpg',
      modalContent: {
        question: '¿CUÁNDO SE PUSO EN MARCHA LA ACCIÓN?',
        description: 'Permite conocer el año de inicio de la práctica. Esta información es relevante para entender si se trata de una acción reciente, sostenida en el tiempo o adaptada a nuevos contextos, lo que puede indicar su efectividad y capacidad de respuesta ante escenarios cambiantes.',
        images: [
          { src: 'assets/images/variables/temporalidad.png', caption: 'Migrantes cruzando el Río Grande' },
        ],
      }
    }
  ];

  scrollCarousel(direction: number) {
    const cardWidth = 240; // Tarjetas más compactas
    const container = this.carousel.nativeElement;
    container.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  }

  ngAfterViewInit() {
    const carouselElement = document.getElementById('multiCardCarousel');
    if (carouselElement) {
      new bootstrap.Carousel(carouselElement, {
        interval: 5000,
        wrap: true,
        keyboard: true,
        ride: 'carousel'
      });
    }
  }

  openModal(card: any) {
    
    this.selectedCard = JSON.parse(JSON.stringify(card));
    this.activeImageIndex = 0;
    const modal = document.getElementById('cardModal');
    if (modal) {
      new bootstrap.Modal(modal).show();
    }
  }

  nextImage() {
    if (this.selectedCard && this.selectedCard.modalContent.images) {
      this.activeImageIndex =
        (this.activeImageIndex + 1) % this.selectedCard.modalContent.images.length;
    }
  }

  prevImage() {
    if (this.selectedCard && this.selectedCard.modalContent.images) {
      this.activeImageIndex =
        (this.activeImageIndex - 1 + this.selectedCard.modalContent.images.length) %
        this.selectedCard.modalContent.images.length;
    }
  }

  onDropdownChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  const value = target.value;

  if (this.selectedCard) {
    this.selectedCard.modalContent.selectedOption = value;
  }
}
selectedImageSrc: string | null = null;

openImageLightbox() {
  this.selectedImageSrc = this.selectedCard?.modalContent.images[this.activeImageIndex]?.src || null;
  const lightboxModalEl = document.getElementById('imageLightbox');
  if (lightboxModalEl) {
    const modalInstance = new bootstrap.Modal(lightboxModalEl);
    modalInstance.show();
  }
}



  trackByCardId(index: number, card: any): any {
    return card.id || index;
  }
}

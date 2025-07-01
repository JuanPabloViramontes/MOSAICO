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
      image: 'assets/images/variables/variables-01.png',
      modalContent: {
      question: '¿Dónde se implementó la buena práctica?',
      description: 'Este campo indica en qué estado de la República Mexicana se desarrolló la experiencia. Nos permite reconocer qué territorios están construyendo respuestas locales a los retos de la migración, visibilizando esfuerzos que promueven la dignidad, inclusión y derechos de las personas en movilidad.',
          images: [
          { src: 'assets/images/regiones.png', caption: 'Regiones' },
        ],
      }
    },
    {
      title: 'Estado fronterizo',
      image: 'assets/images/variables/variables-02.png',
      modalContent: {
        question: '¿La entidad tiene frontera internacional?',
        description: 'Aquí se señala si el estado colinda con Estados Unidos, Guatemala o Belice. Las dinámicas migratorias en zonas fronterizas suelen ser más complejas y requieren respuestas específicas para proteger derechos, atender necesidades urgentes y facilitar procesos de tránsito, retorno o integración.',
        images: [
          { src: 'assets/images/cempa-detail1.jpg', caption: 'Cultivo de cempasúchil' },
          { src: 'assets/images/cempa-detail2.jpg', caption: 'Decoración tradicional' }
        ],
      }
    },
    {
      title: 'Tema de la buena práctica',
      image: 'assets/images/variables/variables-03.png',
      modalContent: {
        question: '¿Cuál fue el enfoque de la acción implementada?',
        description: 'Identifica el área central de la buena práctica: desde el acceso a derechos como salud, educación o vivienda, hasta la integración comunitaria, la atención humanitaria, la regularización o la participación ciudadana.',
        images: [
          { src: 'assets/images/atardecer-detail1.jpg', caption: 'Atardecer en la playa' },
          { src: 'assets/images/atardecer-detail2.jpg', caption: 'Atardecer en la montaña' }
        ],
      }
    },
    {
      title: 'Covid-19',
      image: 'assets/images/variables/variables-04.png',
      modalContent: {
        question: '¿Está relacionada con la emergencia sanitaria por Covid-19?',
        description: 'Indica si la buena práctica respondió a los desafíos derivados de la pandemia, como acceso a servicios de salud, empleo, albergue o regularización migratoria.',
        images: [
          { src: 'assets/images/cempa-detail1.jpg', caption: 'Cultivo de cempasúchil' },
          { src: 'assets/images/cempa-detail2.jpg', caption: 'Decoración tradicional' }
        ],
      }
    },
    {
      title: 'Flujo o situación migratoria',
      image: 'assets/images/variables/variables-05.png',
      modalContent: {
        question: '¿A qué tipo de movilidad responde la acción?',
        description: 'Esta categoría señala a qué perfil de población migrante está dirigida la práctica: personas en tránsito, solicitantes de asilo, población retornada, niñez migrante, personas desplazadas internas o comunidades receptoras.',
        images: [
          { src: 'assets/images/atardecer-detail1.jpg', caption: 'Atardecer en la playa' },
          { src: 'assets/images/atardecer-detail2.jpg', caption: 'Atardecer en la montaña' }
        ],
      }
    },
    {
      title: 'Interseccionalidad',
      image: 'assets/images/variables/variables-06.png',
      modalContent: {
        question: '¿La acción toma en cuenta otras condiciones de vulnerabilidad?',
        description: 'Este criterio permite identificar si la práctica considera factores como género, edad, diversidad, discapacidad, etnia o situación socioeconómica.',
        images: [
          { src: 'assets/images/cempa-detail1.jpg', caption: 'Cultivo de cempasúchil' },
          { src: 'assets/images/cempa-detail2.jpg', caption: 'Decoración tradicional' }
        ],
      }
    },
    {
      title: 'Volumen de procedencia',
      image: 'assets/images/variables/variables-07.png',
      modalContent: {
        question: '¿En qué volumen del repositorio se encuentra la práctica?',
        description: 'Este campo ubica la buena práctica dentro del repositorio, según su año de registro o incorporación.',
        images: [
          { src: 'assets/images/cempa-detail1.jpg', caption: 'Cultivo de cempasúchil' },
          { src: 'assets/images/cempa-detail2.jpg', caption: 'Decoración tradicional' }
        ],
      }
    },
    {
      title: 'Actores involucrados',
      image: 'assets/images/variables/variables-08.png',
      modalContent: {
        question: '¿Quiénes participaron en la implementación?',
        description: '¿Quiénes participaron en la implementación? Describe los actores clave que hicieron posible la práctica: autoridades estatales o municipales, organizaciones de la sociedad civil, agencias internacionales, sector privado o comunidades migrantes.',
        images: [
          { src: 'assets/images/cempa-detail1.jpg', caption: 'Cultivo de cempasúchil' },
          { src: 'assets/images/cempa-detail2.jpg', caption: 'Decoración tradicional' }
        ],
      }
    },
    {
      title: 'Temporalidad',
      image: 'assets/images/variables/variables-09.png',
      modalContent: {
        question: '¿Cuándo se puso en marcha la acción?',
        description: 'Permite conocer el año de inicio de la práctica, su continuidad o adaptación a nuevos contextos.',
        images: [
          { src: 'assets/images/cempa-detail1.jpg', caption: 'Cultivo de cempasúchil' },
          { src: 'assets/images/cempa-detail2.jpg', caption: 'Decoración tradicional' }
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

  onDropdownChange(option: string) {
    if (this.selectedCard) {
      this.selectedCard.modalContent.selectedOption = option;
    }
  }

  trackByCardId(index: number, card: any): any {
    return card.id || index;
  }
}

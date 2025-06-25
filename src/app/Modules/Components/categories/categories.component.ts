import { AfterViewInit, Component } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  standalone: false,
})
export class CategoriesComponent implements AfterViewInit {
  cards = [
    { 
      title: 'Estado o región', 
      text: '¿Dónde se implementó la buena práctica?', 
      image: 'assets/images/atardecer.jpg',
      modalContent: {
        description: 'Esta categoría indica en qué estado de la República Mexicana ocurrió la experiencia. Ayuda a identificar qué zonas del país están impulsando políticas migratorias innovadoras.',
        images: [
          { src: 'assets/images/atardecer-detail1.jpg', caption: 'Atardecer en la playa' },
          { src: 'assets/images/atardecer-detail2.jpg', caption: 'Atardecer en la montaña' }
        ],
      }
    },
    { 
      title: 'Estado fronterizo', 
      text: '¿Está el estado ubicado en una frontera internacional?', 
      image: 'assets/images/cempa.jpg',
      modalContent: {
        description: 'Aquí se especifica si la entidad es fronteriza con Estados Unidos o Guatemala/Belice. Esto importa porque los contextos migratorios pueden ser muy diferentes en zonas de frontera.',
        images: [
          { src: 'assets/images/cempa-detail1.jpg', caption: 'Cultivo de cempasúchil' },
          { src: 'assets/images/cempa-detail2.jpg', caption: 'Decoración tradicional' }
        ],
      }
    },
    { 
      title: 'Tema de la buena práctica', 
      text: '¿De qué trata la acción o política implementada?', 
      image: 'assets/images/atardecer.jpg',
      modalContent: {
        description: 'Esta categoría permite conocer en qué área se centró la buena práctica. Aquí agrupamos distintas formas en que los gobiernos locales están respondiendo a los desafíos de la migración desde la legislación, la atención directa, los servicios básicos, la vinculación con otras autoridades y la integración comunitaria.',
        images: [
          { src: 'assets/images/atardecer-detail1.jpg', caption: 'Atardecer en la playa' },
          { src: 'assets/images/atardecer-detail2.jpg', caption: 'Atardecer en la montaña' }
        ],
      }
    },
    { 
      title: 'Covid-19', 
      text: '¿La buena práctica surgió como respuesta a la pandemia?', 
      image: 'assets/images/cempa.jpg',
      modalContent: {
        description: 'Señala si la acción está relacionada con los desafíos que trajo la emergencia sanitaria por Covid-19, como salud, empleo, albergue o regularización migratoria.',
        images: [
          { src: 'assets/images/cempa-detail1.jpg', caption: 'Cultivo de cempasúchil' },
          { src: 'assets/images/cempa-detail2.jpg', caption: 'Decoración tradicional' }
        ],
      }
    },
    { 
      title: 'Flujo o situación migratoria', 
      text: '¿A qué tipo de movilidad responde la práctica?', 
      image: 'assets/images/atardecer.jpg',
      modalContent: {
        description: 'Esta categoría identifica el perfil principal de las personas a quienes va dirigida la acción. Las buenas prácticas pueden atender a quienes migran dentro del país, cruzan fronteras, regresan, buscan protección o incluso a la población que no está en situación de movilidad pero que forma parte del contexto migratorio.',
        images: [
          { src: 'assets/images/atardecer-detail1.jpg', caption: 'Atardecer en la playa' },
          { src: 'assets/images/atardecer-detail2.jpg', caption: 'Atardecer en la montaña' }
        ],
      }
    },
    { 
      title: 'Interseccionalidad', 
      text: '¿La buena práctica toma en cuenta las distintas desigualdades que pueden afectar a una misma persona migrante?', 
      image: 'assets/images/cempa.jpg',
      modalContent: {
        description: 'Esta categoría permite identificar si la acción considera las experiencias y necesidades específicas de grupos de población que, además de estar en situación de migración, enfrentan otras condiciones de vulnerabilidad. La interseccionalidad ayuda a diseñar respuestas más justas, inclusivas y efectivas.',
        images: [
          { src: 'assets/images/cempa-detail1.jpg', caption: 'Cultivo de cempasúchil' },
          { src: 'assets/images/cempa-detail2.jpg', caption: 'Decoración tradicional' }
        ],
      }
    },
    { 
      title: 'Volumen de procedencia', 
      text: 'Volumen 1, Volumen 2, Volumen 3', 
      image: 'assets/images/atardecer.jpg',
    },
    { 
      title: 'Actores involucrados', 
      text: '¿Quiénes participaron en la buena práctica?', 
      image: 'assets/images/cempa.jpg',
      modalContent: {
        description: 'Aquí se detallan los actores clave: gobiernos municipales o estatales, sociedad civil, organismos internacionales, sector privado o comunidades locales.',
        images: [
          { src: 'assets/images/cempa-detail1.jpg', caption: 'Cultivo de cempasúchil' },
          { src: 'assets/images/cempa-detail2.jpg', caption: 'Decoración tradicional' }
        ],
      }
    },
    { 
      title: 'Temporalidad', 
      text: '¿En qué año se implementó la buena práctica?', 
      image: 'assets/images/cempa.jpg',
      modalContent: {
        description: 'Este filtro permite conocer el momento en que se puso en marcha la acción o política pública. Puede ayudarte a identificar prácticas recientes, acciones sostenidas en el tiempo o intervenciones que surgieron como respuesta a un contexto específico. Nota: Algunas buenas prácticas pueden haberse iniciado en un año determinado pero mantenerse activas o haber evolucionado con el tiempo.',
        images: [
          { src: 'assets/images/cempa-detail1.jpg', caption: 'Cultivo de cempasúchil' },
          { src: 'assets/images/cempa-detail2.jpg', caption: 'Decoración tradicional' }
        ],
      }
    },
  ];

  selectedCard: any = null;
  activeImageIndex: number = 0;

  get groupedCards() {
    const groups = [];
    for (let i = 0; i < this.cards.length; i += 4) {
      groups.push(this.cards.slice(i, i + 4));
    }
    return groups;
  }

  ngAfterViewInit() {
    const carouselElement = document.getElementById('multiCardCarousel');
    if (carouselElement) {
      new bootstrap.Carousel(carouselElement, {
        interval: 5000,  // Opcional: cambio automático cada 5s
        wrap: true,      // Esto hace el loop infinito
        keyboard: true,
        ride: 'carousel'
      });
    }
  }

  openModal(card: any) {
    // Crear copia profunda mínima para evitar referencias mutables
    this.selectedCard = JSON.parse(JSON.stringify(card));
    this.activeImageIndex = 0;
    const modal = document.getElementById('cardModal');
    if (modal) {
      // @ts-ignore
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

  trackByGroupIndex(index: number, item: any): number {
    return index;
  }
  
  trackByCardId(index: number, card: any): any {
    return card.id || index;
  }
  
}
import { Component } from '@angular/core';

@Component({
  selector: 'app-card-flip',
  standalone: false,
  templateUrl: './card-flip.component.html',
  styleUrl: './card-flip.component.css'
})
export class CardFlipComponent {

  hoverImage: string = 'assets/images/cat-03.png';
hoverFilter: string = 'none'; // Filtro por defecto

onCardHover(image?: string, color?: string) {
  this.hoverImage = image || 'assets/images/cat-03.png';
  this.hoverFilter = 'brightness(1.05) contrast(1.1)';
}


 cards = [
  {
    frontImage: 'assets/images/mosaico/categorias-01.jpg',
    backImage: 'assets/images/mosaico/categorias-02.jpg',
    frontText: '1. Buenas prácticas en la creación o reforma de las legislaciones locales y/o sus reglamentos.',
    backText: `
      <ul>
        <li>1.1 Leyes y reglamentos que facultan y regulan la participación de las instituciones del estado en la atención a la población en situación de migración</li>
        <li>1.2 Reformas a leyes y reglamentos que eliminan obstáculos o aspectos discriminatorios hacia personas en situación de migración</li>
      </ul>
    `,
    color: 'blue',
    hoverPreview: 'assets/images/cat-02.png'
  },
  {
    frontImage: 'assets/images/mosaico/categorias-03.jpg',
    backImage: 'assets/images/mosaico/categorias-04.jpg',
    frontText: '2. Buenas prácticas para optimizar registros migratorios a nivel local.',
    backText: `
      <ul>
        <li>2.1 Registros estatales de migrantes de acceso voluntario para proveerles de servicios.</li>
        <li>2.2 Mecanismos para garantizar el acceso a la información sobre programas, políticas y servicios.</li>
      </ul>
    `,
      color: 'orange',
    hoverPreview: 'assets/images/cat-03.png'
  },
  {
    frontImage: 'assets/images/mosaico/categorias-05.jpg',
    backImage: 'assets/images/mosaico/categorias-06.jpg',
    frontText: '3. Buenas prácticas en la creación o fortalecimiento de instituciones migratorias.',
    backText: `
      <ul>
        <li>3.1 Plataformas virtuales y herramientas tecnológicas para que las personas migrantes puedan acceder a asesoría y servicios.</li>
      </ul>
    `,
      color: 'green',
    hoverPreview: 'assets/images/cat-01.png'
  },
  {
    frontImage: 'assets/images/mosaico/categorias-07.jpg',
    backImage: 'assets/images/mosaico/categorias-08.jpg',
    frontText: '4. Mecanismos de vinculación interinstitucional y con sociedad civil.',
    backText: `
      <ul>
        <li>4.1 Consejos estatales</li>
        <li>4.2 Consejos consultivos</li>
        <li>4.3 Mecanismos para articular gobiernos municipales y estatales</li>
        <li>4.4 Vinculación entre estados</li>
        <li>4.5 Apoyo a clubes y federaciones de mexicanos en el exterior</li>
      </ul>
    `
  },
  {
    frontImage: 'assets/images/mosaico/categorias-09.jpg',
    backImage: 'assets/images/mosaico/categorias-10.jpg',
    frontText: '5. Vinculación con autoridades migratorias para la regularización.',
    backText: `
      <ul>
        <li>5.1 Jornadas de regularización</li>
      </ul>
    `
  },
  {
    frontImage: 'assets/images/mosaico/categorias-11.jpg',
    backImage: 'assets/images/mosaico/categorias-12.jpg',
    frontText: '6. Servicios de albergue dignos y suficientes.',
    backText: `
      <ul>
        <li>6.1 Vinculación entre albergues e instancias</li>
        <li>6.2 Instalación y rehabilitación de albergues del estado</li>
        <li>6.3 Apoyos para albergues de la sociedad civil</li>
      </ul>
    `
  },
  {
    frontImage: 'assets/images/mosaico/categorias-13.jpg',
    backImage: 'assets/images/mosaico/categorias-14.jpg',
    frontText: '7. Transversalización de servicios para personas migrantes.',
    backText: `
      <ul>
        <li>7.1 Acceso a servicios de salud</li>
        <li>7.2 Acceso a la educación</li>
        <li>7.3 Derecho a la identidad y documentos</li>
        <li>7.4 Seguridad para personas migrantes</li>
        <li>7.5 Acceso a la justicia</li>
      </ul>
    `
  },
  {
    frontImage: 'assets/images/mosaico/categorias-15.jpg',
    backImage: 'assets/images/mosaico/categorias-16.jpg',
    frontText: '8. Programas y apoyos asistenciales a migrantes.',
    backText: `
      <ul>
        <li>8.1 Apoyos económicos o en especie</li>
        <li>8.2 Asesoría o acompañamiento para prestaciones de seguridad social</li>
      </ul>
    `
  },
  {
    frontImage: 'assets/images/mosaico/categorias-17.jpg',
    backImage: 'assets/images/mosaico/categorias-18.jpg',
    frontText: '9. Programas que fomentan el empleo y autoempleo.',
    backText: `
      <ul>
        <li>9.1 Apoyos económicos para proyectos de autoempleo</li>
        <li>9.2 Estrategias para difundir emprendimientos migrantes</li>
        <li>9.3 Vinculación y acompañamiento para obtener empleos</li>
      </ul>
    `
  },
  {
    frontImage: 'assets/images/mosaico/categorias-19.jpg',
    backImage: 'assets/images/mosaico/categorias-20.jpg',
    frontText: '10. Inclusión sociocultural en comunidades de acogida.',
    backText: `
      <ul>
        <li>10.1 Fortalecimiento de vínculos culturales</li>
      </ul>
    `
  },
  {
    frontImage: 'assets/images/mosaico/categorias-21.jpg',
    backImage: 'assets/images/mosaico/categorias-22.jpg',
    frontText: '11. Procesos de sensibilización a población no migrante.',
    backText: ``
  },
  {
    frontImage: 'assets/images/mosaico/categorias-23.jpg',
    backImage: 'assets/images/mosaico/categorias-24.jpg',
    frontText: '12. Atención a situaciones de crisis o emergencia migratoria.',
    backText: `
      <ul>
        <li>12.1 Profesionalización de autoridades que atienden directamente a población migrante</li>
      </ul>
    `
  },
  {
    frontImage: 'assets/images/mosaico/categorias-25.jpg',
    backImage: 'assets/images/mosaico/categorias-26.jpg',
    frontText: '13. Buenas prácticas en procesos de reunificación familiar.',
    backText: `
      <ul>
        <li>13.1 Reunificación familiar temporal</li>
      </ul>
    `
  }
];

}

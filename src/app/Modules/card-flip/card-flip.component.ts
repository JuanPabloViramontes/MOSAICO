import { Component } from '@angular/core';

@Component({
  selector: 'app-card-flip',
  standalone: false,
  templateUrl: './card-flip.component.html',
  styleUrl: './card-flip.component.css'
})
export class CardFlipComponent {
  cards = [
    { title: '1. Buenas prácticas en la creación o reforma las legislaciones locales y/o sus reglamentos.', 
     backTitle: 'Subcategorías',  
      descriptionList: [ '1.1 Leyes y reglamentos que facultan y regulan la participación de las instituciones del estado en la atención a la población en situación de migración',
        '1.2 Reformas a leyes y reglamentos que eliminan obstáculos o aspectos discriminatorios hacia personas en situación de migración' ]},
    { title: '2. Buenas prácticas para optimizar las capacidades de llevar registros sobre los flujos migratorios a nivel local, para detectar casos de atención y para la rendición de cuentas', 
     backTitle: 'Subcategorías', 
      descriptionList: [ '2.1 Registros estatales de migrantes de acceso voluntario para proveerles de servicios.',
      '2.2 Mecanismos para garantizar el acceso a la información sobre programas, políticas y servicios' ]},
    { title: '3. Buenas prácticas en la creación y fortalecimiento de instituciones dedicadas a la atención e integración de personas en situación de migración.', 
     backTitle: 'Subcategorías', 
      description: 'Content in card three' },
    { title: '4. Buenas prácticas en el establecimiento de mecanismos de vinculación interinstitucional, asì como de mecanismos que involucren a la sociedad civil y otros sectores', 
     backTitle: 'Subcategorías',  
      descriptionList: [ '4.1 Consejos estatales',
        '4.2 Consejos consultivos',
        '4.3 Mecanismos para articular los gobiernos municipales y los estatales en acciones específicas para la atención a personas en situación de migración',
        '4.4 Vinculación entre estados.']},
    { title: '5. Buenas prácticas que propicien una vinculación eficaz con las autoridades migratorias para la regularización de personas en situación de migración', 
     backTitle: 'Subcategorías',  
      description: '5.1 Jornadas de regularización' },
    { title: '6. Buenas prácticas para garantizar servicios de albergue dignos y suficientes',
      backTitle: 'Subcategorías',  
       descriptionList: [ '6.1 Vinculación entre los albergues y otras instancias.' ,
        '6.2 Instalación y rehabilitación de albergues del estado.',
        '6.3 Apoyos para albergues de la sociedad civil.'
       ]},
    { title: '7. Buenas prácticas en la transversalización de servicios para la atención a personas en situación de migración (acceso a la identidad, salud, educación, seguridad, etc.)',
      backTitle: 'Subcategorías',  
       descriptionList: ['7.1 Acceso a los servicios de salud.',
        '7.2 Acceso a la educación.',
        '7.3 Garantizar el derecho a la identidad y la obtención de documentos.',
        '7.4 Garantizar la seguridad de personas en situación de migración.',
        '7.5 Acceso a la justicia.'
       ]},
    { title: '8. Buenas prácticas en la transversalización de programas y apoyos sociales con fines asistencialistas a personas en situación de migración', 
     backTitle: 'Subcategorías', 
      description: '8.1 Apoyos económicos o en especie' },
    { title: '9. Buenas prácticas en la transversalización de programas y acciones que fomentan el empleo y autoempleo a personas en situación de migración.', 
     backTitle: 'Subcategorías', 
      description: '9.1 Apoyos económicos para proyectos de autoempleo' },
    { title: '10. Buenas prácticas para la inclusión sociocultural de personas en situación de migración a las comunidades de acogida.', 
     backTitle: 'Subcategorías',  
      description: '10.1 Fortalecimiento de los vínculos culturales' },
    { title: '11. Buenas prácticas en procesos de sensibilización a población no migrante', 
     backTitle: 'Subcategorías',   
      description: 'Even more info' },
    { title: '12. Buenas prácticas para la atención a situaciones de crisis o emergencia migratoria', 
     backTitle: 'Subcategorías', 
      description: 'Final bit of text' },
    { title: '13. Buenas prácticas en procesos de reunificación familiar ',
      backTitle: 'Subcategorías',  
        description: '13.1. Reunificación familiar temporal' },
  ];

  pastelColors = ['#f9d5e5', '#fceabb', '#d5f4e6', '#e0bbE4', '#cce2cb'];
  pastelBacks = ['#c7ceea', '#b5ead7', '#ffdac1', '#ff9aa2', '#e2f0cb'];
}

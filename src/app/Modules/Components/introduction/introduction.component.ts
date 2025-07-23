import { Component, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-introduction',
  standalone: false,
  templateUrl: './introduction.component.html',
})
export class IntroductionComponent {
  isTextoExpandido: boolean = false;
  isPropositoOpen = false;
  @Input() imageSrc: string = '';
  @Input() imageAlt: string = 'Imagen ilustrativa';
  @ViewChild('propositoCollapse') propositoCollapse!: ElementRef;

ngAfterViewInit() {
  const el = this.propositoCollapse?.nativeElement;
  if (el) {
    el.addEventListener('shown.bs.collapse', () => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

  toggleProposito() {
  this.isPropositoOpen = !this.isPropositoOpen;

  // Hacer scroll solo si se está abriendo
  if (this.isPropositoOpen) {
    setTimeout(() => {
      this.propositoCollapse?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 350); // duración de la animación de Bootstrap
  }
}

}
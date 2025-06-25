// colomos-modal.component.ts
import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-introduction',
  standalone: false,
  templateUrl: './introduction.component.html',
})
export class IntroductionComponent {
  @Input() imageSrc: string = '';
  @Input() imageAlt: string = 'Imagen ilustrativa';
}
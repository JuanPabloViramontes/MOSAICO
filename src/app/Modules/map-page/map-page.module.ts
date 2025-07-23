import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MapComponent } from './map-component/map.component';
import { MapRoutingModule } from './map-routing.module';
import { LayersComponent } from "./layers/layers.component";
import { MatrizComponent } from './matriz/matriz.component';
import { ModalPracticaComponent } from './modal-practica/modal-practica.component';

@NgModule({
  declarations: [
  MapComponent,
  LayersComponent,
  MatrizComponent,
  ModalPracticaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MapRoutingModule,
    HttpClientModule,
]
})

export class MapPageModule{ }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { CategoriesComponent } from './categories/categories.component';
import { DocumentsComponent } from './documents/documents.component';
import { MosaicoComponent } from './mosaico/mosaico.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CardFlipComponent } from '../card-flip/card-flip.component';

@NgModule({
  declarations: [
    HomeComponent,
    IntroductionComponent,
    CategoriesComponent,
    DocumentsComponent,
    MosaicoComponent,
    CardFlipComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    HttpClientModule,
    DragDropModule
  ]
})

export class HomeModule{ }

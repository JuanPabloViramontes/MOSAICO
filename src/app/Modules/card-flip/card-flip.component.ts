import { Component } from '@angular/core';

@Component({
  selector: 'app-card-flip',
  standalone: false,
  templateUrl: './card-flip.component.html',
  styleUrl: './card-flip.component.css'
})
export class CardFlipComponent {
  cards = [
   {
    frontImage: 'assets/images/mosaico/categorias-01.png',
    backImage: 'assets/images/mosaico/categorias-02.png'
  },
    {
    frontImage: 'assets/images/mosaico/categorias-03.png',
    backImage: 'assets/images/mosaico/categorias-04.png'
  },
    {
    frontImage: 'assets/images/mosaico/categorias-05.png',
    backImage: 'assets/images/mosaico/categorias-06.png'
  },
    {
    frontImage: 'assets/images/mosaico/categorias-07.png',
    backImage: 'assets/images/mosaico/categorias-08.png'
  },
    {
    frontImage: 'assets/images/mosaico/categorias-09.png',
    backImage: 'assets/images/mosaico/categorias-10.png'
  },
    {
    frontImage: 'assets/images/mosaico/categorias-11.png',
    backImage: 'assets/images/mosaico/categorias-12.png'
  },
   {
    frontImage: 'assets/images/mosaico/categorias-13.png',
    backImage: 'assets/images/mosaico/categorias-14.png'
  },
    {
    frontImage: 'assets/images/mosaico/categorias-15.png',
    backImage: 'assets/images/mosaico/categorias-16.png'
  },
   {
    frontImage: 'assets/images/mosaico/categorias-17.png',
    backImage: 'assets/images/mosaico/categorias-18.png'
  },
   {
    frontImage: 'assets/images/mosaico/categorias-19.png',
    backImage: 'assets/images/mosaico/categorias-20.png'
  },
  {
    frontImage: 'assets/images/mosaico/categorias-21.png',
    backImage: 'assets/images/mosaico/categorias-22.png'
  },
  {
    frontImage: 'assets/images/mosaico/categorias-23.png',
    backImage: 'assets/images/mosaico/categorias-24.png'
  },
  {
    frontImage: 'assets/images/mosaico/categorias-25.png',
    backImage: 'assets/images/mosaico/categorias-26.png'
  },
  ];


}

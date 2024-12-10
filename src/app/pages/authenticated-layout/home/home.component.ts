import { Component, inject, OnInit } from '@angular/core';
import { AnimeService } from '../../../core/services/anime.service';
import {
  AnimesDTO,
  ResponseGetDTO,
} from '../../../core/interfaces/anime-dto.interface';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CarouselCardsComponent } from '../../../components/carousel-cards/carousel-cards.component';
import { GridCardsComponent } from '../../../components/grid-cards/grid-cards.component';
import { CarouselHeroHighlightComponent } from '../../../components/carousel-hero-highlight/carousel-hero-highlight.component';
import { FavoriteService } from '../../../core/services/favorite.service';

@Component({
    selector: 'app-home',
    imports: [
        CarouselCardsComponent,
        GridCardsComponent,
        CarouselHeroHighlightComponent,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly service = inject(AnimeService);
  private readonly favoriteService = inject(FavoriteService);
  animes = this.service.animes;
  favorites = this.favoriteService.animeFavorited;

  constructor() {
    this.service.onGetAnimes(0, 14);
    this.favoriteService.onGetAnimesFavorited(0, 21);
  }
}

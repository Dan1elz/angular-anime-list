import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AnimeService } from '../../../core/services/anime.service';
import { AnimesDTO } from '../../../core/interfaces/anime-dto.interface';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CarouselCardsComponent } from '../../../components/carousel-cards/carousel-cards.component';
import { GridCardsComponent } from '../../../components/grid-cards/grid-cards.component';
import { CarouselHeroHighlightComponent } from '../../../components/carousel-hero-highlight/carousel-hero-highlight.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe,
    CarouselCardsComponent,
    GridCardsComponent,
    CarouselHeroHighlightComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly service = inject(AnimeService);
  animes$!: Observable<AnimesDTO[]>;

  ngOnInit(): void {
    this.animes$ = this.service.onGetAnimes();
  }

  onFavorite(Event: Event): void {
    console.log('Favorite');
  }
  ngOnDestroy(): void {}
}

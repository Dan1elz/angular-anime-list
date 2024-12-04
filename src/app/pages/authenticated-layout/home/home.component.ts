import { Component, inject, OnInit } from '@angular/core';
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
export class HomeComponent implements OnInit {
  private readonly service = inject(AnimeService);
  animes$!: Observable<AnimesDTO[]>;

  ngOnInit(): void {
    this.animes$ = this.service.onGetAnimes();
  }

  onFavorite(
    event: { id: string; favoriteState: boolean },
    animes: AnimesDTO[]
  ): void {
    this.service.onFavorite(!event.favoriteState, event.id).subscribe({
      next: () => {
        console.log('Favorite state updated');
        const index = animes.findIndex((anime) => anime.id === event.id);
        animes[index].favoriteState = !event.favoriteState;
      },
    });
  }
}

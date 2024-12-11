import { Component, effect, inject, Signal, signal } from '@angular/core';
import { InputRadioSelectedComponent } from './components/input-radio-select/input-radio-selected.component';
import { InputCheckboxSelectComponent } from './components/input-checkbox-select/input-checkbox-select.component';
import { AnimeService } from '../../../core/services/anime.service';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { GridCardsComponent } from '../../../components/grid-cards/grid-cards.component';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';
import { GenresService } from '../../../core/services/genres.service';

@Component({
  selector: 'app-category-search',
  imports: [
    InputRadioSelectedComponent,
    InputCheckboxSelectComponent,
    GridCardsComponent,
    PaginatorComponent,
  ],
  templateUrl: './category-search.component.html',
  styleUrl: './category-search.component.scss',
})
export class CategorySearchComponent {
  private readonly service = inject(AnimeService);
  private genresService = inject(GenresService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  data = this.service.animes;
  offset = signal<number>(0);
  limit = 14;

  favorites = [
    { label: 'Favorited', value: 'true' },
    { label: 'Not Favorited', value: 'false' },
  ];
  watched = [
    { label: 'Watched', value: 'true' },
    { label: 'Not Watched', value: 'false' },
  ];
  rating = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
  ];

  genres$ = this.genresService.genres;

  genres: any = [];

  params$ = this.route.paramMap.pipe(
    map((params) => {
      var param = Number(params.get('page') ?? 1);
      if (param < 1) {
        param = 1;
      }
      return param;
    })
  );
  currentPage: Signal<number | undefined> = toSignal(this.params$);

  constructor() {
    effect(() => {
      if (this.genres$() !== undefined) {
        this.genres = this.genres$()!.map((genre: any) => ({
          label: genre.name,
          value: genre.id,
        }));
      }
      console.log('Generos', this.genres);
    });

    effect(() => {
      this.offset.set((this.currentPage()! - 1) * this.limit);
      this.service.onGetAnimes(this.offset(), this.limit);
    });
  }

  onPageChange(page: number): void {
    this.router.navigate(['/auth/categories', { page: page }]);
  }

  onToggleFavorite(event: { id: string; favoriteState: boolean }): void {
    this.service.onToggleFavorite(!event.favoriteState, event.id);
  }

  onSelectedFavoriteState(data: { label: string; value: string }) {
    console.log(data);
  }

  onSelectedWatchedState(data: { label: string; value: string }) {
    console.log(data);
  }
  onSelectedRatingState(data: { label: string; value: string }) {
    console.log(data);
  }
  onSelectedGenre(data: { label: string; value: string }[]) {
    console.log(data);
  }
}

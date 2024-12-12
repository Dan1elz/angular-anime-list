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

  selectedGenres = signal<string[] | undefined>([]);
  selectedFavorite = signal<string | undefined>(undefined);
  selectedWatched = signal<string | undefined>(undefined);
  selectedRating = signal<string | undefined>(undefined);
  currentPage = signal<number | undefined>(undefined);

  params$ = this.route.paramMap.pipe(
    map((params) => {
      var param = {} as any;

      var page = Number(params.get('page') ?? 1);
      if (page < 1) {
        page = 1;
      }
      param.page = page;

      var genres = params.getAll('genre').join(',').split(',');
      if (genres.length > 0) {
        param.genres = genres;
      }

      var favorite = params.get('favorite');
      if (favorite !== 'null') {
        param.favorite = favorite;
      }

      var watched = params.get('watched');
      if (watched !== null) {
        param.watched = watched;
      }

      var rating = params.get('rating');
      if (rating !== null) {
        param.rating = rating;
      }

      return param;
    })
  );

  params: Signal<any> = toSignal(this.params$);

  constructor() {
    effect(() => {
      this.selectedGenres.set(this.params().genres ?? []);
      this.selectedFavorite.set(this.params().favorite ?? undefined);
      this.selectedWatched.set(this.params().watched ?? undefined);
      this.selectedRating.set(this.params().rating ?? undefined);

      if (this.currentPage() !== this.params().page) {
        this.currentPage.set(this.params().page);
      }

      console.log(`params`, this.params());
    });

    effect(() => {
      if (this.genres$() !== undefined) {
        this.genres = this.genres$()!.map((genre: any) => ({
          label: genre.name,
          value: genre.id,
        }));
      }
    });
    effect(() => {
      this.offset.set((this.currentPage()! - 1) * this.limit);
      this.service.onGetAnimes(this.offset(), this.limit);
    });
  }

  onSubmitForm(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    var genres = formData.getAll('genres').join(',').split(',');
    console.log(genres);
    var favorite = formData.get('favorite');
    console.log(favorite);
    var watched = formData.get('watched');
    console.log(watched);
    var rating = formData.get('rating');

    console.log(rating);
  }

  onSelectedGenre(data: { label: string; value: string }[]) {
    const currentParams = this.route.snapshot.params;
    this.router.navigate([
      '/auth/categories',
      { ...currentParams, genre: data.map((x) => x.value) },
    ]);
  }
  onSelectedFavoriteState(data: { label: string; value: string }) {
    const currentParams = this.route.snapshot.params;
    this.router.navigate([
      '/auth/categories',
      { ...currentParams, favorite: data.value },
    ]);
  }
  onSelectedWatchedState(data: { label: string; value: string }) {
    const currentParams = this.route.snapshot.params;
    this.router.navigate([
      '/auth/categories',
      { ...currentParams, watched: data.value },
    ]);
  }
  onSelectedRatingState(data: { label: string; value: string }) {
    const currentParams = this.route.snapshot.params;
    this.router.navigate([
      '/auth/categories',
      { ...currentParams, rating: data.value },
    ]);
  }
  onPageChange(page: number): void {
    const currentParams = this.route.snapshot.params;
    this.router.navigate([
      '/auth/categories',
      { ...currentParams, page: page },
    ]);
  }
  onToggleFavorite(event: { id: string; favoriteState: boolean }): void {
    this.service.onToggleFavorite(!event.favoriteState, event.id);
  }
}

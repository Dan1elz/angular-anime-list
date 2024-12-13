import { Component, effect, inject, signal } from '@angular/core';
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

  data = this.service.animesCategory;
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

  rating = Array.from({ length: 10 }, (_, i) => ({
    label: (i + 1).toString(),
    value: (i + 1).toString(),
  }));

  genres = toSignal<{ label: string; value: string }[] | undefined>(
    this.genresService
      .onGetGenres()
      .pipe(
        map((genres) =>
          genres.map((genre) => ({ label: genre.name, value: genre.id }))
        )
      )
  );
  currentPage = signal<number>(1);

  params: any = toSignal(
    this.route.paramMap.pipe(
      map((params) => ({
        page: Math.max(Number(params.get('page') ?? 1), 1),
        search: params.get('search') ?? undefined,
        genres: params.getAll('genres').join(',').split(',').filter(Boolean),
        favorite: params.get('favorite') ?? undefined,
        watched: params.get('watched') ?? undefined,
        rating: params.get('rating') ?? undefined,
      }))
    )
  );

  filterOptions = signal({
    search: '',
    genres: [] as string[],
    favorite: undefined as string | undefined,
    watched: undefined as string | undefined,
    rating: undefined as string | undefined,
  });

  selectedOptions = signal({
    search: '',
    genres: [] as string[],
    favorite: undefined as string | undefined,
    watched: undefined as string | undefined,
    rating: undefined as string | undefined,
  });

  constructor() {
    effect(() => {
      this.selectedOptions.set({
        search: this.params().search ?? undefined,
        genres: this.params().genres ?? [],
        favorite: this.params().favorite ?? undefined,
        watched: this.params().watched ?? undefined,
        rating: this.params().rating ?? undefined,
      });

      if (this.currentPage() !== this.params().page) {
        this.currentPage.set(this.params().page);
      }
      this.offset.set((this.currentPage()! - 1) * this.limit);
      this.service.onGetAnimesByCategory(
        this.offset(),
        this.limit,
        this.selectedOptions()
      );
    });
  }

  onSelectedGenre(data: { label: string; value: string }[]) {
    this.filterOptions.update((state) => ({
      ...state,
      genres: data.map((x) => x.value),
    }));
  }

  onSelectedRadioState(data: { label: string; value: string }, key: string) {
    this.filterOptions.update((state) => ({ ...state, [key]: data.value }));
  }

  onPageChange(page: number): void {
    this.updateRouteParams({ page: page });
  }

  onSubmitForm(event: Event) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const search = formData.get('search')?.toString().trim();

    if (search) {
      this.filterOptions.update((state) => ({ ...state, search }));
    }

    this.updateRouteParams({ ...this.filterOptions(), page: 1 });
  }

  onToggleFavorite(event: { id: string; favoriteState: boolean }): void {
    this.service.onToggleFavorite(!event.favoriteState, event.id);
  }

  private updateRouteParams(params: { [key: string]: any }) {
    const currentParams = this.route.snapshot.params;
    this.router.navigate(['/auth/categories', { ...currentParams, ...params }]);
  }
}

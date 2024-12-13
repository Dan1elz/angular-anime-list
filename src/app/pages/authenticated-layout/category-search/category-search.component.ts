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
import { GetCategoryDTO } from '../../../core/interfaces/anime-dto.interface';

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
    { label: 'Favorited', value: true },
    { label: 'Not Favorited', value: false },
  ];

  watched = [
    { label: 'Watched', value: true },
    { label: 'Not Watched', value: false },
  ];

  rating = Array.from({ length: 10 }, (_, i) => ({
    label: (i + 1).toString(),
    value: i + 1,
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
        search: params.get('search'),
        genres: params.getAll('genres').join(',').split(',').filter(Boolean),
        favorite: params.get('favorite'),
        watched: params.get('watched'),
        rating: params.get('rating'),
      }))
    )
  );

  filterOptions = signal<GetCategoryDTO>({});

  selectedOptions = signal<GetCategoryDTO>({});
  selectedOptionReadonly = this.selectedOptions.asReadonly();

  constructor() {
    effect(() => {
      this.selectedOptions.set({
        search: this.params().search ?? null,
        genres: this.params().genres ?? null,
        favorite:
          this.params().favorite === 'true'
            ? true
            : this.params().favorite === 'false'
            ? false
            : null,
        watched:
          this.params().watched === 'true'
            ? true
            : this.params().watched === 'false'
            ? false
            : null,
        rating: this.params().rating ? Number(this.params().rating) : null,
      });

      this.filterOptions.set({});

      console.log('selectedOptions', this.selectedOptions());
      console.log('favorite', this.selectedOptions().favorite);

      if (this.currentPage() !== this.params().page) {
        this.currentPage.set(this.params().page);
      }
      this.offset.set((this.currentPage()! - 1) * this.limit);
      this.service.onGetAnimesByCategory(
        this.offset(),
        this.limit,
        this.selectedOptionReadonly()
      );
    });
  }

  onSelectedGenre(data: { label: string; value: any }[]) {
    this.filterOptions.update((state) => ({
      ...state,
      genres: data.map((x) => x.value),
    }));
  }

  onSelectedRadioState(data: { label: string; value: any }, key: string) {
    console.log('valor', data);
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

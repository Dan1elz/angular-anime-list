import { Component, effect, inject, signal, Signal } from '@angular/core';
import { GridCardsComponent } from '../../../components/grid-cards/grid-cards.component';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';
import { FavoriteService } from '../../../core/services/favorite.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-favorite',
  imports: [GridCardsComponent, PaginatorComponent],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss',
})
export class FavoriteComponent {
  private readonly service = inject(FavoriteService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  data = this.service.animeFavorited;
  offset = signal<number>(0);
  limit = 14;

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
      this.offset.set((this.currentPage()! - 1) * this.limit);
      this.service.onGetAnimesFavorited(this.offset(), this.limit);
    });
  }

  onPageChange(page: number): void {
    this.router.navigate(['/auth/favorites', { page: page }]);
  }

  onRemoveFavorite(event: { id: string; favoriteState: boolean }): void {
    this.service.onRemoveFavorited(event.id);
  }
}

import { Component, effect, inject, signal } from '@angular/core';
import { GridCardsComponent } from '../../../components/grid-cards/grid-cards.component';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';
import { FavoriteService } from '../../../core/services/favorite.service';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [GridCardsComponent, PaginatorComponent],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss',
})
export class FavoriteComponent {
  private readonly service = inject(FavoriteService);
  data = this.service.animeFavorited;
  total = signal<number>(0);
  offset = signal<number>(0);
  limit = 21;

  constructor() {
    effect(() => {
      this.service.onGetAnimesFavorited(this.offset(), this.limit);
    });
    effect(
      () => {
        console.log('data', this.data());
        if (this.data() !== null) {
          this.total.set(this.data()!.total);
          console.log('total', this.total());
        }
      },
      { allowSignalWrites: true }
    );
  }

  onPageChange(event: number): void {
    this.offset.set((event - 1) * this.limit);
  }

  onRemoveFavorite(event: { id: string; favoriteState: boolean }): void {
    this.service.onRemoveFavorited(event.id);
  }
}

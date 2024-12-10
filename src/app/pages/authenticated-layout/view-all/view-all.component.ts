import { Component, effect, inject, signal } from '@angular/core';
import { AnimeService } from '../../../core/services/anime.service';
import {
  AnimesDTO,
  ResponseGetDTO,
} from '../../../core/interfaces/anime-dto.interface';
import { Observable } from 'rxjs';
import { GridCardsComponent } from '../../../components/grid-cards/grid-cards.component';
import { AsyncPipe } from '@angular/common';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';

@Component({
  selector: 'app-view-all',
  standalone: true,
  imports: [GridCardsComponent, PaginatorComponent],
  templateUrl: './view-all.component.html',
  styleUrl: './view-all.component.scss',
})
export class ViewAllComponent {
  private readonly service = inject(AnimeService);
  data = this.service.animes;
  total = signal<number>(0);
  offset = signal<number>(0);
  limit = 14;

  constructor() {
    effect(() => {
      this.service.onGetAnimes(this.offset(), this.limit);
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

  onToggleFavorite(event: { id: string; favoriteState: boolean }): void {
    this.service.onToggleFavorite(!event.favoriteState, event.id);
  }
}

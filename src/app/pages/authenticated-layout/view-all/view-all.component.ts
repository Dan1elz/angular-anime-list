import { Component, inject, signal } from '@angular/core';
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
  imports: [GridCardsComponent, AsyncPipe, PaginatorComponent],
  templateUrl: './view-all.component.html',
  styleUrl: './view-all.component.scss',
})
export class ViewAllComponent {
  private readonly service = inject(AnimeService);
  animes$!: Observable<ResponseGetDTO>;
  offset = signal(0);
  limit = 14;

  ngOnInit(): void {
    this.animes$ = this.service.onGetAnimes(this.offset(), this.limit);
  }

  onPageChange(event: number): void {
    this.offset.set((event - 1) * this.limit);
    console.log('offset', this.offset());

    this.animes$ = this.service.onGetAnimes(this.offset(), this.limit);
  }

  onRemoveFavorite(
    event: { id: string; favoriteState: boolean },
    animes: AnimesDTO[]
  ): void {
    this.service.onFavorite(!event.favoriteState, event.id).subscribe({
      next: () => {
        console.log('Favorite state updated');
        const index = animes.findIndex((anime) => anime.id === event.id);
        animes.splice(index, 1);
      },
    });
  }
}

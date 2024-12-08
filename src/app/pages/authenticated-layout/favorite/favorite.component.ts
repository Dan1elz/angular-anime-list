import { Component, inject, OnInit, signal } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AnimesDTO,
  ResponseGetDTO,
} from '../../../core/interfaces/anime-dto.interface';
import { AnimeService } from '../../../core/services/anime.service';
import { GridCardsComponent } from '../../../components/grid-cards/grid-cards.component';
import { AsyncPipe } from '@angular/common';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [GridCardsComponent, AsyncPipe, PaginatorComponent],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss',
})
export class FavoriteComponent implements OnInit {
  private readonly service = inject(AnimeService);
  animes$!: Observable<ResponseGetDTO>;
  offset = signal(0);
  limit = 21;

  ngOnInit(): void {
    this.animes$ = this.service.onGetAnimesFavorited(this.offset(), this.limit);
  }

  onPageChange(event: number): void {
    this.offset.set((event - 1) * this.limit);
    this.animes$ = this.service.onGetAnimesFavorited(this.offset(), this.limit);
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
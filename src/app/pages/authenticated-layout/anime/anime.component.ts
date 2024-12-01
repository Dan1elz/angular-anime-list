import { Component, inject, OnInit } from '@angular/core';
import { AnimeService } from '../../../core/services/anime.service';
import {
  AnimeDTO,
  SeasonsDTO,
} from '../../../core/interfaces/anime-dto.interface';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, NgClass } from '@angular/common';
import { FormatJSONtoStringPipe } from '../../../core/pipes/format-jsonto-string.pipe';

@Component({
  selector: 'app-anime',
  standalone: true,
  imports: [AsyncPipe, FormatJSONtoStringPipe, NgClass],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.scss',
})
export class AnimeComponent implements OnInit {
  private readonly service = inject(AnimeService);
  private readonly route = inject(ActivatedRoute);
  anime$!: Observable<AnimeDTO>;
  animeId: string = '';

  ngOnInit(): void {
    this.onGetAnimes();
  }

  onGetAnimes(): void {
    this.route.paramMap.subscribe((params) => {
      this.animeId = params.get('id')!;
      this.anime$ = this.service.onGetAnime(this.animeId);
    });
  }

  onGetStarIcons(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating / 2);
    const halfStars = rating % 2 >= 1 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    stars.push(...Array(fullStars).fill('bi-star-fill'));
    if (halfStars) stars.push('bi-star-half');
    stars.push(...Array(emptyStars).fill('bi-star'));

    return stars;
  }

  onQuantity(seasons: SeasonsDTO[]): number {
    return (
      seasons.reduce((acc, season) => acc + season.quantityEpisodes, 0) ?? 0
    );
  }
  onEdit(anime: AnimeDTO): void {
    console.log(anime);
  }
  onDelete(anime: AnimeDTO): void {
    console.log(anime);
  }
  onFavorite(anime: AnimeDTO): void {
    this.service.onFavorite(!anime.favoriteState, this.animeId).subscribe({
      next: () => {
        anime.favoriteState = !anime.favoriteState;
      },
    });
  }
  onAddSeason(anime: AnimeDTO): void {
    console.log(anime);
  }
}

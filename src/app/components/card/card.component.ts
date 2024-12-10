import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import {
  AnimesDTO,
  SeasonsDTO,
} from '../../core/interfaces/anime-dto.interface';
import { FormatJSONtoStringPipe } from '../../core/pipes/format-jsonto-string.pipe';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-card',
    imports: [NgClass, FormatJSONtoStringPipe, RouterModule],
    template: `
    <div class="card">
      @if (favoriteValidate()) {
      <button
        class="heart"
        type="button"
        (click)="favorite.emit()"
        [ngClass]="{ fill: anime().favoriteState }"
      >
        @if (anime().favoriteState) { <i class="bi bi-heart-fill"></i> } @else {
        <i class="bi bi-heart"></i> }
      </button>
      }
      <a [routerLink]="['/auth/anime', anime().id | formatJSONtoString]">
        <img [src]="anime().image" alt="anime image" />
        <div class="title">
          <p>{{ onTitle(anime().title | formatJSONtoString) }}</p>
        </div>
        <div class="text">
          <div class="between">
            <p class="left">Temporadas</p>
            <p class="right">{{ anime().seasons }}</p>
          </div>
          <div class="between">
            <p class="left">Idioma</p>
            <p class="right">{{ anime().lenguage | formatJSONtoString }}</p>
          </div>
        </div>
      </a>
      <p class="rating">
        @for(icon of onGetStarsIcons(anime().rating); track $index) {
        <i [class]="icon"></i>
        }
      </p>
    </div>
  `,
    styleUrl: './card.component.scss'
})
export class CardComponent {
  anime = input.required<AnimesDTO>();
  favoriteValidate = input<boolean>(true);
  favorite = output();

  onSeasons(seasons: SeasonsDTO[]): number {
    return seasons.length;
  }
  onTitle(title: string): string {
    return title.length > 30 ? title.substring(0, 30) + '...' : title;
  }

  onGetStarsIcons(star: number): string[] {
    var rating = Number(star);
    rating = rating / 2;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    const stars: string[] = [];

    for (let i = 0; i < fullStars; i++) stars.push('bi-star-fill');
    if (halfStar) stars.push('bi-star-half');

    for (let i = 0; i < emptyStars; i++) {
      stars.push('bi-star');
    }
    return stars;
  }
}

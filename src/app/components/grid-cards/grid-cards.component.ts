import { RouterLink, RouterModule } from '@angular/router';
import { Component, input, output } from '@angular/core';
import { AnimesDTO } from '../../core/interfaces/anime-dto.interface';
import { NgIf } from '@angular/common';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-grid-cards',
  standalone: true,
  imports: [NgIf, CardComponent, RouterModule],
  template: `
    <div class="grid-template">
      <div class="grid-header">
        <p>{{ header() }}</p>
        <a *ngIf="link()" [routerLink]="link()">View More</a>
      </div>

      <div class="grid-article">
        @for(anime of data(); track $index) {
        <app-card
          [anime]="anime"
          [favoriteValidate]="favoriteValidate()"
          (favorite)="onFavorite(anime.id, anime.favoriteState)"
        />
        }
      </div>
      <div class="line"><div></div></div>
    </div>
  `,
  styleUrl: './grid-cards.component.scss',
})
export class GridCardsComponent {
  header = input.required<string>();
  link = input<string>();
  data = input.required<AnimesDTO[]>();
  favoriteEmit = output<any>();
  favoriteValidate = input<boolean>(true);

  onFavorite(id: string, favoriteState: boolean): void {
    this.favoriteEmit.emit({ id, favoriteState });
  }
}

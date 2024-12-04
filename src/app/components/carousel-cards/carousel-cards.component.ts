import {
  Component,
  inject,
  input,
  OnInit,
  output,
  PLATFORM_ID,
} from '@angular/core';
import { AnimesDTO } from '../../core/interfaces/anime-dto.interface';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-carousel-cards',
  standalone: true,
  imports: [NgIf, CardComponent],
  templateUrl: './carousel-cards.component.html',
  styleUrl: './carousel-cards.component.scss',
})
export class CarouselCardsComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  header = input.required<string>();
  link = input<string>();
  data = input.required<AnimesDTO[]>();
  favoriteEmit = output<any>();

  screen = 0;
  count = 1;
  width = 0;
  pagination = 0;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getScreenSize();
    }
    this.pagination = (this.getCategoriesCount() * 180) / this.width;
    console.log(this.pagination);
  }
  onFavorite(id: string, favoriteState: boolean): void {
    this.favoriteEmit.emit({ id, favoriteState });
  }
  getCategoriesCount(): number {
    return this.data().length;
  }

  getScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.width = window.innerWidth - 100;
    }
  }

  onLeft() {
    console.log('foi');
    if (this.screen > 1) {
      this.screen -= this.width;
      this.count -= 1;
    } else {
      this.screen = this.width * Math.floor(this.pagination);
      this.count = Math.floor(this.pagination) + 1;
    }
  }

  onRight() {
    if (this.count < this.pagination) {
      this.screen += this.width;
      this.count += 1;
    } else {
      this.screen = 0;
      this.count = 1;
    }
  }
}

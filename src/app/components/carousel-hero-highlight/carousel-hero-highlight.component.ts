import { FormatJSONtoStringPipe } from './../../core/pipes/format-jsonto-string.pipe';
import { isPlatformBrowser } from '@angular/common';
import { AnimesDTO } from './../../core/interfaces/anime-dto.interface';
import { Component, inject, input, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-carousel-hero-highlight',
  standalone: true,
  imports: [FormatJSONtoStringPipe],
  template: `
    <div class="content">
      @for (anime of onSize(data()); track anime.id) {
      <div class="hero-item">
        <div class="hero-image">
          <img [src]="anime.image" alt="anime.title" />
        </div>
        <a href="/auth/anime/{{ anime.id | formatJSONtoString }}">
          <div class="hero-content">
            <div class="texts">
              <div class="hero-title">
                {{ anime.title | formatJSONtoString }}
              </div>
              <div class="hero-description">
                {{ onTextReplace(anime.description) | formatJSONtoString }}
              </div>
            </div>
          </div>
        </a>
      </div>
      }
    </div>
  `,
  styleUrl: './carousel-hero-highlight.component.scss',
})
export class CarouselHeroHighlightComponent {
  private platformId = inject(PLATFORM_ID);
  data = input.required<AnimesDTO[]>();

  onTextReplace(textReplace: string): string {
    if (textReplace.length > 150) return textReplace.substring(0, 150) + '...';
    return textReplace;
  }

  onSize(animes: AnimesDTO[]): AnimesDTO[] {
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth > 1080) return animes.slice(0, 7);
      else if (window.innerWidth > 768) return animes.slice(0, 5);
      else if (window.innerWidth > 480) return animes.slice(0, 3);
      else return animes.slice(0, 1);
    }
    return animes.slice(0, 3);
  }
}

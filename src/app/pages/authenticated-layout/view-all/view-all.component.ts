import { GridCardsComponent } from '../../../components/grid-cards/grid-cards.component';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';
import { Component, effect, inject, Signal, signal } from '@angular/core';
import { AnimeService } from '../../../core/services/anime.service';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-view-all',
  imports: [GridCardsComponent, PaginatorComponent],
  templateUrl: './view-all.component.html',
  styleUrl: './view-all.component.scss',
})
export class ViewAllComponent {
  private readonly service = inject(AnimeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  data = this.service.animes;
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
      this.service.onGetAnimes(this.offset(), this.limit);
    });
  }

  onPageChange(page: number): void {
    this.router.navigate(['/auth/view-all', { page: page }]);
  }

  onToggleFavorite(event: { id: string; favoriteState: boolean }): void {
    this.service.onToggleFavorite(!event.favoriteState, event.id);
  }
}

import { UserService } from './../../../core/services/user.service';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AnimeService } from '../../../core/services/anime.service';
import {
  AddSeasonDTO,
  AnimeDTO,
  SeasonsDTO,
} from '../../../core/interfaces/anime-dto.interface';
import { Observable, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { FormatJSONtoStringPipe } from '../../../core/pipes/format-jsonto-string.pipe';
import { CommentsService } from '../../../core/services/comments.service';
import { UserDTO } from '../../../core/interfaces/user-dto.interface';
import { CommentComponent } from './components/comment/comment.component';

@Component({
  selector: 'app-anime',
  standalone: true,
  imports: [AsyncPipe, FormatJSONtoStringPipe, NgClass, CommentComponent],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.scss',
})
export class AnimeComponent implements OnInit {
  private readonly service = inject(AnimeService);
  private readonly commentService = inject(CommentsService);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);

  anime$!: Observable<AnimeDTO>;
  comments$!: Observable<any[]>;
  animeId: string = '';
  addSeason: boolean = false;
  user: UserDTO = {} as UserDTO;

  @ViewChild('modal') modal!: ElementRef;

  ngOnInit(): void {
    this.onGetAnimes();
    this.userService.onGetUser().subscribe({
      next: (user) => {
        this.user = user;
      },
    });
  }

  onGetAnimes(): void {
    this.route.paramMap.subscribe((params) => {
      this.animeId = params.get('id')!;
      this.anime$ = this.service.onGetAnime(this.animeId);
      this.comments$ = this.commentService.onGetComments(this.animeId);
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
  onDelete(): void {
    this.service.onDelete(this.animeId).subscribe();
  }

  onOpenModal() {
    this.modal.nativeElement.showModal();
    this.modal.nativeElement.classList.add('active');
  }
  onCloseModal() {
    this.modal.nativeElement.classList.remove('active');
    this.modal.nativeElement.close();
  }

  onFavorite(anime: AnimeDTO): void {
    this.service.onFavorite(!anime.favoriteState, this.animeId).subscribe({
      next: () => {
        anime.favoriteState = !anime.favoriteState;
      },
    });
  }
  onAddSeason(event: Event, anime: AnimeDTO): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const seasonName = formData.get('seasonName');
    const quantityEpisodes = formData.get('quantityEpisodes');

    var season: AddSeasonDTO = {
      animeId: this.animeId,
      seasonName: seasonName!.toString(),
      quantityEpisodes: Number(quantityEpisodes as unknown),
    };

    this.service.onAddSeason(season).subscribe({
      next: () => {
        window.location.reload();
      },
    });
  }

  onAddComment(event: Event, comments: any): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    let comment = formData.get('comment');

    this.commentService
      .onPostComment({
        animeId: this.animeId,
        commentText: comment!.toString(),
      })
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.commentService
            .onGetComment(res.data)
            .pipe(take(1))
            .subscribe({
              next: (response) => {
                comments.push(response);
                form.reset();
              },
            });
        },
      });
  }
  onEditComment(event: Event, comment: any, comments: any[]): void {
    var data = { commentText: event.toString() };
    this.commentService.onPutComment(data, comment.id).subscribe({
      next: (res) => {},
      error: (err) => {
        console.error('Failed to edit comment:', err);
      },
    });
  }
  onDeleteComment(comment: any, comments: any[]): void {
    this.commentService.onDeleteComment(comment.id).subscribe({
      next: () => {
        const index = comments.findIndex((c: any) => c.id === comment.id);
        if (index !== -1) {
          console.log('Comment deleted successfully:', comment);
          return comments.splice(index, 1);
        } else {
          return console.warn('Comment not found in the list:', comment);
        }
      },
      error: (err) => {
        console.error('Failed to delete comment:', err);
      },
    });
  }
}

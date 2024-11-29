import { AsyncPipe, JsonPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { GenreDTO } from '../../../core/interfaces/anime-dto.interface';
import { AnimeService } from '../../../core/services/anime.service';

@Component({
  selector: 'app-add-anime',
  standalone: true,
  imports: [FormsModule, AsyncPipe],
  templateUrl: './add-anime.component.html',
  styleUrl: './add-anime.component.scss',
})
export class AddAnimeComponent implements OnInit {
  private readonly service = inject(AnimeService);
  anime = {
    title: 'Tensei Shitara Slime Datta Ken',
    alternativeTitle: 'Anime do Slime',
    year: 2021,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500',
    description: 'OLHAAAAAA O SLIME',
    lenguage: '',
    rating: 8,
    favoriteState: false,
    watchedState: false,
    genres: [] as string[],
    imageFile: null as File | null,
  };

  genres$!: Observable<GenreDTO[]>;

  ngOnInit(): void {
    this.genres$ = this.service.onGetGenres();
  }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0] as File;

      this.anime.imageFile = file ?? null;
      const reader = new FileReader();
      reader.onload = () => {
        this.anime.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.onRemoveFile();
    }
  }

  onWatchedStateChange(event: Event): void {
    const check = event.target as HTMLInputElement;
    if (check.checked) {
      this.anime.watchedState = true;
    } else {
      this.anime.watchedState = false;
    }
  }
  onGenreChange(event: Event, genreId: string): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.anime.genres.push(genreId);
    } else {
      this.anime.genres = this.anime.genres.filter((id) => id !== genreId);
    }
  }

  isSelected(genreId: string): boolean {
    return this.anime.genres.includes(genreId);
  }

  onRemoveFile() {
    this.anime.imageFile = null;
    this.anime.image =
      'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500';
  }

  onOpenFile() {
    var input = document.querySelector<HTMLElement>('input[type="file"]');
    input!.click();
  }

  onSubmit(Event: Event) {
    Event.preventDefault();
    if (!this.anime.imageFile) {
      alert('Por favor, selecione uma imagem.');
      return;
    }

    if (this.anime.genres.length === 0) {
      alert('Por favor, selecione um gênero.');
      return;
    }
    console.log(this.anime.imageFile);

    const formData = new FormData();
    formData.append('Title', JSON.stringify(this.anime.title));
    formData.append(
      'AlternativeTitle',
      JSON.stringify(this.anime.alternativeTitle)
    );
    formData.append('Year', JSON.stringify(this.anime.year));

    formData.append('Image', this.anime.imageFile as File);

    formData.append('Description', JSON.stringify(this.anime.description));
    formData.append('Lenguage', JSON.stringify(this.anime.lenguage));
    formData.append('Rating', JSON.stringify(this.anime.rating));
    formData.append('FavoriteState', JSON.stringify(this.anime.favoriteState));
    formData.append('WatchedState', JSON.stringify(this.anime.watchedState));

    this.anime.genres.forEach((genre): void => {
      formData.append('Genres', genre);
    });

    this.service.onPostAnime(formData).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
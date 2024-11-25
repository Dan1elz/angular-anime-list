import { AsyncPipe, JsonPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { GenreDTO } from '../../../core/interfaces/anime-dto.interface';
import { AnimeService } from '../../../core/services/anime.service';

@Component({
  selector: 'app-add-anime',
  standalone: true,
  imports: [FormsModule, AsyncPipe, JsonPipe],
  templateUrl: './add-anime.component.html',
  styleUrl: './add-anime.component.scss',
})
export class AddAnimeComponent implements OnInit {
  private readonly service = inject(AnimeService);
  anime = {
    title: '',
    alternativeTitle: '',
    year: 0,
    image: '',
    description: '',
    lenguage: '',
    rating: 0,
    favoriteState: false,
    watchedState: false,
    genres: [] as string[],
  };

  genres$!: Observable<GenreDTO[]>;

  ngOnInit(): void {
    this.genres$ = this.service.onGetGenres();
  }

  onGenreChange(event: Event, genreId: string): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      // Adiciona o gênero ao array de selecionados
      this.anime.genres.push(genreId);
    } else {
      // Remove o gênero do array de selecionados
      this.anime.genres = this.anime.genres.filter((id) => id !== genreId);
    }
  }

  // Método para verificar se um gênero está selecionado
  isSelected(genreId: string): boolean {
    return this.anime.genres.includes(genreId);
  }

  onSubmit(Event: Event) {
    Event.preventDefault();
    console.log(this.anime);
  }
}

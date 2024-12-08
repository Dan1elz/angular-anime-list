import { Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  currentPage = signal<number>(1); //page
  maximumPerPage = input.required<number>(); //limit
  totalItems = input.required<number>(); //total
  currentPageEvent = output<number>();

  constructor() {
    effect(() => {
      console.log('Page EFFECT', this.currentPage());
    });
  }
  totalPages(): number {
    return Math.ceil(this.totalItems() / this.maximumPerPage());
  }
  nextPage(): void {
    this.currentPage.update((page) => page + 1);
    this.currentPageEvent.emit(this.currentPage());
  }
  previousPage(): void {
    this.currentPage.update((page) => page - 1);
    this.currentPageEvent.emit(this.currentPage());
  }
  selectPage(page: number): void {
    this.currentPage.set(page);
    this.currentPageEvent.emit(this.currentPage());
  }
  createRange(length: number): number[] {
    return Array.from({ length }, (_, i) => i + 1);
  }
}

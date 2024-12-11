import { Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [],
  template: `
    @if(totalPages() > 1) {
    <div class="paginator">
      <button (click)="previousPage()" [disabled]="currentPage() === 1">
        <i class="bi bi-arrow-left"></i>
      </button>

      @for (page of createRange(totalPages()); track $index) {
      <button [disabled]="page === currentPage()" (click)="selectPage(page)">
        {{ page }}
      </button>
      }

      <button (click)="nextPage()" [disabled]="currentPage() === totalPages()">
        <i class="bi bi-arrow-right"></i>
      </button>
    </div>
    }
  `,
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  currentPage = input.required<number>(); //page
  maximumPerPage = input.required<number>(); //limit
  totalItems = input.required<number>(); //total
  currentPageEvent = output<number>();

  totalPages(): number {
    return Math.ceil(this.totalItems() / this.maximumPerPage());
  }
  nextPage(): void {
    this.currentPageEvent.emit(this.currentPage() + 1);
  }
  previousPage(): void {
    this.currentPageEvent.emit(this.currentPage() - 1);
  }
  selectPage(page: number): void {
    this.currentPageEvent.emit(page);
  }
  createRange(length: number): number[] {
    return Array.from({ length }, (_, i) => i + 1);
  }
}

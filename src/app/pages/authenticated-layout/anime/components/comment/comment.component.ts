import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  input,
  output,
  ViewChild,
  AfterViewInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent implements AfterViewInit {
  comment = input.required<any>();
  user = input.required<any>();
  delete = output<any>();
  edit = output<any>();
  message = '';

  disabled = signal<boolean>(true);

  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.adjustHeight();
    });
  }

  private adjustHeight(): void {
    const textareaElement = this.textarea.nativeElement;
    textareaElement.style.height = 'auto';
    textareaElement.style.height = `${textareaElement.scrollHeight}px`;
  }
  onEdit(event: Event): void {
    this.disabled.set(!this.disabled());
  }
  onDelete(event: Event): void {
    this.delete.emit(event);
  }
  onSubmid(event: Event): void {
    event.preventDefault();

    console.log('submit', this.disabled());
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    let comment = formData.get('comment');
    this.disabled.set(true);
    this.edit.emit(comment);
  }
  onSetHeightTextArea(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}

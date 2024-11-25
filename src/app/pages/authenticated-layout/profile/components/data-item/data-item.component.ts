import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  input,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-item',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './data-item.component.html',
  styleUrl: './data-item.component.scss',
})
export class DataItemComponent implements OnInit {
  title = input<string>();
  content = input<string>();
  icon = input<string>();
  return = output();

  showModal = true;
  value: string = '';
  iconController = false;

  @ViewChild('modal') modal!: ElementRef;

  ngOnInit(): void {
    this.value = this.content()!;
    this.onVerifySend(this.value);
  }

  onOpenModal() {
    this.modal.nativeElement.showModal();
    this.modal.nativeElement.classList.add('active');
  }
  onCloseModal() {
    this.modal.nativeElement.classList.remove('active');
    this.modal.nativeElement.close();
  }
  onVerifySend(data: string) {
    if (data.length > 0) {
      this.iconController = true;
    } else {
      this.iconController = false;
    }
  }
  onSubmit(data: any) {
    if (this.value.length > 0) {
      this.onCloseModal();
      return this.return.emit(data);
    }
  }
}

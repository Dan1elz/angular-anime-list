import {
  Component,
  ElementRef,
  input,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-input-radio-selected',
  imports: [],
  templateUrl: './input-radio-selected.component.html',
  styleUrl: './input-radio-selected.component.scss',
})
export class InputRadioSelectedComponent implements OnInit {
  title = input<string>();
  options = input<{ label: string; value: string }[]>();
  current = input<any | undefined>();
  output = output<{ label: string; value: string }>();

  @ViewChild('event') event!: ElementRef;
  value = '';

  ngOnInit() {
    if (this.current() !== undefined) {
      const currentOption = this.options()!.find(
        (option) => option.value === this.current()
      );
      if (currentOption) {
        this.value = currentOption.label;
      } else {
        this.value = this.title()!.toString();
      }
    } else {
      this.value = this.title()!.toString();
    }
  }

  onChange(data: { label: string; value: string }) {
    this.value = data.label;
    this.event.nativeElement.click();
    this.output.emit(data);
  }
  onClose() {
    this.event.nativeElement.click();
  }
}

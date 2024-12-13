import {
  Component,
  effect,
  ElementRef,
  input,
  output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-input-radio-selected',
  imports: [],
  templateUrl: './input-radio-selected.component.html',
  styleUrl: './input-radio-selected.component.scss',
})
export class InputRadioSelectedComponent {
  title = input<string>();
  options = input<{ label: string; value: any }[]>();
  current = input<any | undefined>();
  output = output<{ label: string; value: any }>();

  @ViewChild('event') event!: ElementRef;
  value = '';

  constructor() {
    effect(() => {
      const currentOption = this.options()?.find(
        (option) => option.value === this.current()
      );
      this.value = currentOption
        ? currentOption.label
        : this.title()?.toString() || '';
    });
  }

  onChange(data: { label: string; value: any }) {
    this.value = data.label;
    this.event.nativeElement.click();
    this.output.emit(data);
  }

  onClose() {
    this.event.nativeElement.click();
  }
}

import {
  Component,
  effect,
  ElementRef,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-input-checkbox-select',
  imports: [],
  templateUrl: './input-checkbox-select.component.html',
  styleUrl: './input-checkbox-select.component.scss',
})
export class InputCheckboxSelectComponent {
  title = input<string>();
  options = input<{ label: string; value: string }[]>();
  current = input<any | undefined>();
  output = output<{ label: string; value: string }[]>();
  list = signal<{ label: string; value: string }[]>([]);

  @ViewChild('event') event!: ElementRef;
  value = '';

  constructor() {
    effect(() => {
      const currentOption = this.options()!.filter((option) =>
        this.current().includes(option.value)
      );
      this.value =
        currentOption.length > 0
          ? currentOption.map((option) => option.label).join(', ')
          : this.title()?.toString() || '';
    });
  }

  onChange(data: { label: string; value: string }) {
    if (this.list().find((x) => x.value === data.value)) {
      this.list.update((prev) => prev.filter((x) => x.value !== data.value));
    } else {
      this.list.update((prev) => [...prev, data]);
    }
    if (this.list().length === 0) {
      this.value = this.title()!.toString();
    } else {
      this.value = this.list()
        .map((x) => x.label)
        .join(', ');
    }
    this.output.emit(this.list());
  }
  onClose() {
    this.event.nativeElement.click();
  }
}

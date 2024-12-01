import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatJSONtoString',
  standalone: true,
})
export class FormatJSONtoStringPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    let cleaned = value.replace(/^"|"$/g, '');
    cleaned = cleaned.replace(/\\\"/g, '"');

    return cleaned;
  }
}

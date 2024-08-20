import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber',
  standalone: true
})
export class PhoneNumberPipe implements PipeTransform {
  transform(value: string): string {
    if (value.startsWith('+') && value.length === 14 && /^\+\d{12}$/.test(value)) {
      const countryCode = value.substring(0, 3);
      const part1 = value.substring(3, 5);
      const part2 = value.substring(5, 9);
      const part3 = value.substring(9, 13);

      return `${countryCode} ${part1} ${part2} ${part3}`;
    } else if (value.length === 11 && /^\d+$/.test(value)) {
      const country = value.substring(0, 1);
      const area = value.substring(1, 4);
      const centralOffice = value.substring(4, 7);
      const lineNumber = value.substring(7, 11);

      return `${country} (${area}) ${centralOffice}-${lineNumber}`;
    } else {
      console.warn(value);
      return value;
    }
  }
}

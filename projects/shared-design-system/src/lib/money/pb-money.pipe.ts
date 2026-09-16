import { Pipe, PipeTransform } from '@angular/core';

/** Formats minor units (cents) as an AUD amount, e.g. 123456 -> "$1,234.56". */
@Pipe({ name: 'pbMoney' })
export class PbMoneyPipe implements PipeTransform {
  transform(minorUnits: number | null | undefined, currency = 'AUD'): string {
    if (minorUnits === null || minorUnits === undefined) {
      return '';
    }
    const formatter = new Intl.NumberFormat('en-AU', { style: 'currency', currency });
    return formatter.format(minorUnits / 100);
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { UtilityMethod } from './utility-method';

@Pipe({ name: 'currencyFormat' })
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (value || value == 0) {
      return UtilityMethod.formatCurrencyExtended(value);
    }
    return value + '';
  }
}

@Pipe({ name: 'stringToCurrencyFormat' })
export class StringCurrencyFormatPipe implements PipeTransform {
  transform(value: string): any {
    let intValue = Number(value);
    if (!isNaN(Number(intValue))) {
      return UtilityMethod.formatCurrencyExtended(intValue);
    }
    return value;
  }
}

@Pipe({ name: 'stringToCurrencyFormatDecimal' })
export class StringCurrencyFormatPipeDecimal implements PipeTransform {
  transform(value: string): any {
    let intValue = Number(value);
    if (!isNaN(Number(intValue))) {
      return UtilityMethod.formatCurrencyExtendedDecimal(intValue);
    }
    return value;
  }
}

//todo later if required
@Pipe({ name: 'datetimeFormat' })
export class DateTimeFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value)
      return;
    let dateconversion = new Date(value);
    //let dateconversion = Globalize.dateParser(value);
    if (dateconversion) {
      return UtilityMethod.formatDateExtended(dateconversion, "dd/MM/yyyy hh:mm:ss");
    }
    return value;

  }
}




@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(value: string) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}


@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(value: any, words: boolean) {

    if (value) {
      if (words) {
        return value.replace(/\b\w/g, (first: any) => first.toLocaleUpperCase());
      } else {
        return value.charAt(0).toUpperCase() + value.slice(1);
      }
    }

    return value;
  }
}

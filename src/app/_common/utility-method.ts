
import { environment } from 'src/environments/environment.prod';
import { formatCurrency, formatDate } from '@angular/common';
import { SortMeta } from 'primengdevng8/api';

export class UtilityMethod {

  static get password8CharMsg(): string {
    return 'Password should be minimum of 8 characters and  should contain 1 uppercase letter and 1 number';
  }
  static get password14CharMsg(): string {
    return 'Password should be minimum of 14 characters and should contain 1 uppercase letter , 1 number and 1 special letter';
  }
  static formatCurrencyExtended(value: number): string {
    return formatCurrency(value, 'en-GB', "£");
  }

  static formatCurrencyExtendedDecimal(value: number): string {
    return formatCurrency(value, 'en-GB', "£", null, '1.3-3');
  }

  static formatDateExtended(value: any, formatString?: string): string {
    formatString = formatString ? formatString : "dd/MM/yyyy";
    return formatDate(value, formatString, 'en-GB');
  }
  public static IfNull(value: any, returnvalue: any = '') {
    return (typeof (value) == "undefined" || value === null || value == "null") ? returnvalue : value;
  }

  public static ToDateDescriptionMMMYYYY(value: Date) {
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    let localDate = new Date(value);
    let currentMonth = monthNames[localDate.getMonth()];
    let year = localDate.getFullYear();
    return currentMonth + ' ' + year;
  }
  public static getMonthYearFormatter(value: Date, monthOption: string, yearOption: string) {
    //options are 'long' uses the full name of the month, 'short' for the short name, and 'narrow' for a more minimal version
    //Year Options are "numeric" (e.g., 2012) "2-digit" (e.g., 12)
    const localDate = new Date(value);
    const currentMonth = localDate.toLocaleString('en-GB', { month: monthOption });
    const year = localDate.toLocaleString('en-GB', { year: yearOption });
    return currentMonth + ' ' + year;
  }

  public static getShortMonthYearFormatter(value: Date) {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    let localDate = new Date(value);
    let currentMonth = monthNames[localDate.getMonth()];
    let year = localDate.getFullYear().toString().substring(2);
    return currentMonth + ' ' + year;
  }

  public static lightenDarkenColor(col: any, amt: number) {
    let usePound = false;
    if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
    }
    let num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) {
      r = 255;
    } else if (r < 0) {
      r = 0;
    }
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) {
      b = 255;
    } else if (b < 0) {
      b = 0;
    }
    let g = (num & 0x0000FF) + amt;
    if (g > 255) {
      g = 255;
    } else if (g < 0) {
      g = 0;
    }
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  }
}


export class String {
  public static Empty: string = "";

  public static isNullOrWhiteSpace(value: string): boolean {
    try {
      if (value == null || value == 'undefined')
        return false;

      return value.replace(/\s/g, '').length < 1;
    }
    catch (e) {
      return false;
    }
  }

  public static Format(value: string, args: string[]): string {
    try {
      return value.replace(/{(\d+(:.*)?)}/g, function (match, i) {
        var s = match.split(':');
        if (s.length > 1) {
          i = i[0];
          match = s[1].replace('}', '');
        }

        var arg = String.formatPattern(match, args[i]);
        return typeof arg != 'undefined' && arg != null ? arg : String.Empty;
      });
    }
    catch (e) {
      return String.Empty;
    }
  }

  public static getUrlParameter(url: string, param: string) {
    param = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + param + '=([^&#]*)');
    var results = regex.exec(url);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  private static formatPattern(match: any, arg: any): string {
    switch (match) {
      case 'L':
        arg = arg.toLowerCase();
        break;
      case 'U':
        arg = arg.toUpperCase();
        break;
      default:
        break;
    }

    return arg;
  }

  public static getRootUrl(url: string): string {
    return url.split("/:")[0].split("?")[0];
  }
}

export function isPresent(obj: any): boolean {
  return obj !== undefined && obj !== null;
}

export function isDate(obj: any): boolean {
  return !/Invalid|NaN/.test(new Date(obj).toString());
}


export function onStringCustomNumberSort(event: SortMeta): any {
  let comparer = function (a: any, b: any): number {
    let firstValue = isNaN(a[event.field]) ? 0 : Number(a[event.field]);
    let secondValue = isNaN(b[event.field]) ? 0 : Number(b[event.field]);

    let result: number = -1;

    if (firstValue == 0) {
      return 1;
    }
    if (secondValue == 0) {
      return -1;
    }
    if (firstValue > secondValue) result = 1;
    return result * event.order;

  };
  return comparer;
}

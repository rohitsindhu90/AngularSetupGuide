import { DateTimeFormatPipe, CurrencyFormatPipe, SafeHtmlPipe, StringCurrencyFormatPipe, CapitalizePipe, StringCurrencyFormatPipeDecimal } from '../_common/custom.pipe';
import { NgModule } from '@angular/core';


@NgModule({
  declarations: [
    DateTimeFormatPipe,
    CurrencyFormatPipe,
    SafeHtmlPipe,
    StringCurrencyFormatPipe,
    CapitalizePipe,
    StringCurrencyFormatPipeDecimal,
  ],

  exports: [
    DateTimeFormatPipe,
    CurrencyFormatPipe,
    SafeHtmlPipe,
    StringCurrencyFormatPipe,
    CapitalizePipe,
    StringCurrencyFormatPipeDecimal,
    //CommonModule
  ]
})
export class PipeModule { }

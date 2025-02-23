import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyFormatterDirective } from './currency-formatter';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CurrencyFormatterDirective],
  exports: [CurrencyFormatterDirective]
})
export class CurrencyFormatterModule {
}

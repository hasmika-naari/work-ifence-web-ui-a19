import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCurrencyFormatter]'
})
export class CurrencyFormatterDirective {

  @Input() decimalPlaces: number = 2;

  constructor(private el: ElementRef, private ngControl: NgControl) {}

  @HostListener('blur') onBlur() {
    this.formatCurrency();
  }

  @HostListener('focus') onFocus() {
    this.el.nativeElement.value = this.parseCurrency(this.el.nativeElement.value);
  }

  private formatCurrency() {
    const value = this.parseCurrency(this.el.nativeElement.value);
    if (value !== null) {
      this.ngControl.control?.setValue(value.toFixed(this.decimalPlaces).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    }
  }

  private parseCurrency(value: string): number | null {
    const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
    return isNaN(numericValue) ? null : numericValue;
  }
}
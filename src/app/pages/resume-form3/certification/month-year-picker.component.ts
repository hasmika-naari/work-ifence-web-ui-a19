import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'month-year-picker',
  template: `
    <mat-form-field appearance="fill" style="width: 100%;">
      <input matInput [matDatepicker]="picker" [placeholder]="placeholder" [value]="displayValue" (dateChange)="onDateChange($event)" readonly>
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker startView="multi-year" (monthSelected)="chosenMonthHandler($event, picker)" (yearSelected)="chosenYearHandler($event)" panelClass="month-picker" [startAt]="startAt" [touchUi]="true"></mat-datepicker>
    </mat-form-field>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonthYearPickerComponent),
      multi: true
    }
  ]
})
export class MonthYearPickerComponent implements ControlValueAccessor {
  @Input() placeholder: string = 'Select Month and Year';
  @Input() startAt: Date | null = null;
  value: { month: number, year: number } | null = null;
  displayValue: string = '';
  private onChange: any = () => {};
  private onTouched: any = () => {};

  writeValue(obj: any): void {
    this.value = obj;
    this.displayValue = this.value ? `${this.getMonthName(this.value.month)} ${this.value.year}` : '';
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  onDateChange(event: any) {}

  chosenYearHandler(normalizedYear: Date) {
    if (!this.value) this.value = { month: 1, year: normalizedYear.getFullYear() };
    else this.value.year = normalizedYear.getFullYear();
    this.displayValue = this.value ? `${this.getMonthName(this.value.month)} ${this.value.year}` : '';
    this.onChange(this.value);
  }
  chosenMonthHandler(normalizedMonth: Date, datepicker: any) {
    if (!this.value) this.value = { month: normalizedMonth.getMonth() + 1, year: normalizedMonth.getFullYear() };
    else this.value.month = normalizedMonth.getMonth() + 1;
    this.displayValue = this.value ? `${this.getMonthName(this.value.month)} ${this.value.year}` : '';
    this.onChange(this.value);
    datepicker.close();
  }
  getMonthName(month: number) {
    return [
      '', 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ][month];
  }
}

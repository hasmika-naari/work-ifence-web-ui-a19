import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeCustomizerService {

    private isDarkTheme: boolean;

    constructor() {
        this.isDarkTheme = JSON.parse(localStorage.getItem('isDarkTheme')!);
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        localStorage.setItem('isDarkTheme', JSON.stringify(this.isDarkTheme));
    }

    isDark() {
        return this.isDarkTheme;
    }

    private isToggled = new BehaviorSubject<boolean>(false);
    get isToggled$() {
        return this.isToggled.asObservable();
    }

}
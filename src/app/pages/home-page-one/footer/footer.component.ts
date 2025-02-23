import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxScrollTopModule } from 'ngx-scrolltop';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [NgxScrollTopModule, RouterLink],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {}

}
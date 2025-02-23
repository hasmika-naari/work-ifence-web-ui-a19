import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-homeone-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './homeone-about.component.html',
  styleUrls: ['./homeone-about.component.scss']
})
export class HomeoneAboutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

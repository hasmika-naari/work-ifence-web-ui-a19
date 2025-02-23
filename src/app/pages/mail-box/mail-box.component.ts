import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'mail-box',
  standalone: true,
  imports: [CommonModule ,RouterOutlet, MatCardModule ],
  templateUrl: './mail-box.component.html',
  styleUrls: ['./mail-box.component.scss']
})
export class MailBoxComponent implements OnInit, AfterViewInit {

  private static isInitialLoad = true;
 
  /**
   * Needed for the Layout
   */
  private _gap = 16;
  gap = `${this._gap}px`;

  private platformId: object =  inject(PLATFORM_ID);
  isBrowser = false;

  constructor(
    // private dashboardService: DashboardService,
              private router: Router) {
    // /**
    //  * Edge wrong drawing fix
    //  * Navigate anywhere and on Promise right back
    //  */
    // if (/Edge/.test(navigator.userAgent)) {
    //   if (DashboardComponent.isInitialLoad) {
    //     this.router.navigate(['/apps/chat']).then(() => {
    //       this.router.navigate(['/']);
    //     });

    //     DashboardComponent.isInitialLoad = false;
    //   }
    // }

  }

  col(colAmount: number) {
    return `1 1 calc(${100 / colAmount}% - ${this._gap - (this._gap / colAmount)}px)`;
  }

  /**
   * Everything implemented here is purely for Demo-Demonstration and can be removed and replaced with your implementation
   */
  ngOnInit() {
    if(isPlatformBrowser(this.platformId)){
      this.isBrowser = true;
      setTimeout(() => {
      //this.sidenavService.setCollapsed(true);
      }, 50);

      console.log('ITS Browser Running');
    }else{
      console.log('ITS Server Running');
    }
   
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
        // //this.sidenavService.setCollapsed(true);
        }, 100);
}

}

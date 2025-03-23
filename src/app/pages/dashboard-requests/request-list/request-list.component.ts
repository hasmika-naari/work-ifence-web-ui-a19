import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Signal, SimpleChanges, effect, inject } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Account } from 'src/app/services/profile.model';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { Subscription } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../resume-form3/confirm-dialog/confirm-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { ServiceRequestItem } from 'src/app/services/store/app-store.model';
import { AppStoreService } from 'src/app/services/store/app-store.service';

@Component({
    selector: 'request-list',
    templateUrl: './request-list.component.html',
    styleUrl : './request-list.component.scss',
    standalone: true,
    imports: [
        CommonModule, 
        RouterLink, 
        RouterOutlet, 
        RouterModule,
        FormsModule,
        DataViewModule,
        PickListModule,
        OrderListModule,
        InputTextModule,
        DropdownModule,
        RatingModule,
        ButtonModule,
        MenuModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        CheckboxModule,
        MatListModule,
        MatProgressBarModule,
        ConfirmDialogComponent,
        MatCheckbox,
        MatExpansionModule,
        MatTableModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatCardModule
    ]
})
export class RequestsListComponent implements OnInit, OnChanges, OnDestroy {

 
    private userStore: UserStoreService = inject(UserStoreService);
    private appStore: AppStoreService = inject(AppStoreService);
    
    @Input() isActionInProgress: boolean = true; 
    @Output() childEvent = new EventEmitter<boolean>();
    userAccount: Signal<Account> = this.userStore.getUserAccount();
    filteredServiceRequests: Signal<ServiceRequestItem[]> = this.appStore.getFilteredServiceRequests();

    subs: Array<Subscription> = [];
    imageSrc: string | null = null;

    displayedColumns: string[] = ['dateReceived', 'user', 'email', 'phone', 'requestType', 'status', 'actions'];
  

    constructor(
        public templateService : TemplatesService,
        public dialog: MatDialog,
    ){

    }

    ngOnInit() {
    
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
    }

    deleteRequest(id: number) {
        alert(`Delete request with ID: ${id}`);
    }

    editRequest(id: number) {
        alert(`Edit request with ID: ${id}`);
    }  

}

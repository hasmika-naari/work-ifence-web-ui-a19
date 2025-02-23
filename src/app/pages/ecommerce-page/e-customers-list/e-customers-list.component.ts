import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-e-customers-list',
    imports: [MatCardModule, MatButtonModule, MatMenuModule, MatPaginatorModule, MatTableModule],
    templateUrl: './e-customers-list.component.html',
    styleUrl: './e-customers-list.component.scss'
})
export class ECustomersListComponent {

    displayedColumns: string[] = ['user', 'email', 'walletBalance', 'totalOrders', 'activeStatus', 'location', 'action'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

}

export interface PeriodicElement {
    user: any;
    email: string;
    walletBalance: string;
    totalOrders: string;
    activeStatus: string;
    location: string;
    action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        user: {
            img: 'images/users/user1.jpg',
            name: 'Sarah Rodriguez',
            number: '+03 4567 8900'
        },
        email: 'rodriguez@trinta.com',
        walletBalance: '$100.5k',
        totalOrders: '1,250',
        activeStatus: '1 hrs ago',
        location: 'Ethereal Blossom, Grove',
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user2.jpg',
            name: 'Marcus Davis',
            number: '+03 4567 8900'
        },
        email: 'davis@trinta.com',
        walletBalance: '$75k',
        totalOrders: '308',
        activeStatus: '10 hrs ago',
        location: 'Enchanted Silver Moon, Valley',
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user3.jpg',
            name: 'Emily Johnson',
            number: '+03 4567 8900'
        },
        email: 'johnson@trinta.com',
        walletBalance: '$40k',
        totalOrders: '887',
        activeStatus: '1 month ago',
        location: 'Whispering Willow, Haven',
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user9.jpg',
            name: 'William Anderson',
            number: '+03 4567 8900'
        },
        email: 'anderson@trinta.com',
        walletBalance: '$90k',
        totalOrders: '539',
        activeStatus: '6 hrs ago',
        location: 'Sapphire Serenity, Cove',
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user10.jpg',
            name: 'Charlotte Lee',
            number: '+03 4567 8900'
        },
        email: 'lee@trinta.com',
        walletBalance: '$120.5k',
        totalOrders: '60',
        activeStatus: '2 days ago',
        location: 'Twilight Enigma, Sanctuar',
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user6.jpg',
            name: 'Xavier Rodriguez',
            number: '+03 4567 8900'
        },
        email: 'rodriguez@trinta.com',
        walletBalance: '$40k',
        totalOrders: '205',
        activeStatus: '7 dys ago',
        location: 'Celestial Harmony, Meadow',
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user9.jpg',
            name: 'Sophia Nguyen',
            number: '+03 4567 8900'
        },
        email: 'nguyen@trinta.com',
        walletBalance: '$90k',
        totalOrders: '107',
        activeStatus: '2 hrs ago',
        location: 'Crimson Horizon, Bluff',
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user19.jpg',
            name: 'Elijah Benjamin',
            number: '+03 4567 8900'
        },
        email: 'benjamin@trinta.com',
        walletBalance: '$120.5k',
        totalOrders: '100',
        activeStatus: '9 hrs ago',
        location: 'Radiant Cascade, Oasis',
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user19.jpg',
            name: 'Elijah Benjamin',
            number: '+03 4567 8900'
        },
        email: 'benjamin@trinta.com',
        walletBalance: '$120.5k',
        totalOrders: '100',
        activeStatus: '9 hrs ago',
        location: 'Radiant Cascade, Oasis',
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user9.jpg',
            name: 'Sophia Nguyen',
            number: '+03 4567 8900'
        },
        email: 'nguyen@trinta.com',
        walletBalance: '$90k',
        totalOrders: '107',
        activeStatus: '2 hrs ago',
        location: 'Crimson Horizon, Bluff',
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user6.jpg',
            name: 'Xavier Rodriguez',
            number: '+03 4567 8900'
        },
        email: 'rodriguez@trinta.com',
        walletBalance: '$40k',
        totalOrders: '205',
        activeStatus: '7 dys ago',
        location: 'Celestial Harmony, Meadow',
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user10.jpg',
            name: 'Charlotte Lee',
            number: '+03 4567 8900'
        },
        email: 'lee@trinta.com',
        walletBalance: '$120.5k',
        totalOrders: '60',
        activeStatus: '2 days ago',
        location: 'Twilight Enigma, Sanctuar',
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user9.jpg',
            name: 'William Anderson',
            number: '+03 4567 8900'
        },
        email: 'anderson@trinta.com',
        walletBalance: '$90k',
        totalOrders: '539',
        activeStatus: '6 hrs ago',
        location: 'Sapphire Serenity, Cove',
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user3.jpg',
            name: 'Emily Johnson',
            number: '+03 4567 8900'
        },
        email: 'johnson@trinta.com',
        walletBalance: '$40k',
        totalOrders: '887',
        activeStatus: '1 month ago',
        location: 'Whispering Willow, Haven',
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user2.jpg',
            name: 'Marcus Davis',
            number: '+03 4567 8900'
        },
        email: 'davis@trinta.com',
        walletBalance: '$75k',
        totalOrders: '308',
        activeStatus: '10 hrs ago',
        location: 'Enchanted Silver Moon, Valley',
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user1.jpg',
            name: 'Sarah Rodriguez',
            number: '+03 4567 8900'
        },
        email: 'rodriguez@trinta.com',
        walletBalance: '$100.5k',
        totalOrders: '1,250',
        activeStatus: '1 hrs ago',
        location: 'Ethereal Blossom, Grove',
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    }
];
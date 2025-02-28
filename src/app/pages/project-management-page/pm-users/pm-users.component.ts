import { NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-pm-users',
    imports: [MatCardModule, MatButtonModule, MatMenuModule, MatPaginatorModule, MatTableModule, NgIf],
    templateUrl: './pm-users.component.html',
    styleUrl: './pm-users.component.scss'
})
export class PmUsersComponent {

    displayedColumns: string[] = ['user', 'email', 'roles', 'projects', 'status', 'action'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

}

export interface PeriodicElement {
    user: any;
    email: string;
    roles: string;
    projects: number;
    status: any;
    action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        user: {
            img: 'images/users/user1.jpg',
            name: 'Sarah Rodriguez',
            number: '+03 4567 8900'
        },
        email: 'rodriguez@workifence.com',
        roles: 'Administrator',
        projects: 805,
        status: {
            active: 'Active',
            // deactive : 'Deactive',
            // converted : 'Converted'
        },
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
        email: 'davis@workifence.com',
        roles: 'Administrator',
        projects: 324,
        status: {
            active: 'Active',
            // deactive : 'Deactive',
            // converted : 'Converted'
        },
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
        email: 'johnson@workifence.com',
        roles: 'Administrator',
        projects: 902,
        status: {
            // active: 'Active',
            deactive : 'Deactive',
            // converted : 'Converted'
        },
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
        email: 'anderson@workifence.com',
        roles: 'Administrator',
        projects: 519,
        status: {
            // active: 'Active',
            // deactive : 'Deactive',
            converted : 'Converted'
        },
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
        email: 'lee@workifence.com',
        roles: 'Administrator',
        projects: 227,
        status: {
            active: 'Active',
            // deactive : 'Deactive',
            // converted : 'Converted'
        },
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user6.jpg',
            name: 'David Stivy',
            number: '+03 4567 8900'
        },
        email: 'david@workifence.com',
        roles: 'Administrator',
        projects: 902,
        status: {
            // active: 'Active',
            deactive : 'Deactive',
            // converted : 'Converted'
        },
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user8.jpg',
            name: 'Olivia Lucky',
            number: '+03 4567 8900'
        },
        email: 'olivia@workifence.com',
        roles: 'Administrator',
        projects: 519,
        status: {
            // active: 'Active',
            // deactive : 'Deactive',
            converted : 'Converted'
        },
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user4.jpg',
            name: 'Maxwel Smith',
            number: '+03 4567 8900'
        },
        email: 'maxwel@workifence.com',
        roles: 'Administrator',
        projects: 227,
        status: {
            active: 'Active',
            // deactive : 'Deactive',
            // converted : 'Converted'
        },
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user5.jpg',
            name: 'Benjamin Clark',
            number: '+03 4567 8900'
        },
        email: 'clark@workifence.com',
        roles: 'Administrator',
        projects: 324,
        status: {
            active: 'Active',
            // deactive : 'Deactive',
            // converted : 'Converted'
        },
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user21.jpg',
            name: 'Alina Smith',
            number: '+03 4567 8900'
        },
        email: 'alina@workifence.com',
        roles: 'Administrator',
        projects: 805,
        status: {
            // active: 'Active',
            deactive : 'Deactive',
            // converted : 'Converted'
        },
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user21.jpg',
            name: 'Alina Smith',
            number: '+03 4567 8900'
        },
        email: 'alina@workifence.com',
        roles: 'Administrator',
        projects: 805,
        status: {
            // active: 'Active',
            deactive : 'Deactive',
            // converted : 'Converted'
        },
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user5.jpg',
            name: 'Benjamin Clark',
            number: '+03 4567 8900'
        },
        email: 'clark@workifence.com',
        roles: 'Administrator',
        projects: 324,
        status: {
            active: 'Active',
            // deactive : 'Deactive',
            // converted : 'Converted'
        },
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user4.jpg',
            name: 'Charlotte Lee',
            number: '+03 4567 8900'
        },
        email: 'charlotte@workifence.com',
        roles: 'Administrator',
        projects: 227,
        status: {
            active: 'Active',
            // deactive : 'Deactive',
            // converted : 'Converted'
        },
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user8.jpg',
            name: 'Olivia Lucky',
            number: '+03 4567 8900'
        },
        email: 'olivia@workifence.com',
        roles: 'Administrator',
        projects: 519,
        status: {
            // active: 'Active',
            // deactive : 'Deactive',
            converted : 'Converted'
        },
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user6.jpg',
            name: 'David Stivy',
            number: '+03 4567 8900'
        },
        email: 'david@workifence.com',
        roles: 'Administrator',
        projects: 902,
        status: {
            // active: 'Active',
            deactive : 'Deactive',
            // converted : 'Converted'
        },
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    },
    {
        user: {
            img: 'images/users/user10.jpg',
            name: 'Maxwel Smith',
            number: '+03 4567 8900'
        },
        email: 'maxwel@workifence.com',
        roles: 'Administrator',
        projects: 227,
        status: {
            active: 'Active',
            // deactive : 'Deactive',
            // converted : 'Converted'
        },
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
        email: 'anderson@workifence.com',
        roles: 'Administrator',
        projects: 519,
        status: {
            // active: 'Active',
            // deactive : 'Deactive',
            converted : 'Converted'
        },
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
        email: 'johnson@workifence.com',
        roles: 'Administrator',
        projects: 902,
        status: {
            // active: 'Active',
            deactive : 'Deactive',
            // converted : 'Converted'
        },
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
        email: 'davis@workifence.com',
        roles: 'Administrator',
        projects: 324,
        status: {
            active: 'Active',
            // deactive : 'Deactive',
            // converted : 'Converted'
        },
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
        email: 'rodriguez@workifence.com',
        roles: 'Administrator',
        projects: 805,
        status: {
            active: 'Active',
            // deactive : 'Deactive',
            // converted : 'Converted'
        },
        action: {
            edit: 'ri-edit-line',
            delete : 'ri-delete-bin-line'
        }
    }
];
import { NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-contacts',
    imports: [MatCardModule, MatButtonModule, MatMenuModule, MatPaginatorModule, MatTableModule, NgIf],
    templateUrl: './contacts.component.html',
    styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

    displayedColumns: string[] = ['id', 'user', 'email', 'roles', 'company', 'status', 'action'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

}

export interface PeriodicElement {
    id: string;
    user: any;
    email: string;
    roles: string;
    company: string;
    status: any;
    action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        id: '#1217',
        user: {
            img: 'images/users/user1.jpg',
            name: 'Sarah Rodriguez',
            number: '+03 4567 8900'
        },
        email: 'rodriguez@workifence.com',
        roles: 'Administrator',
        company: 'ABC Corporation',
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
        id: '#1364',
        user: {
            img: 'images/users/user2.jpg',
            name: 'Marcus Davis',
            number: '+03 4567 8900'
        },
        email: 'davis@workifence.com',
        roles: 'Administrator',
        company: 'XYZ Ltd',
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
        id: '#2951',
        user: {
            img: 'images/users/user3.jpg',
            name: 'Emily Johnson',
            number: '+03 4567 8900'
        },
        email: 'johnson@workifence.com',
        roles: 'Administrator',
        company: 'Tech Solutions',
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
        id: '#7342',
        user: {
            img: 'images/users/user9.jpg',
            name: 'William Anderson',
            number: '+03 4567 8900'
        },
        email: 'anderson@workifence.com',
        roles: 'Administrator',
        company: 'Global Solutions',
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
        id: '#4619',
        user: {
            img: 'images/users/user10.jpg',
            name: 'Charlotte Lee',
            number: '+03 4567 8900'
        },
        email: 'lee@workifence.com',
        roles: 'Administrator',
        company: 'Acma Industries',
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
        id: '#7346',
        user: {
            img: 'images/users/user6.jpg',
            name: 'David Stivy',
            number: '+03 4567 8900'
        },
        email: 'david@workifence.com',
        roles: 'Administrator',
        company: 'Tech Solutions',
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
        id: '#7612',
        user: {
            img: 'images/users/user8.jpg',
            name: 'Olivia Lucky',
            number: '+03 4567 8900'
        },
        email: 'olivia@workifence.com',
        roles: 'Administrator',
        company: 'Global Solutions',
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
        id: '#7642',
        user: {
            img: 'images/users/user4.jpg',
            name: 'Maxwel Smith',
            number: '+03 4567 8900'
        },
        email: 'maxwel@workifence.com',
        roles: 'Administrator',
        company: 'Acma Industries',
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
        id: '#4652',
        user: {
            img: 'images/users/user5.jpg',
            name: 'Benjamin Clark',
            number: '+03 4567 8900'
        },
        email: 'clark@workifence.com',
        roles: 'Administrator',
        company: 'XYZ Ltd',
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
        id: '#7895',
        user: {
            img: 'images/users/user21.jpg',
            name: 'Alina Smith',
            number: '+03 4567 8900'
        },
        email: 'alina@workifence.com',
        roles: 'Administrator',
        company: 'ABC Corporation',
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
        id: '#7895',
        user: {
            img: 'images/users/user21.jpg',
            name: 'Alina Smith',
            number: '+03 4567 8900'
        },
        email: 'alina@workifence.com',
        roles: 'Administrator',
        company: 'ABC Corporation',
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
        id: '#4652',
        user: {
            img: 'images/users/user5.jpg',
            name: 'Benjamin Clark',
            number: '+03 4567 8900'
        },
        email: 'clark@workifence.com',
        roles: 'Administrator',
        company: 'XYZ Ltd',
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
        id: '#7642',
        user: {
            img: 'images/users/user4.jpg',
            name: 'Charlotte Lee',
            number: '+03 4567 8900'
        },
        email: 'charlotte@workifence.com',
        roles: 'Administrator',
        company: 'Acma Industries',
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
        id: '#7612',
        user: {
            img: 'images/users/user8.jpg',
            name: 'Olivia Lucky',
            number: '+03 4567 8900'
        },
        email: 'olivia@workifence.com',
        roles: 'Administrator',
        company: 'Global Solutions',
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
        id: '#7346',
        user: {
            img: 'images/users/user6.jpg',
            name: 'David Stivy',
            number: '+03 4567 8900'
        },
        email: 'david@workifence.com',
        roles: 'Administrator',
        company: 'Tech Solutions',
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
        id: '#4619',
        user: {
            img: 'images/users/user10.jpg',
            name: 'Maxwel Smith',
            number: '+03 4567 8900'
        },
        email: 'maxwel@workifence.com',
        roles: 'Administrator',
        company: 'Acma Industries',
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
        id: '#7342',
        user: {
            img: 'images/users/user9.jpg',
            name: 'William Anderson',
            number: '+03 4567 8900'
        },
        email: 'anderson@workifence.com',
        roles: 'Administrator',
        company: 'Global Solutions',
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
        id: '#2951',
        user: {
            img: 'images/users/user3.jpg',
            name: 'Emily Johnson',
            number: '+03 4567 8900'
        },
        email: 'johnson@workifence.com',
        roles: 'Administrator',
        company: 'Tech Solutions',
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
        id: '#1364',
        user: {
            img: 'images/users/user2.jpg',
            name: 'Marcus Davis',
            number: '+03 4567 8900'
        },
        email: 'davis@workifence.com',
        roles: 'Administrator',
        company: 'XYZ Ltd',
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
        id: '#1217',
        user: {
            img: 'images/users/user1.jpg',
            name: 'Sarah Rodriguez',
            number: '+03 4567 8900'
        },
        email: 'rodriguez@workifence.com',
        roles: 'Administrator',
        company: 'ABC Corporation',
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
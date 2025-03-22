export interface AppState{
    actionInProgress: boolean
    errorMessage: any
    serviceRequests: Array<ServiceRequestItem>
}

export class ServiceRequestItem{
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    phone: string = '';
    requestType: string = '';
    requestDescription: string = '';
    createdDate: string = '';
    lastModifiedDate: string = '';
    lastModifiedBy: string = '';
    status: string = '';
    recordDeleted: string = '';
}
import { computed, Injectable, Signal, signal } from "@angular/core";
import { AppState, ServiceRequestItem } from "./app-store.model";

@Injectable({
    providedIn: 'root',
  })
  export class AppStoreService {
    state = signal<AppState>(
    { 
        actionInProgress : false,
        errorMessage : "",
        serviceRequests: new Array<ServiceRequestItem>()
        });

        resetStore() {
        this.state.update((state) => ({
            ...state,
            actionInProgress : false,
            errorMessage : "",
            serviceRequests : new Array<ServiceRequestItem>()
        }));
    }

    updateServiceRequests(requests: Array<ServiceRequestItem>){
        this.state.update((state) => ({
            ...state,
            serviceRequests: requests
        }))
    }

    updateErrorMessage(message: string) {
        this.state.update((state) => ({
          ...state,
          errorMessage: message
        }));
    }

    getServiceRequests(){
        return computed(() => this.state().serviceRequests);
    }

    getActionInProgress(): Signal<boolean> {
        return computed(() => this.state().actionInProgress);
    } 
      
  }

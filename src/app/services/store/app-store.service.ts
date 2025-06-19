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
        serviceRequests: new Array<ServiceRequestItem>(),
        filteredServiceRequests: new Array<ServiceRequestItem>(),
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
            serviceRequests: this.cleanServiceRequests(requests)
        }))
    }

    updateFilteredServiceRequests(searchText: String){
        this.state.update((state) => ({
            ...state,
            filteredServiceRequests: searchText != "" ? state.serviceRequests.filter((item) => item.requestType === searchText) : state.serviceRequests
        }))
    }

    updateActionInProgress(status: boolean){
        this.state.update((state) => ({
            ...state,
            actionInProgress: status
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

    getFilteredServiceRequests(){
        return computed(() => this.state().filteredServiceRequests);
    }

    getActionInProgress(): Signal<boolean> {
        return computed(() => this.state().actionInProgress);
    } 

    cleanServiceRequests(list: Array<ServiceRequestItem>) {
        return list
        .reverse()
        .map(item => {
          const date = new Date(item.createdDate);
          const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
      
          return {
            ...item,
            createdDate: formattedDate
          };
        });
      }
      
  }

import { Injectable, Signal, computed, signal } from "@angular/core";
import { Enterprise, JobFeedItem, JobItem, JobOpeningsState } from "./jobs-store.model";




@Injectable({
    providedIn: 'root',
  })
  export class JobOpeningsStoreService {
    state = signal<JobOpeningsState>(
      { 
        actionInProgress : false,
        homePageJobsFeed : new Array<JobFeedItem>(),
        searchPageJobsFeed : new Array<JobFeedItem>(),
        seletedJobFeed :  new JobFeedItem(),
        jobWishList : new Array<JobFeedItem>(),
        appliedJobs : new Array<JobItem>(),
        selectedAppliedJob : new JobItem(),
        enterprise : new Array<Enterprise>,
        errorMessage : ""
       });

       resetStore() {
        this.state.update((state) => ({
          ...state,
          actionInProgress : false,
          homePageJobsFeed : new Array<JobFeedItem>(),
          searchPageJobsFeed : new Array<JobFeedItem>(),
          seletedJobFeed :  new JobFeedItem(),
          jobWishList : new Array<JobFeedItem>(),
          appliedJobs : new Array<JobItem>(),
          selectedAppliedJob : new JobItem(),
          enterprise : new Array<Enterprise>,
          errorMessage : ""
        }));
      }

    updateHomeJobsFeed(jobs: Array<JobFeedItem>) {
        this.state.update((state) => ({
          ...state,
          homePageJobsFeed: jobs
        }));
    }

    updateSearchJobFeed(jobs: Array<JobFeedItem>) {
      this.state.update((state) => ({
        ...state,
        searchPageJobsFeed: jobs
      }));
    }
    updateSelectedJobFeed(job: JobFeedItem) {
      this.state.update((state) => ({
        ...state,
        seletedJobFeed: job
      }));
    }

    updateJobWishList(jobs: Array<JobFeedItem>) {
      this.state.update((state) => ({
        ...state,
        jobWishList: jobs
      }));
    }

    updateAppliedJobs(jobs: Array<JobItem>) {
      this.state.update((state) => ({
        ...state,
        appliedJobs: jobs
      }));
    }

    updateAppliedJob(job: JobItem) {
      this.state.update((state) => ({
        ...state,
        selectedAppliedJob: job
      }));
    }

    updateErrorMessage(message: string) {
      this.state.update((state) => ({
        ...state,
        errorMessage: message
      }));
    }

    getActionInProgress(): Signal<boolean> {
      return computed(() => this.state().actionInProgress);
    } 

    getHomeJobsFeed(): Signal<Array<JobFeedItem>> {
      return computed(() => {
        const homePageJobsFeed = this.state().homePageJobsFeed;
        return homePageJobsFeed.length > 12 ? homePageJobsFeed.slice(0, 12) : homePageJobsFeed;
      });
    }

    getSearchPageJobsFeed(): Signal<Array<JobFeedItem>> {
      return computed(() => this.state().searchPageJobsFeed);
    } 

    getSelectedJobFeed(): Signal<JobFeedItem> {
      return computed(() => this.state().seletedJobFeed);
    } 

    getJobsWishList(): Signal<Array<JobFeedItem>> {
      return computed(() => this.state().jobWishList);
    } 

    getAppliedJobs(): Signal<Array<JobItem>> {
      return computed(() => this.state().appliedJobs);
    } 

    getSelectedAppliedJob(): Signal<JobItem> {
      return computed(() => this.state().selectedAppliedJob);
    }
      
  }

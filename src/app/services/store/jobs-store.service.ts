import { Injectable, Signal, computed, signal } from "@angular/core";
import { Enterprise, JobFeedItem, JobItem, JobOpeningsState } from "./jobs-store.model";
import { CollegeJobItem } from "../ifence.model";




@Injectable({
    providedIn: 'root',
  })
  export class JobOpeningsStoreService {
    state = signal<JobOpeningsState>(
      { 
        actionInProgress : false,
        collegeJobActionInProgress : false,
        homePageJobsFeed : new Array<JobFeedItem>(),
        collegeJobsFeed : new Array<CollegeJobItem>(),
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
          collegeJobActionInProgress : false,
          actionInProgress : false,
          homePageJobsFeed : new Array<JobFeedItem>(),
          collegeJobsFeed : new Array<CollegeJobItem>(),
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

    updateCollegeJobsFeed(jobs: Array<CollegeJobItem>) {
        this.state.update((state) => ({
          ...state,
          collegeJobsFeed: jobs
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

    getCollegeJobsFeed() : Signal<Array<CollegeJobItem>> {
      return computed(() => {
        const collegeJobsFeed = this.state().collegeJobsFeed;
        return collegeJobsFeed.length > 12 ? collegeJobsFeed.slice(0, 12) : collegeJobsFeed;
      });
    }

    getCollegeJobs() : Signal<Array<CollegeJobItem>> {
      return computed(() => this.state().collegeJobsFeed);
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

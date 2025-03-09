import { Injectable, Inject, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, retry } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Profile } from './profile.model';
import { AppConstantsService } from './app-constants.service';
import { CollegeJobItem, JobFeedItem, JobItem, JobResumeItem, QuestionComment } from './ifence.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({providedIn: 'any'})
export class IfenceService {
  private actionUrl!: string;
  private profile !: Profile
  notificationCallCount : number = 0
  private platformId: object =  inject(PLATFORM_ID);

  constructor(
    private http: HttpClient,
    private httpClient: HttpClient,
    private appConstants: AppConstantsService
  ) {
   
  }

  getJobsFeeds(job_categories: any, job_type: any) : Observable<Array<JobFeedItem>>{
    // let queryUrl = 'https://jobicy.com/feed/newjobs';

    // https://jobicy.com/?feed=job_feed&job_categories=dev&job_types=full-time&search_region=usa
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = ''
    if(job_categories !== 'Any'){
      queryUrl = baseUrl +  '/api/get-jobs/?feed=job_feed&job_categories=' + job_categories + '&job_types=' + job_type + '&search_region=usa';
    }else{
      queryUrl = baseUrl +  '/api/get-jobs';
    }


    return this.http.get<any>(queryUrl);
  }

  getHomePageJobsFeed() : Observable<Array<JobFeedItem>>{
    // let queryUrl = 'https://jobicy.com/feed/newjobs';
    let queryUrl = this.appConstants.BASE_API_URL +  '/api/get-jobs';

    return this.http.get<any>(queryUrl);
  }

  getCollegeJobsFeed() : Observable<Array<CollegeJobItem>>{
    // let queryUrl = 'https://jobicy.com/feed/newjobs';
    let queryUrl = this.appConstants.BASE_API_URL +  '/api/college-jobs';

    return this.http.get<any>(queryUrl);
  }

  getNotifications(userId : any) : Observable<any>{
    
    let queryUrl = this.appConstants.BASE_API_URL +  '/api/wif-get-notifications/'+userId;

    return this.http.get<any>(queryUrl);
  }

  updateNotificationStatus(userId : string) : Observable<any>{
    this.notificationCallCount = this.notificationCallCount + 1;
    if(this.notificationCallCount == 1){
      let queryUrl = this.appConstants.BASE_API_URL +  '/api/update-notification-status-read/' + userId;
      return this.http.post<any>(queryUrl, "");
    }
    else{
      return of("UPDATE_FAILED");
    }
  }
    
  saveJobResume(jobResume:  JobResumeItem) {
    let url:string = this.appConstants.BASE_API_URL + this.appConstants.POST_JOB_RESUME_URL;
    console.log('saveJobResume: api call');
    return this.http
      .post<any>(url, jobResume)
      .pipe(catchError(this.handleError));
  }

  updateJobResume(jobResume:  JobResumeItem) {
    let url:string = this.appConstants.BASE_API_URL + this.appConstants.POST_JOB_RESUME_URL + '/' + jobResume.id;
    console.log('saveJobResume: api call');
    return this.http
      .put<any>(url, jobResume)
      .pipe(catchError(this.handleError));
  }

  getJobResumesByUserId(userId: string) {
    let url:string = this.appConstants.BASE_API_URL + this.appConstants.GET_JOB_RESUMES_URL + '?ownerId.equals=' + userId;
    console.log('getJobResumesByUserId: api call');
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError));
  }

  getJobResumeDetailsById(resumeId: string) {
    let url:string = this.appConstants.BASE_API_URL + this.appConstants.GET_JOB_RESUME_BY_ID_URL + '/' + resumeId;
    console.log('getJobResumeDetailsById: api call');
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError));
  }

  deleteJobResumeById(resumeId: string) {
    let url:string = this.appConstants.BASE_API_URL + this.appConstants.DELETE_JOB_RESUME_BY_ID_URL + '/' + resumeId;
    console.log('deleteJobResumeById: api call');
    return this.http
      .delete<any>(url)
      .pipe(catchError(this.handleError));
  }

  saveAppliedJob(jobItem:  JobItem) {
    let url:string = this.appConstants.BASE_API_URL + this.appConstants.POST_APPLIED_JOB_URL;
    console.log('saveAppliedJob: api call');
    return this.http
      .post<any>(url, jobItem)
      .pipe(catchError(this.handleError));
  }

  updateAppliedJob(jobItem:  JobItem) {
    let url:string = this.appConstants.BASE_API_URL + this.appConstants.UPDATE_APPLIED_JOB_URL + '/' + jobItem.id;
    console.log('updateAppliedJob: api call');
    return this.http
      .put<any>(url, jobItem)
      .pipe(catchError(this.handleError));
  }

  getAppliedJobsByUserId(userId: string) {
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl +  '/api/get-job-application-by-userid/' + userId;
    // 
    ////console.log('getDeals: api call');
    return this.http
      .get<any>(queryUrl)
      .pipe(catchError(this.handleError));
    // let url:string = this.appConstants.BASE_API_URL + this.appConstants.GET_APPLIED_JOBS_URL + '?ownerId.equals=' + userId;
    // console.log('getAppliedJobsByUserId: api call');
    // return this.http
    //   .get<any>(url)
    //   .pipe(catchError(this.handleError));
  }

  getAppliedJobById(jobId: string) {
    let url:string = this.appConstants.BASE_API_URL + this.appConstants.GET_APPLIED_JOB_BY_ID_URL + '/' + jobId;
    console.log('getAppliedJobById: api call');
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError));
  }

  deleteAppliedJobById(jobId: string) {
    let url:string = this.appConstants.BASE_API_URL + this.appConstants.DELETE_APPLIED_JOB_BY_ID_URL + '/' + jobId;
    console.log('deleteJobResumeById: api call');
    return this.http
      .delete<any>(url)
      .pipe(catchError(this.handleError));
  }

  getEnterpriseByCategory(category: string) {
    let url:string = this.appConstants.BASE_API_URL + this.appConstants.GET_ENTERPRISE_BY_CATEGORY;
    console.log('getEnterpriseByCategory: api call');
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError));
  }

  saveQuestionComment(comment:  QuestionComment) {
    let url:string = this.appConstants.BASE_API_URL + this.appConstants.POST_JOB_RESUME_URL;
    console.log('saveQuestionComment: api call');
    return this.http
      .post<any>(url, comment)
      .pipe(catchError(this.handleError));
  }




  private handleError(error: HttpErrorResponse): Observable<never> {
    // alert('api: Error' + error.error);
    return throwError(error || 'Server error');
  }


}
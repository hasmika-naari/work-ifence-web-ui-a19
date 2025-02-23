import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { HttpWrapperService } from './http-wrapper.service';
import { AppConstantsService } from './app-constants.service';
import { isPlatformBrowser } from '@angular/common';
import { JobApplicationDetails, JobResume, JobResumeRequest } from './resume.model';
import { JobApplication, JobApplicationRequest, ResumeListDataItem } from './work-ifence-data.model';

@Injectable({providedIn: 'any'})
export class ResumeService {

  constructor(
    private http: HttpWrapperService,
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId:any,
    private appConstants: AppConstantsService,
  ) {

  }

  generateResume(resumeTemplate: any){
    // 
    let queryUrl = 'http://132.148.79.209:8090/api/generateCustomResume';


    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/pdf',
        'responseType': "arraybuffer" // This line adds responseType to the headers
      });

    //console.log('postDeal: api call');
    return this.httpClient.post(queryUrl, resumeTemplate, {headers : headers, responseType : 'arraybuffer'})
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    //console.log('Get Playlist API: Error');
    return throwError(error || 'Get Playlist API: Error');
  }

  saveAndDownloadResume(jobRequest : any){

    // let queryUrl = 'http://132.148.79.209:8090/api/saveResumeandDownloadResume';

    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.SAVE_RESUME_AND_DOWNLOAD;

    //console.log('postDeal: api call');
    return this.httpClient.post(queryUrl, jobRequest)
      .pipe(catchError(this.handleError));
  }


  dowloadResumePDF(userName : any, fileName : any){

    // let queryUrl = 'http://132.148.79.209:8090/api/saveResumeandDownloadResume';

    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.DOWNLOAD_RESUME + "?userName=" + userName + "&fileName=" + fileName;

    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/pdf',
        'responseType': "arraybuffer" // This line adds responseType to the headers
      });

    //console.log('postDeal: api call');
    return this.httpClient.get(queryUrl, {headers : headers, responseType : 'arraybuffer'})
      .pipe(catchError(this.handleError));
  }

  downloadExternalResume(userName : any, fileName : any){

    // let queryUrl = 'http://132.148.79.209:8090/api/saveResumeandDownloadResume';

    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.DOWNLOAD_EXTERNAL_RESUME + "?userName=" + userName + "&fileName=" + fileName;

    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/pdf',
        'responseType': "arraybuffer" // This line adds responseType to the headers
      });

    //console.log('postDeal: api call');
    return this.httpClient.get(queryUrl, {headers : headers, responseType : 'arraybuffer'})
      .pipe(catchError(this.handleError));
  }

  saveResume(jobResume : any) : Observable<ResumeListDataItem>{
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.SAVE_RESUMES;

    //console.log('postDeal: api call');
    return this.httpClient.post<any>(queryUrl, jobResume)
      .pipe(catchError(this.handleError));
  }

  uploadProfileImage(imageBytes : any,path : string, fileName : string, oldFileName : string){
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.UPLOAD_PROFILE_IMAGE + "?path=" + path + "&filename=" + fileName + "&oldFileName=" + oldFileName;

    //console.log('postDeal: api call');
    return this.http.post(queryUrl, imageBytes)
      .pipe(catchError(this.handleError));
  }

  updateResume(jobResume : JobResumeRequest) : Observable<ResumeListDataItem>{
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.SAVE_RESUMES;

    //console.log('postDeal: api call');
    return this.httpClient.post<any>(queryUrl, jobResume)
      .pipe(catchError(this.handleError));
  }

  updateResumePrimaryValue(id : string, value : string){
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.UPDATE_USER_RESUME_PRIMARY_VALUE + "?id= " + id + "&value=" + value;


    //console.log('postDeal: api call');
    return this.httpClient.post(queryUrl, "")
      .pipe(catchError(this.handleError));
  }

  updateResumeStatusValue(id : string, value : string){
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.UPDATE_USER_RESUME_STATUS_VALUE + "?id= " + id + "&value=" + value;


    //console.log('postDeal: api call');
    return this.httpClient.post(queryUrl, "")
      .pipe(catchError(this.handleError));
  }

  updateResumeAccessValue(id : string, value : string){
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.UPDATE_USER_RESUME_ACCESS_VALUE + "?id= " + id + "&value=" + value;


    //console.log('postDeal: api call');
    return this.httpClient.post(queryUrl, "")
      .pipe(catchError(this.handleError));
  }

  deleteResume(id : any){
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.DELETE_RESUME + '/' + id;

    //console.log('postDeal: api call');
    return this.httpClient.delete(queryUrl)
      .pipe(catchError(this.handleError));
  }

  deleteApplication(id : any){
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.DELETE_JOB_APPLICATION + '/' + id;

    //console.log('postDeal: api call');
    return this.httpClient.delete(queryUrl)
      .pipe(catchError(this.handleError));
  }




  getResumeListByOwnerId(ownerId : any){
    
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.GET_RESUMES_BY_USER_ID + '?ownerId.equals=' + ownerId;;

   return this.http.get<any>(queryUrl).pipe(catchError(this.handleError));
  }

  saveApplication(data : JobApplicationRequest){
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.SAVE_JOB_APPLICATION;

    //console.log('postDeal: api call');
    return this.httpClient.post(queryUrl, data)
      .pipe(catchError(this.handleError));
  }

  updateApplication(data : JobApplicationRequest){
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.SAVE_JOB_APPLICATION;

    //console.log('postDeal: api call');
    return this.httpClient.post(queryUrl, data)
      .pipe(catchError(this.handleError));
  }

  updateApplicationStatus(japp : JobApplicationDetails){
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.UPDATE_JOB_APPLICATION_STATUS + '/' + japp.id;
   
    //console.log('postDeal: api call');
    return this.httpClient.patch(queryUrl, japp)
      .pipe(catchError(this.handleError));
  }

  postExternalResume(filename: string, keyname: string, file: File) {
    let baseUrl = this.appConstants.BASE_API_URL;
    if (isPlatformBrowser(this.platformId)) {
      baseUrl = '';
    }
  
    const headers = new HttpHeaders(); // No need to set 'Content-Type', FormData handles that
  
    // Create FormData to append the file and other parameters
    const formData = new FormData();
    formData.append('file', file, filename); // Append file
    formData.append('keyname', keyname);     // Append keyname as parameter
    formData.append('filename', filename);   // Append filename as parameter
  
    const queryUrl = baseUrl + this.appConstants.POST_EXTERNAL_RESUME;
    return this.httpClient.post(queryUrl, formData, { headers: headers })
      .pipe(catchError(this.handleError));
  }

  deleteApplicationResume(keyname : string){
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.DELETE_EXTERNAL_RESUME + "?keyname=" + keyname;

    //console.log('postDeal: api call');
    return this.httpClient.delete(queryUrl)
      .pipe(catchError(this.handleError));
  }

  deleteVendorContact(id : string){
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.DELETE_VENDOR_CONTACT + '/' + id;

    //console.log('postDeal: api call');
    return this.httpClient.delete(queryUrl)
      .pipe(catchError(this.handleError));
  }

  deleteClientContact(id : string){
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.DELETE_CLIENT_CONTACT + '/' + id;

    //console.log('postDeal: api call');
    return this.httpClient.delete(queryUrl)
      .pipe(catchError(this.handleError));
  }
  
  deleteInterviewRound(id : string){
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.DELETE_INTERVIEW_ROUND + "/" + id;

    //console.log('postDeal: api call');
    return this.httpClient.delete(queryUrl)
      .pipe(catchError(this.handleError));
  }
  

  getAllJobApplications(ownerId : any){
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.GET_ALL_JOB_APPLICATIONS + '/' + ownerId;;
    // alert('URL: ' + queryUrl);
   return this.http.get<any>(queryUrl).pipe(catchError(this.handleError));
  }

  requestOpenAI(prompt : any){
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = this.appConstants.BASE_API_URL + this.appConstants.REQUEST_OPENAI;

    //console.log('postDeal: api call');
    return this.httpClient.post(queryUrl, prompt)
      .pipe(catchError(this.handleError));
  }


}
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { catchError, map, retry } from 'rxjs/operators';
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

  localhosturl : string = 'http://localhost:8090';

  generateResume(resumeTemplate: any){
    // 
    let queryUrl = 'http://Workifence.com:8090/api/generateCustomResume';


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

  private toText(value: unknown): string {
    return (value ?? '').toString().trim();
  }

  private pickText(...values: unknown[]): string {
    for (const value of values) {
      const text = this.toText(value);
      if (text) {
        return text;
      }
    }

    return '';
  }

  private parseResumeJson(resumeJson: unknown): any {
    const text = this.toText(resumeJson);
    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  private getFileNameFromPath(path: unknown): string {
    const normalizedPath = this.toText(path);
    if (!normalizedPath) {
      return '';
    }

    const segments = normalizedPath.split('/').filter(Boolean);
    return segments.length > 0 ? segments[segments.length - 1] : '';
  }

  private normalizeResumeListItem(item: any): ResumeListDataItem {
    const normalizedItem = new ResumeListDataItem();
    const resume = this.parseResumeJson(item?.resumeJson);
    const documentUrl = this.pickText(
      item?.documentUrl,
      item?.resumeDocUrl,
      item?.resume_doc_url,
      item?.current_documentUrl,
    );

    normalizedItem.id = this.pickText(item?.id);
    normalizedItem.code = this.pickText(item?.code);
    normalizedItem.title = this.pickText(item?.title, resume?.title);
    normalizedItem.description = this.pickText(item?.description);
    normalizedItem.documentUrl = documentUrl;
    normalizedItem.resumeJson = this.pickText(item?.resumeJson);
    normalizedItem.createdDate = this.pickText(item?.createdDate, item?.created_date);
    normalizedItem.lastUpdatedDate = this.pickText(
      item?.lastUpdatedDate,
      item?.lastModifiedDate,
      item?.last_modified_date,
      item?.createdDate,
    );
    normalizedItem.resumeCategory = this.pickText(item?.resumeCategory, item?.resume_category, resume?.resume_category);
    normalizedItem.roleCategory = this.pickText(item?.roleCategory, item?.role_category, resume?.role_category);
    normalizedItem.type = this.pickText(item?.type);
    normalizedItem.status = this.pickText(item?.status);
    normalizedItem.userName = this.pickText(item?.userName, item?.user_name);
    normalizedItem.rating = Number(item?.rating ?? 0);
    normalizedItem.selected = Boolean(item?.selected);
    normalizedItem.access = this.pickText(item?.access, item?.accessType, item?.access_type, item?.access_level);
    normalizedItem.wish = Boolean(item?.wish);
    normalizedItem.lastUsedFor = this.pickText(item?.lastUsedFor, item?.last_used_for);
    normalizedItem.templateId = this.pickText(item?.templateId, item?.template_id, resume?.template_details?.id);
    normalizedItem.ownerId = this.pickText(item?.ownerId, item?.owner_id);
    normalizedItem.tags = this.pickText(item?.tags);
    normalizedItem.fileName = this.pickText(
      item?.fileName,
      item?.filename,
      item?.current_filename,
      item?.old_filename,
      this.getFileNameFromPath(documentUrl),
    );
    normalizedItem.imageBytes = Array.isArray(item?.imageBytes) ? item.imageBytes : [];
    normalizedItem.priority = item?.priority ?? item?.isPrimary ?? false;

    return normalizedItem;
  }

  private normalizeResumeList(items: any): ResumeListDataItem[] {
    if (!Array.isArray(items)) {
      return [];
    }

    return items.map(item => this.normalizeResumeListItem(item));
  }

  saveAndDownloadResume(jobRequest : any){

    // let queryUrl = 'http://Workifence.com:8090/api/saveResumeandDownloadResume';

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

    // let queryUrl = 'http://Workifence.com:8090/api/saveResumeandDownloadResume';

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

  dowloadResumeDOC(userName: any, fileName: any) {
    let baseUrl = this.appConstants.BASE_API_URL;
    if (isPlatformBrowser(this.platformId)) {
      baseUrl = '';
    }
    let queryUrl = baseUrl + this.appConstants.DOWNLOAD_RESUME + "?userName=" + userName + "&fileName=" + fileName;

    // Accept header for docx/doc
    const isDocx = fileName.endsWith('.docx');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': isDocx ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/msword',
      'responseType': "arraybuffer"
    });

    return this.httpClient.get(queryUrl, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }

  downloadExternalResume(userName : any, fileName : any){

    // let queryUrl = 'http://Workifence.com:8090/api/saveResumeandDownloadResume';

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
      .pipe(map(item => this.normalizeResumeListItem(item)))
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
      .pipe(map(item => this.normalizeResumeListItem(item)))
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

    return this.http.get<any>(queryUrl).pipe(map(items => this.normalizeResumeList(items)), catchError(this.handleError));
  }

  saveApplication(data : JobApplicationRequest){
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl =  this.localhosturl + this.appConstants.SAVE_JOB_APPLICATION;

    //console.log('postDeal: api call');
    return this.httpClient.post(queryUrl, data)
      .pipe(catchError(this.handleError));
  }

  updateApplication(data : JobApplicationRequest){
    let baseUrl = this.appConstants.BASE_API_URL;
    if(isPlatformBrowser(this.platformId)){
      baseUrl = '';
    }
    let queryUrl = this.localhosturl + this.appConstants.SAVE_JOB_APPLICATION;
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

uploadExternalResume(userName: string, ownerId: string, file: File) {
  let baseUrl = this.appConstants.BASE_API_URL;

  if (isPlatformBrowser(this.platformId)) {
    baseUrl = '';
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('userName', userName);
  formData.append('ownerId', ownerId);

  const url = `${baseUrl}${this.appConstants.UPLOAD_EXTERNAL_RESUME}`;

  return this.httpClient.post(url, formData).pipe(
    catchError(this.handleError)
  );
}


  uploadExternalResumeText(userName: string, ownerId : string, resumeText: string) {
    let baseUrl = this.appConstants.BASE_API_URL;
    if (isPlatformBrowser(this.platformId)) {
      baseUrl = '';
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      userName: userName,
      ownerId: ownerId,
      resumeText: resumeText
    };

    const queryUrl = baseUrl + this.appConstants.UPLOAD_EXTERNAL_RESUME_TEXT;
    return this.httpClient.post(queryUrl, body, { headers: headers })
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
    let queryUrl = this.localhosturl + this.appConstants.GET_ALL_JOB_APPLICATIONS + '/' + ownerId;;
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
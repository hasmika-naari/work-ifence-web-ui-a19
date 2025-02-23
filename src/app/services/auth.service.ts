
import { catchError, retry } from 'rxjs/operators';

import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { throwError } from 'rxjs';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { LoginRequest, PasswordResult, RegisterRequest } from './auth.models';
import { ContactListItem, MessageDTO, PasswordResetFinishRqst, PasswordResetRqst, Profile } from './profile.model';
import { AcademicProfileAddRequest, ActivationCodeRequest, ActivationCodeSubmitRequest, BioProfileAddRequest, 
  CheckUserNameRequest, LoginProfileUpdateRequest } from './signup.model';
import { Address } from './contact.model';
import { HttpWrapperService } from './http-wrapper.service';
import { AppConstantsService } from './app-constants.service';
import { LocalStorageService } from './local-storage.service';
import { isPlatformBrowser } from '@angular/common';



@Injectable({providedIn: 'root'})
export class AuthService {
private actionUrl!: string;
private platformId: object =  inject(PLATFORM_ID);
private http: HttpWrapperService =  inject(HttpWrapperService);

constructor(
private appConstants: AppConstantsService,
private localStorageService: LocalStorageService
) {
}

signInPre(loginRequest: LoginRequest): Observable<any> {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.SIGN_IN_PRE_URL;
return this.http
  .post<any>(url, loginRequest)
  .pipe(catchError(this.handleError));
}

signIn(loginRequest: LoginRequest): Observable<any> {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.SIGN_IN_URL;
return this.http
  .post<any>(url, loginRequest)
  .pipe(catchError(this.handleError));
}

getAccountProfile() {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.ACCOUNT_URL;
// 
console.log('getAccount: api call');
return this.http
  .get<any>(url)
  .pipe(catchError(this.handleError));
}

getLoginProfile(userName:any) {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.GET_LOGIN_PROFILE_URL;
 url = url + '/' + userName;
console.log('getAccount: api call');
return this.http
  .get<any>(url)
  .pipe(catchError(this.handleError));
}



signOut(): Observable<any> {
return this.http
.get<any[]>(this.actionUrl)
.pipe(catchError(this.handleError));
}

doPersistLocalActiveChildProfile(chProfile:Profile): Observable<Profile> {
// 
// this.localStorageService.setItem(
//                               fromAuth.authFeatureKey,
//                               chProfile
//                             );
 return of(chProfile);
}

signUp(signUpRequest: RegisterRequest) {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.SIGNUP_URL;
// 
console.log('signup: api call');
return this.http
  .post<any>(url, signUpRequest)
  .pipe(catchError(this.handleError));
}

checkUserName(userNameCheckRequest: CheckUserNameRequest) {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
    console.log('checkUserName: api call - isPlatformBrowser');
  }else{
    console.log('checkUserName: api call - isPlatformServer');
  }
let url:string = baseUrl + this.appConstants.CHECK_USER_NAME_URL;
// 
console.log('checkUserName: api call');
return this.http
  .post<any>(url, userNameCheckRequest)
  .pipe(catchError(this.handleError));
}

sendMessagetoUser() {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.SEND_MESSAGE_TO_USER_URL + 'teja';
// 
console.log('sendMessagetoUser: api call');
let msg: MessageDTO = new MessageDTO();
  msg.messageContent = 'this is Test User Message';
  msg.from = 'Jana';
  msg.to = 'all';

return this.http
  .post<any>(url, msg)
  .pipe(catchError(this.handleError));
}

sendBroadMessagetoUser() {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.SEND_BROADCAST_MESSAGE_URL;
// 
console.log('sendBroadMessagetoUser: api call');
let msg: MessageDTO = new MessageDTO();
msg.messageContent = 'this is Test Broadcast User Message';
msg.from = 'Jana';
msg.to = 'all';
return this.http
  .post<any>(url, msg)
  .pipe(catchError(this.handleError));
}

saveLoginProfile(loginProfile: LoginProfileUpdateRequest) {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.SAVE_LOGIN_PROFILE_URL + '/' + loginProfile.id;
// 
console.log('saveLoginProfile: api call');
//  let param: CheckUserNameRequest = new CheckUserNameRequest();
// param.username = loginProfile.username;
return this.http
  .put<any>(url, loginProfile)
  .pipe(catchError(this.handleError));
}

patchLoginProfile(loginProfile: LoginProfileUpdateRequest) {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.SAVE_LOGIN_PROFILE_URL + '/' + loginProfile.id;
// 
console.log('saveLoginProfile: api call');
//  let param: CheckUserNameRequest = new CheckUserNameRequest();
// param.username = loginProfile.username;
return this.http
  .patch<any>(url, loginProfile)
  .pipe(catchError(this.handleError));
}


saveContact(contact: ContactListItem) {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.SAVE_LOGIN_PROFILE_URL;
// 
console.log('saveLoginProfile: api call');
//  let param: CheckUserNameRequest = new CheckUserNameRequest();
// param.username = loginProfile.username;
return of(contact);
// return this.http
//   .put<any>(url, loginProfile)
//   .pipe(catchError(this.handleError));
}

removeContact(contact: ContactListItem) {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.SAVE_LOGIN_PROFILE_URL;
// 
console.log('saveLoginProfile: api call');
//  let param: CheckUserNameRequest = new CheckUserNameRequest();
// param.username = loginProfile.username;
return of(contact);
// return this.http
//   .put<any>(url, loginProfile)
//   .pipe(catchError(this.handleError));
}

initiateResetPassword(reset : PasswordResetRqst){
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
  const url = this.appConstants.BASE_API_URL + '/api/wif-reset-password/init';
  return this.http.post<any>(url,reset).pipe(catchError(this.handleError))
}

finishResetPassword(reset : PasswordResetFinishRqst){
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
  const url = this.appConstants.BASE_API_URL + '/api/wif-reset-password/finish';
  return this.http.post<any>(url,reset).pipe(catchError(this.handleError))
}

saveBioProfile(bioProfile: BioProfileAddRequest) {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.SAVE_BIO_PROFILE_URL;
// 
console.log('saveBioProfile: api call');
return this.http
  .post<any>(url, bioProfile)
  .pipe(catchError(this.handleError));
}


updateBioProfile(bioProfile: BioProfileAddRequest) {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.SAVE_BIO_PROFILE_URL + '/' + bioProfile.id;
// 
console.log('UpdateBioProfile: api call');
return this.http
  .put<any>(url, bioProfile)
  .pipe(catchError(this.handleError));
}


getBioProfile(userName: string) {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.GET_BIO_PROFILE_URL;

url = url + '/' + userName;
return this.http
  .get<any>(url)
  .pipe(catchError(this.handleError));
}

getContactList(userId: string) {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.GET_CONTACTS;

url = url + '/' + userId;
return this.http
  .get<any>(url)
  .pipe(catchError(this.handleError));
}


saveAddress(address: Address) {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.SAVE_ADDRESS_URL;
// 
console.log('save Address: api call');

return this.http
  .post<any>(url, address)
  .pipe(catchError(this.handleError));
}


changeEmailVerify(email: string) {
  let baseUrl = this.appConstants.BASE_API_URL;
  // if(isPlatformBrowser(this.platformId)){
  //   baseUrl = '';
  // }
let url:string = baseUrl + this.appConstants.CHANGE_EMAIL_VERIFY_URL;
// 
console.log('save Address: api call');

return this.http
  .post<any>(url, {changeEmail: email})
  .pipe(catchError(this.handleError));
}

changeEmail(email: string, acCode: string) {
  let baseUrl = this.appConstants.BASE_API_URL;
  // if(isPlatformBrowser(this.platformId)){
  //   baseUrl = '';
  // }
let url:string = baseUrl + this.appConstants.CHANGE_EMAIL_URL;
// 
console.log('save Address: api call');

return this.http
  .post<any>(url, {changeEmail: email, activationCode: acCode})
  .pipe(catchError(this.handleError));
}

getAddress(userName: string) {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.GET_ADDRESS_URL+ '/' +userName;
// 
console.log('save Address: api call');

return this.http
  .get<any>(url)
  .pipe(catchError(this.handleError));
}

removeAddress(id: string) {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.REMOVE_ADDRESS_URL+ '/' +id;
// 
console.log('Remove Address: api call');

return this.http
  .delete<any>(url)
  .pipe(catchError(this.handleError));
}


updateAddress(address: Address) {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.SAVE_ADDRESS_URL+ '/' +address.id;
// 
console.log('Update Address: api call');

return this.http
  .put<any>(url, address)
  .pipe(catchError(this.handleError));
}


getStates(country: string) {
 
  let url:string = country === 'USA'? this.appConstants.GET_USA_STATES:this.appConstants.GET_INDIA_STATES;
  console.log('save Address: api call');

  return this.http
    .get<any>(url)
    .pipe(catchError(this.handleError));
}


submitActivationCode(activationCodeSubmitReqest: ActivationCodeSubmitRequest) {
// let activate: CheckUserNameRequest = new CheckUserNameRequest();
let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.SUBMIT_ACTIVATION_CODE_URL;
url = url + '?activationCode=' + activationCodeSubmitReqest.activationCode + '&username=' + activationCodeSubmitReqest.username;
// 
//activate.username = 'jana';

console.log('signup: api call');
return this.http
.post<any>(url, activationCodeSubmitReqest)
.pipe(catchError(this.handleError));
}

getActivationCode(activationCodeReqest: ActivationCodeRequest) {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.GET_ACTIVATION_CODE_URL;
url = url + '?emailId='+activationCodeReqest.emailId + '&username=' + activationCodeReqest.username;
console.log('signup: api call');
return this.http
  .post<any>(url, activationCodeReqest)
  .pipe(catchError(this.handleError));
}

getPassword(passwordReqest: PasswordResult) {
  let baseUrl = this.appConstants.BASE_API_URL;
  if(isPlatformBrowser(this.platformId)){
    baseUrl = '';
  }
let url:string = baseUrl + this.appConstants.GET_PASSWORD_URL;
// 
console.log('Get Password: api call');
return this.http
  .post<any>(url, passwordReqest)
  .pipe(catchError(this.handleError));
}

uploadFile(file: File) {
// let url:string = 'https://97.74.93.142:8443/api/aws-s3-upload?path=test';
let url:string = '/api/aws-s3-upload?path=test';
// let url:string = 'http://132.148.79.209:8090/api/aws-s3-upload?path=test';
// 
console.log('uploadFile: api call');
return this.http
  .post<any>(url, file)
  .pipe(catchError(this.handleError));
}

private handleError(error: HttpErrorResponse): Observable<never> {
// alert('api: Error' + error.error);
return throwError(error || 'Server error');
}

refreshToken() {
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  return this.http.post(this.appConstants.BASE_API_URL + 'refreshtoken', { });

}

}

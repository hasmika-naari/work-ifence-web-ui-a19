import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, retry } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
// import * as AWS from 'aws-sdk/global';
// import * as S3 from 'aws-sdk/clients/s3';
import { AppConstantsService } from '../app-constants.service';


@Injectable({providedIn: 'root'})
export class UploadService {

  public fileName: string = '';

  constructor(
    private httpClient: HttpClient,
    private appConstants: AppConstantsService,
  ) {
  }

  
  uploadImages(fileName: string, file: any, username : any, resume : any ){
  //   const contentType = file.type;
  //   const bucket = new S3(
  //   );
  //   let params : any= {
  //       Bucket: 'wifencedeals',
  //       Key:  username + '/' + resume + '/' + fileName,
  //       Body: file,
  //       ACL: 'public-read',
  //       ContentType: contentType
  //       };
    
  //   bucket.upload(params).on('httpUploadProgress', function (evt: any) {
  //     console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
  //     }).send(function (err: any, data: any) {
  //     if (err) {
  //         console.log('There was an error uploading your file: ', err);
  //         return false;
  //     }
  //     console.log('Successfully uploaded file.', data);
  //     return true;
  // })
  }

  dowloadFile(key : any){
    // const contentType = file.type;
    // 
    // );
    // let params = {
    //     Bucket: 'wifencedeals',
    //     Key: key,
    //     };

    // bucket.getObject(params , (err: any, data : S3.GetObjectOutput)=>{
    //   if(data){
    //     let binaryData:any = []
    //     binaryData.push(data.Body);
    //     let downloadLink = document.createElement('a');
    //     downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type : "application/octet-stream"}));
    //     let urlSplit = key.split('/');
    //     let filename = urlSplit[urlSplit.length -1];
    //     downloadLink.setAttribute('download', filename);
    //     document.body.appendChild(downloadLink);
    //     downloadLink.click();
    //   }
    //   if(err){
    //     console.log(err);
    //   }
    // })
  }

  deleteFile(key : any){
    // const bucket = new S3(
    // );
    // let params = {
    //   Bucket: 'wifencedeals',
    //   Key: key,
    //   };
    // bucket.deleteObject(params, function(err: any, data: any){
    //   console.log(data);
    //   console.log(err);
    // })
  }

  private handleError(error: any): Observable<never> {
    console.log('Get Playlist API: Error');
    return throwError(error || 'Get Playlist API: Error');
  }
}

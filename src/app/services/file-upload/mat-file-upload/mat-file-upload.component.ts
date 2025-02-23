import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import { ReplaySubject, BehaviorSubject, Subscription, Observable, throwError } from "rxjs";
import {
  HttpHeaders,
  HttpParams,
  HttpClient,
  HttpEventType,
  HttpErrorResponse,
  HttpResponse,
  HttpEvent,
} from "@angular/common/http";
import { MatFileUploadQueueService } from "../mat-file-upload-queue/mat-file-upload-queue.service";
import { IUploadProgress } from "../mat-file-upload.type";
import { times } from "lodash";
import { catchError, map, retry, tap } from "rxjs/operators";
import { UploadService } from "../upload.service";
import { CommonModule } from "@angular/common";
import { BytesPipe } from "../bytes/bytes.pipe";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "mat-file-upload",
    standalone: true,
      imports: [
          CommonModule, BytesPipe, MatProgressBarModule,
          MatIconModule, MatCardModule
      ],
  templateUrl: "./mat-file-upload.component.html",
  styleUrls: ["./mat-file-upload.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatFileUploadComponent implements OnInit, OnDestroy, OnChanges {
  private uploadProgressSubject = new ReplaySubject<IUploadProgress>();
  uploadProgress$ = this.uploadProgressSubject.asObservable();
  uploadProgress: any;
  private uploadInProgressSubject = new BehaviorSubject<boolean>(false);
  uploadInProgress$ = this.uploadInProgressSubject.asObservable();

  public subs = new Subscription();

  /* Http request input bindings */
  @Input()
  httpUrl: string = '';

  @Input()
  uploadWhat : string = '';

  @Input()
  httpRequestHeaders:
    HttpHeaders |
    {
      [header: string]: any | any[];
    } | undefined;

  @Input()
  httpRequestParams:
    HttpParams |
    {
      [param: string]: string | string[];
    } | undefined;

  @Input()
  fileAlias: string = '';

  private _file: any;
  private _id: number = 0;
  private _userName : string = "";
  private _resume : any = "";

  @Input()
  get file(): any {
    return this._file;
  }
  set file(file: any) {
    this._file = file;
  }

  @Input()
  set id(id: number) {
    this._id = id;
  }
  get id(): number {
    return this._id;
  }

  @Input()
  set resume(resume: any) {
    this._resume = resume;
  }
  get resume(): any {
    return this._resume;
  }

  @Input()
  set userName(userName: string) {
    this._userName = userName;
  }
  get userName(): string {
    return this._userName;
  }

  @Input()
  fileUploadAriaLabel: string = "File Upload";

  @Input()
  cancelAriaLabel: string = "Cancel File Upload";

  @Input()
  clearOnUpload = false;

  
  @Input()
  fileName = '';
  
  
  /** Output  */
  @Output() removeEvent = new EventEmitter<MatFileUploadComponent>();
  @Output() onUpload = new EventEmitter();

  private fileUploadSubscription: any;

  constructor(
    private httpClient: HttpClient,
    private matFileUploadQueueService: MatFileUploadQueueService,
    private uploadService: UploadService,
  ) {
    const queueInput = this.matFileUploadQueueService.getInputValue();
    
    if (queueInput) {
      this.httpUrl = this.httpUrl || queueInput.httpUrl;
      this.httpRequestHeaders =
        this.httpRequestHeaders || queueInput.httpRequestHeaders;
      this.httpRequestParams =
        this.httpRequestParams || queueInput.httpRequestParams;
      this.fileAlias = this.fileAlias || queueInput.fileAlias;
    }

    this.uploadInProgress$.subscribe(p => {
      this.uploadProgress = p;
    })
  }

  ngOnInit() {
    this.uploadProgressSubject.next({
      progressPercentage: 0,
      loaded: 0,
      total: this._file.size,
    });
  }

  ngOnChanges(changes: any){
    
    if(changes["file"]){
      this.upload();
    }
    console.log('Child Profile: Input Changed');
  }

  public upload(): void {
    this.uploadInProgressSubject.next(true);
    // How to set the alias?
    let fileExt = this._file.name.toString().split('.');
    let mis = Math.floor(new Date().valueOf() * Math.random());
    // this.httpRequestHeaders = this.httpRequestHeaders.append('filename', this.fileName + '.' +fileExt[fileExt.length -1]);
    this.httpRequestHeaders = this.httpRequestHeaders?.append('filename', this.fileName + '_'  + mis + '_' + this._file.name);
    let fName = this.fileName + '_'  + mis + '_' + this._file.name;
    // let fName = this.fileName + '.' +fileExt[fileExt.length -1];
    let formData = new FormData();
    formData.set(this.fileAlias, this._file, this._file.name);
    this.uploadService.fileName = fName;
    ////////////////////////
   this.uploadService.uploadImages(fName, this._file, this._userName, this._resume)
   this.onUpload.emit({ file: this._file, event: event, timeStamp: mis, fileName : fName, fileRealName : this._file.name});
   if(this.clearOnUpload){
            setTimeout(() => {
              this.removeEvent.emit(this);
            }, 1000)
          }
    //  .subscribe(
    //     (event: any) => {
    //       // if (event.type === HttpEventType.UploadProgress) {
    //       //   this.uploadProgressSubject.next({
    //       //     progressPercentage: Math.floor(
    //       //       (event.loaded * 100) / event.total
    //       //     ),
    //       //     loaded: event.loaded,
    //       //     total: event.total,
    //       //   });
    //       // }
         
    //       this.onUpload.emit({ file: this._file, event: event, timeStamp: mis });
    //       if(this.clearOnUpload){
    //         setTimeout(() => {
    //           this.removeEvent.emit(this);
    //         }, 1000)
    //       }
    //     },
    //     (error: any) => {
    //             if (this.fileUploadSubscription) {
    //               this.fileUploadSubscription.unsubscribe();
    //             }
    //             this.uploadInProgressSubject.next(false);
    //             this.onUpload.emit({ file: this._file, event: event, timeStamp: mis });
    //             if(this.clearOnUpload){
    //               this.remove();
    //             }
    //     });


    //////////////////////////
    // this.subs.add(
    //   this.httpClient.post(this.httpUrl, formData, {
    //     headers: this.httpRequestHeaders,
    //     observe: "events",
    //     params: this.httpRequestParams,
    //     reportProgress: true,
    //     responseType: "json",
    //   }).subscribe(
    //     (event: any) => {
    //       if (event.type === HttpEventType.UploadProgress) {
    //         this.uploadProgressSubject.next({
    //           progressPercentage: Math.floor(
    //             (event.loaded * 100) / event.total
    //           ),
    //           loaded: event.loaded,
    //           total: event.total,
    //         });
    //       }
         
    //       this.onUpload.emit({ file: this._file, event: event, timeStamp: mis });
    //       if(this.clearOnUpload){
    //         setTimeout(() => {
    //           this.removeEvent.emit(this);
    //         }, 1000)
    //       }
    //     },
    //     (error: any) => {
    //       if (this.fileUploadSubscription) {
    //         this.fileUploadSubscription.unsubscribe();
    //       }
    //       this.uploadInProgressSubject.next(false);
    //       this.onUpload.emit({ file: this._file, event: event, timeStamp: mis });
    //       if(this.clearOnUpload){
    //         this.remove();
    //       }
    //     },
    //     () => this.uploadInProgressSubject.next(false)
    //   )
    // );
  }

  public remove(): void {
    this.subs.unsubscribe();
    this.removeEvent.emit(this);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}

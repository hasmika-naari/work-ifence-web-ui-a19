import { NgModule } from "@angular/core";
import { BytesPipe } from "./bytes/bytes.pipe";
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from "@angular/common";
import { MatFileUploadQueueComponent } from "./mat-file-upload-queue/mat-file-upload-queue.component";
import { MatFileUploadComponent } from "./mat-file-upload/mat-file-upload.component";
import { FileUploadInputForDirective } from "./file-upload-input-for/file-upload-input-for.directive";
import { UploadService } from "./upload.service";
import { MatFileUploadQueueService } from "./mat-file-upload-queue/mat-file-upload-queue.service";

@NgModule({
  imports: [
    MatProgressBarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    BytesPipe,
    MatFileUploadQueueComponent,
    MatFileUploadComponent,
    FileUploadInputForDirective,
  ],
  declarations: [
   
  ],
  exports: [
    BytesPipe,
    MatFileUploadQueueComponent,
    MatFileUploadComponent,
    FileUploadInputForDirective,
  ],
  providers:[
    MatFileUploadQueueService
  ]
})
export class MatFileUploadModule {}

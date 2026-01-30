import { Component, inject, OnInit, Optional, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ResumeService } from '../../../services/resume.service';
import { Account } from 'src/app/services/profile.model';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Resume } from 'src/app/services/resume.model';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

export interface ImportResumeResult {
  type: 'file' | 'text' | 'cancel' | 'success';
  payload?: File | string;
}

@Component({
  selector: 'app-import-resume-modal',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  templateUrl: './import-resume-modal.component.html',
  styleUrls: ['./import-resume-modal.component.scss']
})
export class ImportResumeModalComponent implements OnInit {
  activeTab: 'file' | 'text' = 'file';
  selectedFile: File | null = null;
  pastedText = '';
  isDragging = false;
  isLoading = false;
  userName = '';
  ownerId = '';
  private userStore: UserStoreService = inject(UserStoreService);
  userAccount: Signal<Account> = this.userStore.getUserAccount();

  constructor(
    public dialogRef: MatDialogRef<ImportResumeModalComponent>,
    private resumeService: ResumeService,
    private router : Router,
    private snackBar: MatSnackBar,
    @Optional() public messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Get current user - adjust based on your auth service
    // For now using a placeholder
    this.userName = this.userAccount().login;
    this.ownerId = this.userAccount().id;
    // Disable close on backdrop click when loading
    this.dialogRef.disableClose = false;
  }

  /**
   * Switch between tabs
   */
  selectTab(tab: 'file' | 'text'): void {
    this.activeTab = tab;
  }

  /**
   * Close dialog with cancel result
   */
  closeDialog(): void {
    this.dialogRef.close({ type: 'cancel' });
  }

  /**
   * Handle file selection from input
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.validateAndProcessFile(this.selectedFile);
    }
  }

  /**
   * Handle drag over event
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  /**
   * Handle drag leave event
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  /**
   * Handle file drop
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
      this.validateAndProcessFile(this.selectedFile);
    }
  }

  /**
   * Validate and process the selected file
   */
  private validateAndProcessFile(file: File): void {
    const validExtensions = ['.pdf', '.docx', '.png', '.jpeg', '.jpg'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      alert('Invalid file type. Please select a valid resume file (.pdf, .docx, .png, .jpeg, .jpg)');
      this.selectedFile = null;
      return;
    }

    // Automatically upload the file after validation
    this.uploadFile();
  }

  /**
   * Upload the selected file
   */
  private uploadFile(): void {
    if (!this.selectedFile) {
      return;
    }

    this.isLoading = true;
    this.dialogRef.disableClose = true;

    this.resumeService.uploadExternalResume(this.userName, this.ownerId,this.selectedFile)
      .subscribe({
        next: (response : any) => {
          // console.log(response);
          let resume = JSON.parse(response?.resume?.resumeJson);
          console.log("AI Response --------------->", resume);
          this.userStore.setResumeForm(resume);
          this.userStore.updateSelectedResumeListItem(response?.resume);
          this.userStore.setIsChangeInNewResume(false);
          this.router.navigateByUrl('/user/resumes/resume');
          this.isLoading = false;
          this.dialogRef.close({
            type: 'success',
            payload: response
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.dialogRef.disableClose = false;
          
          // Log the error for debugging
          console.error('Resume upload failed:', error);
          
          let errorMessage = 'Failed to upload resume. Please try again.';
          
          // Differentiate based on HTTP status codes
          if (error.status === 400) {
            // Extract backend error message for 400 Bad Request
            errorMessage = error.error?.message || error.error?.error || 'Invalid resume data. Please check your file and try again.';
          } else if (error.status === 401) {
            errorMessage = 'Authentication failed. Please log in again.';
          } else if (error.status === 403) {
            errorMessage = 'You do not have permission to upload resumes.';
          } else if (error.status === 404) {
            errorMessage = 'Resume upload service not found. Please contact support.';
          } else if (error.status === 409) {
            errorMessage = 'A resume with this information already exists.';
          } else if (error.status >= 500) {
            // Generic message for server errors (do not expose backend details)
            errorMessage = 'Server error occurred. Please try again later.';
          } else if (error.status >= 400 && error.status < 500) {
            // Generic message for other client errors
            errorMessage = 'Unable to process your request. Please check your input and try again.';
          }
          
          // Display error message in Toast notification
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  /**
   * Trigger file input click
   */
  triggerFileInput(): void {
    const fileInput = document.getElementById('resumeFileInput') as HTMLInputElement;
    fileInput?.click();
  }

  /**
   * Handle text paste and import
   */
  onTextImport(): void {
    if (!this.pastedText.trim()) {
      return;
    }

    this.isLoading = true;
    this.dialogRef.disableClose = true;

    this.resumeService.uploadExternalResumeText(this.userName, this.ownerId,this.pastedText.trim())
      .subscribe({
        next: (response : any) => {
          // console.log(response);
          let resume = JSON.parse(response?.resume?.resumeJson);
          console.log("AI Response --------------->", resume);
          this.userStore.setResumeForm(resume);
          this.userStore.updateSelectedResumeListItem(response?.resume);
          this.userStore.setIsChangeInNewResume(false);
          this.router.navigateByUrl('/user/resumes/resume');
          this.isLoading = false;
          this.dialogRef.close({
            type: 'success',
            payload: response
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.dialogRef.disableClose = false;
          
          // Log the error for debugging
          console.error('Resume upload failed:', error);
          
          let errorMessage = 'Failed to upload resume. Please try again.';
          
          // Differentiate based on HTTP status codes
          if (error.status === 400) {
            // Extract backend error message for 400 Bad Request
            errorMessage = error.error?.message || error.error?.error || 'Invalid resume data. Please check your file and try again.';
          } else if (error.status === 401) {
            errorMessage = 'Authentication failed. Please log in again.';
          } else if (error.status === 403) {
            errorMessage = 'You do not have permission to upload resumes.';
          } else if (error.status === 404) {
            errorMessage = 'Resume upload service not found. Please contact support.';
          } else if (error.status === 409) {
            errorMessage = 'A resume with this information already exists.';
          } else if (error.status >= 500) {
            // Generic message for server errors (do not expose backend details)
            errorMessage = 'Server error occurred. Please try again later.';
          } else if (error.status >= 400 && error.status < 500) {
            // Generic message for other client errors
            errorMessage = 'Unable to process your request. Please check your input and try again.';
          }
          
          // Display error message in Toast notification
          this.openSnackBar(errorMessage, 'Close');
        }
      });
  }

  /**
   * Handle upgrade click
   */
  onUpgradeClick(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    console.log('Upgrade clicked');
    // TODO: Navigate to upgrade page
  }

    openSnackBar(message: string, action: string = '') {
    // Deprecated: use showToast instead
    this.showToast('error', action || 'Info', message);
  }

  showToast(severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string) {
    if (this.messageService) {
      this.messageService.add({
        key: 'global',
        severity,
        summary,
        detail,
        life: 5000
      });
    }
  }

}

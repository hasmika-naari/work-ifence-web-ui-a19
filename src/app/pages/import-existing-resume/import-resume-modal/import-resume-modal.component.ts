import { Component, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ResumeService } from '../../../services/resume.service';
import { Account } from 'src/app/services/profile.model';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Resume } from 'src/app/services/resume.model';
import { Router } from '@angular/router';

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
    MatProgressBarModule
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
    private router : Router
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
  }

  /**
   * Upload the selected file
   */
  onFileUpload(): void {
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
          alert('Failed to upload resume. Please try again.');
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

    this.resumeService.uploadExternalResumeText(this.userName, this.pastedText.trim())
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.dialogRef.close({
            type: 'success',
            payload: response
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.dialogRef.disableClose = false;
          alert('Failed to upload resume text. Please try again.');
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
}

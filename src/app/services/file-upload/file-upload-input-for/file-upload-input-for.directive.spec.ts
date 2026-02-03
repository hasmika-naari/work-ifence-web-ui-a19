import { waitForAsync, TestBed } from "@angular/core/testing";

import { BehaviorSubject } from "rxjs";
import { IInput } from "../mat-file-upload.type";
import { CommonModule } from "@angular/common";

import { FileUploadInputForDirective } from "./file-upload-input-for.directive";
import { Component } from "@angular/core";
@Component({
  standalone: false,
  template: ` <div
    [fileUploadInputFor]="fileUploadQueue"
    class="upload-drop-zone"
  >
    Just drag and drop files here
  </div>`,
})
class FileDropComponent {
  fileUploadQueue = { add: () => undefined };
}
export class StubMatFileUploadQueueService {
  inputValueSubject = new BehaviorSubject<IInput | null>(null);
  inputValue$ = this.inputValueSubject.asObservable();

  initialize(input: IInput) {
    this.inputValueSubject.next(input);
  }

  getInputValue() {
    return this.inputValueSubject.getValue();
  }
}

export class StubFile {
  name = "testName";
  size = 1024;
}

describe("FileUploadInputForDirective", () => {
  let component: FileDropComponent;
  let fixture;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FileUploadInputForDirective],
      declarations: [FileDropComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FileDropComponent);
    component = fixture.componentInstance;
  }));

  describe("", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });
  });
});

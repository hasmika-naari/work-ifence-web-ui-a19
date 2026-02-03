import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { MatFileUploadQueueComponent } from "./mat-file-upload-queue.component";
import { CommonModule } from "@angular/common";

describe("MatFileUploadQueueComponent", () => {
  let component: MatFileUploadQueueComponent;
  let fixture: ComponentFixture<MatFileUploadQueueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatFileUploadQueueComponent,
        CommonModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatFileUploadQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should add file", () => {
    expect(component.files).toEqual([]);
    component.add(new Blob());
    expect(component.files.length).toBe(1);
  });

  it("should add more file", () => {
    expect(component.files).toEqual([]);
    component.isMultiple = true;
    component.add(new Blob());
    component.add(new Blob());
    component.add(new Blob());
    expect(component.files.length).toBe(3);
  });

  it("should remove all files", () => {
    expect(component.files).toEqual([]);
    component.isMultiple = true;
    component.add(new Blob());
    component.add(new Blob());
    component.add(new Blob());
    expect(component.files.length).toBe(3);
    component.removeAll();
    expect(component.files).toEqual([]);
  });
});

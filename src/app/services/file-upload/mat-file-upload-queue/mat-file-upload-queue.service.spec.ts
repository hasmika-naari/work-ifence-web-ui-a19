import { TestBed, waitForAsync } from "@angular/core/testing";

import { MatFileUploadQueueService } from "./mat-file-upload-queue.service";

describe("MatFileUploadQueueService", () => {
  let service: MatFileUploadQueueService;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [MatFileUploadQueueService],
    }).compileComponents();
    service = TestBed.inject(MatFileUploadQueueService);
  }));

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should initialize", () => {
    expect(service.getInputValue()).toBe('');
    service.initialize({
      fileAlias: "test",
      httpRequestHeaders: {},
      httpRequestParams: {},
      httpUrl: "test",
    });
    expect(service.getInputValue()).toEqual({
      fileAlias: "test",
      httpRequestHeaders: {},
      httpRequestParams: {},
      httpUrl: "test",
    });
  });
});

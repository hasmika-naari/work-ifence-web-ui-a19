import { TestBed } from '@angular/core/testing';

import { LeadConversationsService } from './lead-conversations.service';

describe('LeadConversationsService', () => {
  let service: LeadConversationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadConversationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

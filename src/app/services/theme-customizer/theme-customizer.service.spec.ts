import { TestBed } from '@angular/core/testing';

import { ThemeCustomizerService } from './theme-customizer.service';

describe('ThemeCustomizerService', () => {
	let service: ThemeCustomizerService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ThemeCustomizerService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
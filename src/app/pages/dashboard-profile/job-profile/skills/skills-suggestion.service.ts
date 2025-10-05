import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { Observable, catchError, map, of, shareReplay, startWith, timeout } from 'rxjs';

const SKILLS_DATA_PATH = 'assets/data/skills-suggestions.json';
const FALLBACK_SUGGESTIONS: string[] = [
  'Agile Coaching',
  'AI Prompt Engineering',
  'Angular',
  'API Design',
  'AWS Architecture',
  'Azure DevOps',
  'Business Analysis',
  'CI/CD Pipelines',
  'Cloud Security',
  'Communication Skills',
  'Data Engineering',
  'Database Administration',
  'DevOps',
  'Docker',
  'Frontend Architecture',
  'GraphQL',
  'Java Development',
  'Kubernetes',
  'Machine Learning',
  'Microservices',
  'Node.js',
  'Product Management',
  'React',
  'REST API Design',
  'System Design',
  'Team Leadership',
  'Test Automation',
  'TypeScript',
  'UI/UX Design'
];

@Injectable({ providedIn: 'root' })
export class SkillsSuggestionService {
  private cache$?: Observable<string[]>;
  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object,
    @Optional() @Inject(DOCUMENT) private readonly document: Document | null
  ) {}

  getSkillSuggestions(): Observable<string[]> {
    if (!this.cache$) {
      if (!isPlatformBrowser(this.platformId)) {
        this.cache$ = of(FALLBACK_SUGGESTIONS);
      } else {
        const requestUrl = this.resolveRequestUrl();

        this.cache$ = this.http.get<unknown>(requestUrl).pipe(
          timeout({ first: 4000 }),
          map((response) => this.normalizeSuggestions(response)),
          catchError((error) => {
            console.error('Failed to load skill suggestions, using fallback data.', error);
            return of(FALLBACK_SUGGESTIONS);
          }),
          startWith(FALLBACK_SUGGESTIONS),
          shareReplay({ bufferSize: 1, refCount: true })
        );
      }
    }
    return this.cache$;
  }

  private resolveRequestUrl(): string {
    const baseHref = this.document?.baseURI ?? (typeof window !== 'undefined' ? window.location.origin + '/' : '/');
    try {
      return new URL(SKILLS_DATA_PATH, baseHref).toString();
    } catch {
      return SKILLS_DATA_PATH.startsWith('/') ? SKILLS_DATA_PATH : `/${SKILLS_DATA_PATH}`;
    }
  }

  private normalizeSuggestions(source: unknown): string[] {
    if (!Array.isArray(source)) {
      return [...FALLBACK_SUGGESTIONS];
    }

    const suggestions = source
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item) => !!item);

    return suggestions.length ? suggestions : [...FALLBACK_SUGGESTIONS];
  }
}

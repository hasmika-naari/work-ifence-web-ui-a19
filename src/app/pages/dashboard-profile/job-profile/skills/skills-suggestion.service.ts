import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

const SKILLS_DATA_PATH = 'assets/data/skills-suggestions.json';

@Injectable({ providedIn: 'root' })
export class SkillsSuggestionService {
  private cache$?: Observable<string[]>;

  constructor(private readonly http: HttpClient) {}

  getSkillSuggestions(): Observable<string[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<string[]>(SKILLS_DATA_PATH).pipe(shareReplay(1));
    }
    return this.cache$;
  }
}

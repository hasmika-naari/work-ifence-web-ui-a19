import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ResumeShareApiService } from '../../services/resume-share-api.service';
import { PublicResumeDto } from '../../models/resume-share.model';

type ViewState = 'loading' | 'ready' | 'notFound' | 'revoked' | 'error';

interface RenderSection {
  label: string;
  /** Either a paragraph of text or a list of lines. */
  text?: string;
  items?: string[];
}

/**
 * R1-E1 public, read-only resume view served at /r/:token. Unauthenticated.
 * Resolves the token via the public ext endpoint and renders a generic, presentable
 * read-only layout. Distinguishes 404 (unknown token) from 410 (revoked/expired) so the
 * viewer gets an honest message rather than a generic error.
 */
@Component({
  selector: 'app-public-resume-view',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="public-resume">
      <ng-container [ngSwitch]="state()">
        <div *ngSwitchCase="'loading'" class="pr-status" data-testid="pr-loading">
          <span class="spinner"></span> Loading résumé…
        </div>

        <div *ngSwitchCase="'notFound'" class="pr-status pr-error" data-testid="pr-not-found">
          <h2>Résumé not found</h2>
          <p>This link doesn’t point to a résumé. Please double-check the URL.</p>
        </div>

        <div *ngSwitchCase="'revoked'" class="pr-status pr-error" data-testid="pr-revoked">
          <h2>This link is no longer active</h2>
          <p>The owner has revoked this share link or it has expired.</p>
        </div>

        <div *ngSwitchCase="'error'" class="pr-status pr-error" data-testid="pr-error">
          <h2>Something went wrong</h2>
          <p>We couldn’t load this résumé right now. Please try again later.</p>
        </div>

        <article *ngSwitchCase="'ready'" class="pr-doc" data-testid="pr-ready">
          <header class="pr-head">
            <h1>{{ resume()?.title || 'Résumé' }}</h1>
            <span *ngIf="resume()?.tags as tags" class="pr-tags">{{ tags }}</span>
          </header>

          <section *ngFor="let s of sections()" class="pr-section">
            <h3>{{ s.label }}</h3>
            <p *ngIf="s.text" class="pr-text">{{ s.text }}</p>
            <ul *ngIf="s.items?.length">
              <li *ngFor="let it of s.items">{{ it }}</li>
            </ul>
          </section>

          <p *ngIf="!sections().length" class="pr-empty">This résumé has no public content.</p>

          <footer class="pr-foot">Read-only · shared via WorkIfence</footer>
        </article>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .public-resume { max-width: 820px; margin: 0 auto; padding: 24px 16px; }
      .pr-status { text-align: center; padding: 48px 16px; color: #555; }
      .pr-error h2 { margin-bottom: 8px; }
      .pr-doc { background: #fff; border: 1px solid #e6e6e6; border-radius: 10px; padding: 32px; }
      .pr-head { border-bottom: 2px solid #1565c0; padding-bottom: 12px; margin-bottom: 20px; }
      .pr-head h1 { margin: 0; font-size: 1.8rem; }
      .pr-tags { display: inline-block; margin-top: 6px; color: #777; font-size: 0.85rem; }
      .pr-section { margin-bottom: 18px; }
      .pr-section h3 { font-size: 1.05rem; color: #1565c0; margin: 0 0 6px; text-transform: capitalize; }
      .pr-text { white-space: pre-wrap; margin: 0; }
      .pr-section ul { margin: 0; padding-left: 18px; }
      .pr-empty { color: #999; font-style: italic; }
      .pr-foot { margin-top: 28px; padding-top: 12px; border-top: 1px solid #eee; color: #aaa; font-size: 0.8rem; text-align: center; }
      .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid #ccc; border-top-color: #1565c0; border-radius: 50%; animation: pr-spin 0.8s linear infinite; vertical-align: middle; }
      @keyframes pr-spin { to { transform: rotate(360deg); } }
    `,
  ],
})
export class PublicResumeViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ResumeShareApiService);

  readonly state = signal<ViewState>('loading');
  readonly resume = signal<PublicResumeDto | null>(null);
  readonly sections = signal<RenderSection[]>([]);

  ngOnInit(): void {
    const token = (this.route.snapshot.paramMap.get('token') ?? '').trim();
    if (!token) {
      this.state.set('notFound');
      return;
    }
    this.api.getPublicResume(token).subscribe({
      next: (dto) => {
        this.resume.set(dto);
        this.sections.set(this.buildSections(dto?.resumeJson));
        this.state.set('ready');
      },
      error: (err: HttpErrorResponse) => {
        if (err?.status === 404) this.state.set('notFound');
        else if (err?.status === 410) this.state.set('revoked');
        else this.state.set('error');
      },
    });
  }

  /** Best-effort generic renderer: parse resumeJson and flatten top-level entries into sections. */
  private buildSections(resumeJson?: string): RenderSection[] {
    if (!resumeJson) return [];
    let parsed: unknown;
    try {
      parsed = JSON.parse(resumeJson);
    } catch {
      return [{ label: 'Content', text: resumeJson }];
    }
    if (parsed == null || typeof parsed !== 'object') {
      return [{ label: 'Content', text: String(parsed) }];
    }
    const sections: RenderSection[] = [];
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      const label = this.humanize(key);
      if (value == null || value === '') continue;
      if (Array.isArray(value)) {
        const items = value.map((v) => this.toLine(v)).filter((l) => l.length > 0);
        if (items.length) sections.push({ label, items });
      } else if (typeof value === 'object') {
        const items = Object.entries(value as Record<string, unknown>)
          .map(([k, v]) => `${this.humanize(k)}: ${this.toLine(v)}`)
          .filter((l) => !l.endsWith(': '));
        if (items.length) sections.push({ label, items });
      } else {
        sections.push({ label, text: String(value) });
      }
    }
    return sections;
  }

  private toLine(value: unknown): string {
    if (value == null) return '';
    if (typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v != null && v !== '')
        .map(([k, v]) => `${this.humanize(k)}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
        .join(' · ');
    }
    return String(value);
  }

  private humanize(key: string): string {
    return key
      .replace(/[_-]+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

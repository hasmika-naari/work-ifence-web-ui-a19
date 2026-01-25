import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { HeaderWorkIfenceComponent } from 'src/app/pages/landing/header-wifence/header-wifence.component';
import { FooterWorkifenceComponent } from 'src/app/pages/landing/footer-wifence/footer-wifence.component';
import { IconsModule } from 'src/app/shared/icons.module';
import { LockedOverlayComponent } from 'src/app/shared/components/locked-overlay/locked-overlay.component';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { PortalTemplate, ResumePortalStore } from '../store/resume-portal.store';
import { TemplatePreviewDialogComponent } from '../components/template-preview-dialog.component';
import { ResumeTemplateVm } from '../models/resume-template.model';
import { ResumeLimitService } from '../services/resume-limit.service';
import { TemplateAccessService } from '../services/template-access.service';

@Component({
  selector: 'app-resume-template-gallery-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IconsModule,
    HeaderWorkIfenceComponent,
    FooterWorkifenceComponent,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatSidenavModule,
    LockedOverlayComponent,
  ],
  template: `
    <div class="course-central-wrapper">
      <div class="course-area" [class.dark-course-area]="themeService.isDark()">
        <mat-sidenav-container class="dashboard-container">
          <mat-sidenav-content class="main-content" #pageSection (scroll)="onPageScroll($event)">
            <div #sentinel style="position: absolute; top: 0; height: 1px; width: 1px;"></div>
            <div class="course-header" [class.course-header-sticky]="isSticky">
              <app-header-wifence [isSticky]="isSticky"></app-header-wifence>
            </div>

            <div class="content-max">
              <div class="story-content">
                <div class="rp-layout">
                  <!-- Navigation buttons (match Course Central) -->
                  <div class="modern-title-section" style="padding-left: 0; padding-top: 0;">
                    <div class="title-wrapper" style="gap: 15px;">
                      <div class="navigation-buttons" style="padding: 0 0 12px 0; gap: 0; display: flex; flex-wrap: wrap;">
                        <a
                          class="nav-button home-button"
                          [routerLink]="['/']"
                          style="margin-right: 8px; position: relative; display: flex; align-items: center; font-size: clamp(12px, 3vw, 14px);">
                          <lucide-icon name="home"></lucide-icon>
                          Home
                          <span style="display: inline-block; margin-left: 8px; color: rgba(var(--mainColor-rgb, 67, 83, 255), 0.3); font-weight: 300;">|</span>
                        </a>
                        <a
                          class="nav-button back-button"
                          (click)="goBack($event)"
                          style="margin-left: 8px; margin-right: 8px; position: relative; display: flex; align-items: center; font-size: clamp(12px, 3vw, 14px);">
                          <lucide-icon name="undo2"></lucide-icon>
                          Back
                          <span style="display: inline-block; margin-left: 8px; color: rgba(var(--mainColor-rgb, 67, 83, 255), 0.3); font-weight: 300;">|</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <section class="rp-hero" aria-label="Resume creation steps">
                    <h1 class="rp-hero-title">Start building your resume.</h1>
                    <div class="rp-hero-sub">Select a template, customize it, then download.</div>

                    <div class="rp-flow" aria-label="Resume creation flow">
                      <div class="rp-step">
                        <div class="rp-step-badge" aria-hidden="true">1</div>
                        <div class="rp-step-body">
                          <div class="rp-step-title">Select Template</div>
                          <div class="rp-step-sub">Choose a design you like</div>
                          <div class="rp-step-detail">Browse categories, preview layouts, then pick a Free or Premium template.</div>
                        </div>
                      </div>

                      <div class="rp-step rp-step-middle">
                        <div class="rp-step-badge" aria-hidden="true">2</div>
                        <div class="rp-step-body">
                          <div class="rp-step-title">Update</div>
                          <div class="rp-step-sub">Edit & personalize details</div>
                          <div class="rp-step-detail">Add your contact info, summary, experience, education, and skills — tailor it to the job.</div>
                        </div>
                      </div>

                      <div class="rp-step">
                        <div class="rp-step-badge" aria-hidden="true">3</div>
                        <div class="rp-step-body">
                          <div class="rp-step-title">Download</div>
                          <div class="rp-step-sub">Export & share anywhere</div>
                          <div class="rp-step-detail">Download a clean PDF, share it, and come back anytime to edit or update.</div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section #templatesSection class="rp-section" aria-label="Resume templates">
                    <div class="rp-sticky">
                      <div class="rp-toolbar-top">
                        <div>
                          <h2 class="rp-heading">Resume Templates</h2>
                          <div class="rp-message">Choose the template to create resume.</div>
                        </div>

                        <button
                          mat-flat-button
                          color="primary"
                          type="button"
                          class="rp-upload"
                          (click)="uploadResume()">
                          <mat-icon aria-hidden="true">upload_file</mat-icon>
                          Upload Resume
                        </button>
                      </div>

                      <mat-chip-listbox
                        class="rp-filters"
                        aria-label="Template categories"
                        [multiple]="false"
                        [selectable]="true">
                        <mat-chip-option
                          [selected]="selectedCategory() === 'All'"
                          (click)="onCategorySelected('All')">
                          All
                        </mat-chip-option>
                        <mat-chip-option
                          [selected]="selectedCategory() === 'Simple'"
                          (click)="onCategorySelected('Simple')">
                          Simple
                        </mat-chip-option>
                        <mat-chip-option
                          [selected]="selectedCategory() === 'Modern'"
                          (click)="onCategorySelected('Modern')">
                          Modern
                        </mat-chip-option>
                        <mat-chip-option
                          [selected]="selectedCategory() === 'Creative'"
                          (click)="onCategorySelected('Creative')">
                          Creative
                        </mat-chip-option>
                      </mat-chip-listbox>
                    </div>

                    <div class="rp-templates">
                        @for (item of gatedTemplates(); track item.tpl.id) {
                        <div
                          class="rp-template"
                          >
                          <div class="rp-preview">
                            <div
                              class="rp-preview-bg"
                                [style.backgroundImage]="item.tpl.previewImageUrl ? 'url(' + item.tpl.previewImageUrl + ')' : 'none'"
                              role="img"
                                [attr.aria-label]="item.tpl.name">
                            </div>

                              @if (!item.allowed) {
                                <span class="rp-locked-badge" aria-label="Locked">
                                  <i class="pi pi-lock"></i>
                                  {{ item.overlayTitle }}
                                </span>
                              }

                            <div class="rp-hover" aria-hidden="true">
                              <div class="rp-hover-inner">
                                  @if (!item.allowed) {
                                    <div class="rp-hover-note">
                                      <div class="rp-hover-note-title">{{ item.overlayTitle }}</div>
                                      <div class="rp-hover-note-sub">{{ item.overlayMessage }}</div>
                                    </div>
                                  }

                                <button
                                  mat-flat-button
                                  color="primary"
                                  type="button"
                                  class="rp-cta"
                                    (click)="onTemplateCtaClick($event, item.tpl)">
                                  Use this template
                                </button>
                              </div>
                            </div>

                              @if (item.tpl.isPremium) {
                              <span class="rp-premium-ribbon" aria-hidden="true"></span>
                            }

                              @if (!item.allowed) {
                                <app-locked-overlay
                                  [title]="item.overlayTitle"
                                  [message]="item.overlayMessage"
                                  [actionLabel]="item.actionLabel"
                                  (actionClick)="onLockedActionClick(item)" />
                              }
                          </div>
                            <div class="rp-caption">{{ item.tpl.name | uppercase }}</div>
                        </div>
                      }
                    </div>
                  </section>
                </div>
              </div>
            </div>

            <app-work-ifence-footer></app-work-ifence-footer>
          </mat-sidenav-content>
        </mat-sidenav-container>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        font-size: clamp(0.875rem, 1vw + 0.5rem, 1rem);
        line-height: 1.6;
        color: #333;
      }

      /* Match Job Central outer chrome */
      .course-central-wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        position: relative;
      }

      .dashboard-container {
        height: 100vh;
        position: relative;
        background: transparent;
      }

      .course-area {
        z-index: 70;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 100vh;
        overflow-y: hidden;
        background-color: #f8fafc;
        background-image:
          radial-gradient(circle at 15% 15%, hsla(10, 80%, 60%, 0.2), transparent 35%),
          radial-gradient(circle at 85% 25%, hsla(230, 80%, 70%, 0.2), transparent 35%),
          radial-gradient(circle at 70% 80%, hsla(330, 80%, 70%, 0.25), transparent 40%),
          radial-gradient(circle at 20% 75%, hsla(45, 100%, 60%, 0.15), transparent 40%);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }

      .course-area.dark-course-area {
        background-color: #121212;
        background-image:
          radial-gradient(circle at 15% 15%, hsla(10, 80%, 40%, 0.15), transparent 35%),
          radial-gradient(circle at 85% 25%, hsla(230, 80%, 50%, 0.15), transparent 35%),
          radial-gradient(circle at 70% 80%, hsla(330, 80%, 50%, 0.2), transparent 40%),
          radial-gradient(circle at 20% 75%, hsla(45, 100%, 40%, 0.1), transparent 40%);
      }

      .course-area .content-max {
        backdrop-filter: blur(5px);
        border-radius: 15px;
        padding: 0px;
        /* Match landing footer constrained width */
        max-width: min(97vw, 1680px);
        margin: 0 auto;
      }

      .story-content {
        background-color: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 1);
        border-radius: 15px;
        padding: 30px;
        width: 100%;
      }

      /* Navigation buttons (match Course Central) */
      .modern-title-section .nav-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: var(--secondaryColor);
        font-weight: 500;
        font-size: 15px;
        line-height: 1;
        text-decoration: none;
        transition: all 0.2s ease;
        padding: 4px 0;
        cursor: pointer;
      }

      .modern-title-section .nav-button:hover {
        color: var(--mainColor);
      }

      .modern-title-section .back-button:hover {
        transform: translateX(-3px);
      }

      .dark-course-area .story-content {
        background-color: rgba(30, 30, 30, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.92);
      }

      .main-content {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
        /* Header is handled as sticky inside this scroll container */
        padding-top: 0;
      }

      /* Sticky page header inside the scroll container (Job Central style) */
      .main-content .course-header {
        display: block;
        width: 100%;
        position: sticky;
        top: 0;
        z-index: 120;
        background: transparent;
        border-bottom: 1px solid transparent;
      }

      /* Override landing header default (fixed) so it doesn't jump on scroll */
      :host ::ng-deep .main-content .course-header header.header {
        position: sticky !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
      }

      .main-content .course-header.course-header-sticky {
        /* Light glossy + transparent (glass) */
        background: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0.58) 0%,
          rgba(255, 255, 255, 0.34) 100%
        );
        backdrop-filter: blur(10px) saturate(160%);
        -webkit-backdrop-filter: blur(10px) saturate(160%);
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      }

      /*
        HeaderWorkIfenceComponent manages its own sticky state by listening to window scroll.
        In this page, scrolling is inside mat-sidenav-content, so its internal logic may not flip.
        We force the glossy background when THIS page's sentinel-based sticky state is active.
      */
      :host ::ng-deep .main-content .course-header.course-header-sticky header.header {
        /* Force the landing header to match the page's light glass sticky chrome */
        background: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0.62) 0%,
          rgba(255, 255, 255, 0.28) 100%
        ) !important;
        backdrop-filter: blur(12px) saturate(175%);
        -webkit-backdrop-filter: blur(12px) saturate(175%);
        border-bottom: 1px solid rgba(15, 23, 42, 0.10) !important;
        box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
      }

      .dark-course-area .main-content .course-header.course-header-sticky {
        background: rgba(18, 18, 18, 0.65);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      :host ::ng-deep .dark-course-area .main-content .course-header.course-header-sticky header.header {
        background: rgba(20, 20, 20, 0.8) !important;
        backdrop-filter: blur(10px) saturate(140%);
        -webkit-backdrop-filter: blur(10px) saturate(140%);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
        box-shadow: 0 6px 34px rgba(0, 0, 0, 0.24);
      }

      .rp-layout {
        width: 100%;
        /* Match footer max width for consistent alignment */
        max-width: min(97vw, 1680px);
        margin: 0 auto;
        display: block;
      }

      .rp-hero {
        margin: 0 0 18px;
        padding: 0 0 14px;
        border-radius: 0;
        background: transparent;
        border: 0;
      }

      .rp-hero-title {
        margin: 0 0 6px;
        font-size: 34px;
        font-weight: 900;
        letter-spacing: -0.02em;
      }

      .rp-hero-sub {
        margin: 0 0 14px;
        font-weight: 700;
        color: rgba(0,0,0,.62);
      }

      .dark-course-area .rp-hero-sub {
        color: rgba(255, 255, 255, 0.72);
      }

      .dark-course-area .rp-step {
        background: rgba(18, 18, 18, 0.55);
        border: 1px solid rgba(255, 255, 255, 0.10);
      }
      .dark-course-area .rp-step-title {
        color: rgba(255, 255, 255, 0.86);
      }
      .dark-course-area .rp-step-sub {
        color: rgba(255, 255, 255, 0.72);
      }
      .dark-course-area .rp-step-detail {
        color: rgba(255, 255, 255, 0.64);
      }

      .rp-section { margin-top: 10px; }

      .rp-sticky {
        position: sticky;
        /* Keep the toolbar below the sticky header */
        top: calc(var(--wf-header-height, 61px) + 12px);
        z-index: 4;
        padding: 14px 14px 12px;
        border-radius: 14px;
        background: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0.58) 0%,
          rgba(255, 255, 255, 0.46) 62%,
          rgba(255, 255, 255, 0) 100%
        );
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.65);
        border-bottom-color: transparent;
        box-shadow: none;
        overflow: hidden;
      }

      .dark-course-area .rp-sticky {
        background: linear-gradient(
          to bottom,
          rgba(18, 18, 18, 0.55) 0%,
          rgba(18, 18, 18, 0.42) 62%,
          rgba(18, 18, 18, 0) 100%
        );
        border: 1px solid rgba(255, 255, 255, 0.10);
        border-bottom-color: transparent;
      }

      /* Fade-out side rails (top -> bottom) without hard borders */
      .rp-sticky::before,
      .rp-sticky::after {
        content: '';
        position: absolute;
        top: 10px;
        bottom: 10px;
        width: 2px;
        pointer-events: none;
        background: linear-gradient(
          to bottom,
          rgba(0,0,0,.26) 0%,
          rgba(0,0,0,.14) 18%,
          rgba(0,0,0,.05) 45%,
          rgba(0,0,0,0) 78%,
          rgba(0,0,0,0) 100%
        );
        opacity: 0.65;
      }
      .rp-sticky::before { left: 0; }
      .rp-sticky::after { right: 0; }

      .rp-flow {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 10px;
        align-items: stretch;
        margin-bottom: 0;
        position: relative;
      }
      .rp-flow::before {
        content: '';
        position: absolute;
        top: 18px;
        left: 10%;
        right: 10%;
        height: 2px;
        background: linear-gradient(90deg, rgba(0,0,0,.08), rgba(0,0,0,.16), rgba(0,0,0,.08));
        z-index: 0;
      }
      .rp-step {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(255,255,255,.80);
        border: 1px solid rgba(0,0,0,.08);
        position: relative;
        z-index: 1;
        height: 100%;
        min-height: 104px;
      }

      .rp-step-body {
        display: flex;
        flex-direction: column;
        min-width: 0;
        flex: 1 1 auto;
      }
      .rp-step-badge {
        width: 30px;
        height: 30px;
        border-radius: 10px;
        display: grid;
        place-items: center;
        font-weight: 900;
        color: #fff;
        background: linear-gradient(120deg, var(--mainColor, #0A66C2) 0%, var(--mainColor2, #f05b45) 100%);
        box-shadow: 0 10px 20px rgba(0,0,0,.10);
        flex: 0 0 auto;
      }
      .rp-step-title {
        font-weight: 900;
        font-size: 14px;
        line-height: 1.25;
        color: rgba(0,0,0,.82);
        margin-top: 1px;
      }
      .rp-step-sub {
        font-weight: 700;
        font-size: 13px;
        line-height: 1.25;
        color: rgba(0,0,0,.58);
        margin-top: 2px;
      }

      .rp-step-detail {
        font-weight: 600;
        font-size: 12px;
        line-height: 1.4;
        color: rgba(0,0,0,.52);
        margin-top: 4px;
        max-width: 36ch;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .rp-heading {
        margin: 0 0 4px;
        font-size: 28px;
        font-weight: 900;
        letter-spacing: -0.02em;
      }

      .rp-message {
        margin: 0;
        font-weight: 700;
        color: rgba(0,0,0,.66);
      }

      .rp-toolbar-top {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 10px;
      }

      .rp-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        padding: 6px;
        border-radius: 999px;
        border: 0;
        background: transparent;
      }

      :host ::ng-deep .rp-filters .mat-mdc-chip {
        border-radius: 999px;
        font-weight: 800;
        letter-spacing: 0.02em;
      }
      :host ::ng-deep .rp-filters .mat-mdc-chip.mat-mdc-chip-selected {
        background: rgba(255,255,255,.96) !important;
        border: 1px solid rgba(0,0,0,.18);
      }

      .rp-upload {
        border-radius: 999px;
        padding: 10px 16px;
        font-weight: 900;
        letter-spacing: 0.02em;
        box-shadow: 0 10px 22px rgba(0,0,0,.10);
      }
      .rp-upload mat-icon { margin-right: 6px; }

      .rp-templates {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 32px;
      }

      .rp-template {
        width: 100%;
        text-align: left;
        cursor: default;
        outline: none;
      }
      .rp-preview {
        position: relative;
        background: rgba(255,255,255,.92);
        border-radius: 10px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        overflow: visible;
        /* Keep cards visually consistent across screen sizes */
        height: auto;
        aspect-ratio: 10 / 13;
        padding: 0;
      }
      .rp-preview-bg {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        background-color: #fff;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: top center;
      }
      .rp-template:hover .rp-preview {
        border-color: rgba(0,0,0,.18);
        box-shadow: 0 10px 30px rgba(0,0,0,.08);
        transform: translateY(-1px);
        transition: box-shadow 180ms ease, transform 180ms ease, border-color 180ms ease;
      }

      .rp-template:focus-visible .rp-preview {
        border-color: rgba(0,0,0,.22);
        box-shadow: 0 10px 30px rgba(0,0,0,.10);
      }

      .rp-hover {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 160ms ease;
        background: rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(1px);
        -webkit-backdrop-filter: blur(1px);
      }

      .rp-hover-inner {
        display: grid;
        gap: 10px;
        align-items: center;
        justify-items: center;
        padding: 10px 12px;
      }

      .rp-hover-note {
        max-width: 360px;
        text-align: center;
        font-weight: 800;
        font-size: 12px;
        line-height: 1.25;
        color: rgba(0,0,0,.72);
        background: rgba(255, 255, 255, 0.72);
        border-radius: 999px;
        padding: 8px 12px;
      }

      .rp-hover-note-title {
        font-weight: 950;
      }

      .rp-hover-note-sub {
        font-weight: 850;
        opacity: 0.92;
      }

      .rp-locked-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 900;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(0, 0, 0, 0.08);
        color: rgba(0, 0, 0, 0.72);
        z-index: 3;
        pointer-events: none;
      }

      .rp-locked-badge i {
        font-size: 12px;
      }

      .rp-template:hover .rp-hover,
      .rp-template:focus-within .rp-hover {
        opacity: 1;
      }

      .rp-cta {
        border-radius: 999px;
        padding: 10px 18px;
        font-weight: 900;
        letter-spacing: 0.02em;
        box-shadow: 0 12px 26px rgba(0,0,0,.16);
      }

      .rp-cta:disabled,
      :host ::ng-deep .rp-cta.mat-mdc-button-disabled {
        opacity: 0.55;
        cursor: not-allowed;
        box-shadow: none;
      }
      .rp-caption {
        margin-top: 10px;
        font-weight: 800;
        color: rgba(0,0,0,.72);
        letter-spacing: 0.06em;
        font-size: 12px;
      }

      .rp-premium-ribbon {
        position: absolute;
        top: -2px;
        right: 14px;
        width: 28px;
        height: 44px;
        z-index: 6;
        pointer-events: none;
        background: linear-gradient(180deg, #f05b45 0%, #0A66C2 100%);
        clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%);
        filter: drop-shadow(0 8px 14px rgba(0,0,0,.16));
      }

      :host ::ng-deep .rp-template-preview-dialog .mat-mdc-dialog-container {
        padding: 0;
        overflow: hidden;
      }

      @media (max-width: 1200px) {
        .rp-templates { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }

      @media (max-width: 900px) {
        .rp-templates { grid-template-columns: 1fr; }
        .rp-preview { aspect-ratio: 10 / 13; }
        .rp-sticky { top: calc(var(--wf-header-height, 61px) + 10px); }
        .rp-flow { grid-template-columns: 1fr; }
        .rp-flow::before { display: none; }
        .rp-upload { width: 100%; justify-content: center; }
      }

      @media (max-width: 600px) {
        .course-area .content-max { padding: 16px; }
        .story-content { padding: 16px; }
      }
    `,
  ],
})
export class TemplateGalleryPageComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly store = inject(ResumePortalStore);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private location = inject(Location);
  readonly themeService = inject(ThemeCustomizerService);
  private templateAccess = inject(TemplateAccessService);
  private resumeLimit = inject(ResumeLimitService);

  @ViewChild('sentinel', { static: false }) sentinel!: ElementRef;
  @ViewChild('pageSection', { static: false }) pageSectionRef!: ElementRef;
  @ViewChild('templatesSection', { static: false }) templatesSectionRef!: ElementRef;

  public isSticky = false;
  private observer?: IntersectionObserver;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  readonly selectedCategory = signal<'All' | 'Simple' | 'Modern' | 'Creative'>('All');
  readonly filteredTemplates = computed(() => {
    const category = this.selectedCategory();
    const templates = this.store.templates();
    if (category === 'All') {
      return templates;
    }
    return templates.filter(t => t.category === category);
  });

  readonly gatedTemplates = computed(() => {
    return this.filteredTemplates().map(tpl => {
      const vm = this.toVm(tpl);
      const gate = this.templateAccess.canUseTemplate(vm);
      const overlayTitle = gate.reason === 'LOGIN_REQUIRED' ? 'Sign in required' : 'Premium template';
      const overlayMessage = this.templateAccess.explainReason(gate.reason);
      const actionLabel = gate.reason === 'LOGIN_REQUIRED' ? 'Sign in' : 'Upgrade';
      return {
        tpl,
        vm,
        allowed: gate.allowed,
        reason: gate.reason,
        overlayTitle,
        overlayMessage,
        actionLabel,
      };
    });
  });

  async ngOnInit(): Promise<void> {
    await this.store.refreshMyResumes();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.sentinel?.nativeElement || !this.pageSectionRef?.nativeElement) {
      return;
    }

    this.observer = new IntersectionObserver(
      entries => {
        this.isSticky = !entries[0].isIntersecting;
      },
      { root: this.pageSectionRef.nativeElement }
    );
    this.observer.observe(this.sentinel.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  onPageScroll(event: Event): void {
    const el = event.target as HTMLElement | null;
    const scrollTop = el?.scrollTop ?? 0;

    // Keep sticky behavior consistent even if IntersectionObserver isn't firing
    // (e.g., due to scroll container differences).
    this.isSticky = scrollTop > 16;
  }

  onCategorySelected(category: 'All' | 'Simple' | 'Modern' | 'Creative'): void {
    this.selectedCategory.set(category);
    // Defer scrolling until after the DOM updates (prevents scroll anchoring/focus
    // from pushing the viewport in the opposite direction).
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.scrollToTemplatesSection();
        requestAnimationFrame(() => this.scrollToTemplatesSection());
      }, 0);
    }
  }

  private scrollToTemplatesSection(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const container = this.pageSectionRef?.nativeElement as HTMLElement | undefined;
    const target = this.templatesSectionRef?.nativeElement as HTMLElement | undefined;
    if (!container || !target) {
      return;
    }

    const rootStyles = getComputedStyle(document.documentElement);
    const headerVar = rootStyles.getPropertyValue('--wf-header-height').trim();
    const headerHeight = Number.parseFloat(headerVar) || 61;
    const topPadding = 16;
    const offset = headerHeight + topPadding;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const targetTop = targetRect.top - containerRect.top + container.scrollTop;
    const top = Math.max(0, targetTop - offset);

    if (typeof (container as any).scrollTo === 'function') {
      (container as any).scrollTo({ top, behavior: 'smooth' });
    } else {
      container.scrollTop = top;
    }
  }

  private scrollPageToTop(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const container = this.pageSectionRef?.nativeElement as HTMLElement | undefined;
    if (!container) {
      return;
    }

    // Hard reset first (prevents any unexpected focus/anchor behavior from
    // pushing the scroll position in the opposite direction).
    container.scrollTop = 0;

    // Use the sentinel element at the very top of this scroll container.
    // This is more reliable than scrolling the window or relying on scrollTop
    // during layout shifts.
    const sentinelEl = this.sentinel?.nativeElement as HTMLElement | undefined;

    requestAnimationFrame(() => {
      if (sentinelEl?.scrollIntoView) {
        sentinelEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (typeof (container as any).scrollTo === 'function') {
        (container as any).scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        container.scrollTop = 0;
      }
    });
  }

  async refreshResumes(): Promise<void> {
    await this.store.refreshMyResumes();
  }

  openTemplate(tpl: { id: number }): void {
    const template = this.store.templates().find(t => t.id === tpl.id);
    if (!template) {
      return;
    }

    this.dialog.open(TemplatePreviewDialogComponent, {
      width: '1320px',
      maxWidth: 'calc(100vw - 40px)',
      panelClass: 'rp-template-preview-dialog',
      data: { template },
    });
  }

  onTemplateCtaClick(event: MouseEvent, tpl: PortalTemplate): void {
    event.preventDefault();
    event.stopPropagation();

    const vm = this.toVm(tpl);
    const access = this.templateAccess.canUseTemplate(vm);
    if (!access.allowed) {
      this.templateAccess.handleDenied(access.reason, this.builderReturnUrlForTemplate(tpl));
      return;
    }

    const limit = this.resumeLimit.canCreateResume();
    if (!limit.allowed) {
      if (limit.reason === 'LOGIN_REQUIRED') {
        this.templateAccess.handleDenied('LOGIN_REQUIRED', this.builderReturnUrlForTemplate(tpl));
      } else {
        this.resumeLimit.handleLimitDenied();
      }
      return;
    }

    this.store.createResumeFromTemplate(tpl.id);
  }

  onLockedActionClick(item: { tpl: PortalTemplate; reason?: string }): void {
    if (item.reason === 'LOGIN_REQUIRED') {
      this.templateAccess.handleDenied('LOGIN_REQUIRED', this.builderReturnUrlForTemplate(item.tpl));
      return;
    }

    this.templateAccess.handleDenied('UPGRADE_REQUIRED', this.builderReturnUrlForTemplate(item.tpl));
  }

  private builderReturnUrlForTemplate(tpl: PortalTemplate): string {
    return `/user/resumes/resume?templateId=${encodeURIComponent(String(tpl.id))}`;
  }

  private toVm(tpl: PortalTemplate): ResumeTemplateVm {
    // Exactly one BASIC template is allowed on free: the default (id=1 in current catalog).
    const isDefault = tpl.id === 1;
    return {
      id: String(tpl.id),
      title: tpl.name,
      category: isDefault ? 'BASIC' : 'PREMIUM',
      previewUrl: tpl.previewImageUrl,
      isDefault,
    };
  }

  uploadResume(): void {
    // Best-effort: route user to their resumes area (guarded). If there is an upload flow there,
    // they can import/upload from that screen.
    this.store.openMyResumes();
  }

  goBack(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.location.back();
  }
}

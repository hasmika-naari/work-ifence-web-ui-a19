# WorkIfence — Product Backlog & Release Plan

> **Owned by: Product (this is the PO-driven plan).** Building is delegated to Claude Code.
> This document decides **what** ships, **in what order**, and **the acceptance criteria** —
> not the implementation. Engineering detail lives in `IMPLEMENTATION-TIER-A.md` and the
> JDL/spec files; product intent and sequencing live here.
>
> **Planning model:** no calendar dates. Releases are **capability milestones** (a coherent,
> shippable slice). Work is ordered for **one execution lane** (single Claude Code stream),
> so the backlog is a strict, dependency-aware sequence — do items top to bottom.
>
> **Decision-making:** P = priority (P0 must-have for the release, P1 should, P2 could).
> Each story has an ID, acceptance criteria (AC), and dependencies. "Ready" = AC clear +
> dependencies done + any open decision resolved (see §6).

---

## 1. Product goal & first release

**North star:** a jobseeker can go from *blank page* to *tracked application* without leaving
WorkIfence — build a resume, let AI tailor it to a job, apply anywhere via the extension, and
watch the application through to outcome with all context in one place.

**Release 1 — Jobseeker MVP** is the priority (your call). It turns the strongest existing
code (resumes, applications, interviews) into a complete, differentiated loop. Everything
else (discovery, multi-party/staffing, campus) sequences after, because it builds on or
around this core.

Release order (capability milestones):

| Release | Theme | Why this order |
| ------- | ----- | -------------- |
| **R1** | Jobseeker MVP — resume → AI tailor → apply → track | Core value; mostly completes existing entities; fastest to "usable product". |
| **R2** | Discovery & growth — Job Central, Course Central, skill-gap, career pathways, market stats | Deepens jobseeker value and drives engagement/traffic on top of R1. |
| **R3** | Multi-party work — employer resume marketing, vendor↔client placement, timesheets, work billing | Opens B2B revenue; needs the candidate/application core from R1. |
| **R4** | Campus + cross-cutting WOW — campus drives, all-parties timeline, career copilot, app intelligence | Differentiators that sit on top of everything above. |

Each release ends with: entitlement gating in place, nav/route gating passing
(`audit:nav:ci`), tests green (`./mvnw verify`, `npm test`), and the endpoint inventory updated.

---

## 2. Release 1 — Jobseeker MVP (ordered backlog)

> **STATUS: ✅ READY TO BUILD.** All R1 product decisions are locked (see §6 — defaults
> accepted by stakeholder). Every R1 story below is "Ready": AC defined, dependencies
> sequenced, blocking decisions resolved. Hand to Claude Code starting at R1-S0.1 and work
> top to bottom in the build order at the end of this section.
>
> Engineering recipe for all of R1 is in `IMPLEMENTATION-TIER-A.md`; entities in
> `workifence-tierA.jdl`. Below is the **product** breakdown and order. Do epics in order;
> within an epic, do stories in order.

### Epic R1-E0 — Foundation (schema + gating scaffold) · P0
*Enables everything else; do first.*

- **R1-S0.1** Import Tier A schema & additive migration. **AC:** new entities + columns exist;
  app starts; Liquibase clean; `job_resume.visibility` backfilled from `accessType`.
  *Dep: none.*
- **R1-S0.2** Establish entitlement keys for R1 (`resume.share`, `resume.ai`,
  `application.tracking`, `extension.capture`) as `FeatureType`/`PlanEntitlement` and surface
  in `/api/access/me`. **AC:** keys returned in the access payload; gated per plan/scope.
  *Dep: S0.1.*

### Epic R1-E1 — Resume management & visibility · P0
*"Save resumes with different names and set visibility levels."*

- **R1-S1.1** Create/rename/duplicate/version/delete resumes. **AC:** a user holds multiple
  named resumes; duplicate makes an independent copy; delete is soft (archived).
- **R1-S1.2** Visibility levels (`PRIVATE/PUBLIC/UNLISTED/EMPLOYER_ONLY`) enforced
  server-side. **AC:** unauthorized read → 403; rules per PRD FR-RES-2.
- **R1-S1.3** Revocable share links + public read-only view. **AC:** share URL renders the
  resume; revoking → 410; only PUBLIC/UNLISTED resolvable by token.
  *Dep: E0. P: S1.1 P0, S1.2 P0, S1.3 P1.*

### Epic R1-E2 — AI resume creation & tailoring · P0  *(the headline WOW)*
*"Use AI to update resumes; create by upload or from a job description."*

- **R1-S2.1** AI draft/improve sections with **accept/reject per section**. **AC:** nothing
  auto-saves; accepted content writes to the resume; model used recorded.
- **R1-S2.2** Create resume **from an uploaded** PDF/DOCX (parse → structured resume). **AC:**
  upload yields an editable structured resume; original retained; parse failure is graceful.
- **R1-S2.3** Tailor **from a job description** with live **match score** + missing keywords;
  save as a new resume linked to the JD. **AC:** score 0–100 returned; suggestions
  highlightable; saved resume references the JD.
- **R1-S2.4** Cover-letter generation from resume + JD. **AC:** stored and linkable to an
  application's `coverLetterId`. *P2.*
  *Dep: E1. Open decision D1 (AI provider) must be resolved first — see §6.*

### Epic R1-E3 — Application tracking (one place for everything) · P0
*"Track applications to final result with resume used, JD, interviews, communication."*

- **R1-S3.1** Application lifecycle with history on every status change
  (`SAVED→APPLIED→SCREENING→INTERVIEWING→OFFER→ACCEPTED/REJECTED/WITHDRAWN`). **AC:** each
  change appends to history with actor + timestamp.
- **R1-S3.2** Application **detail aggregate**: resume used (+ version), JD, interview rounds
  & feedback, communications, offer — in one view. **AC:** all related records resolve from
  the application id.
- **R1-S3.3** Communication log (email/call/message/note) per application. **AC:** timestamped,
  typed, ordered entries.
- **R1-S3.4** Offers (comp, start date, decision); `OFFER` status requires an offer record.
  **AC:** per PRD FR-APP-4.
- **R1-S3.5** Follow-up reminders → notifications. **AC:** due reminders create
  `Notification`s. *P2.*
  *Dep: E0 (E1 helpful for "resume used" link).*

### Epic R1-E4 — Apply-anywhere browser extension · P0  *(WOW)*
*"Apply for a job using a browser extension and auto-create a tracked application."*

- **R1-S4.1** Capture endpoint: create an application from a job page (title, company,
  location, url, JD text, resume, source=EXTENSION). **AC:** one call creates a fully
  contextual application.
- **R1-S4.2** Extension auth via scoped, **revocable** token. **AC:** logout/revoke kills the
  extension session.
- **R1-S4.3** MV3 extension (Chrome/Edge first): detect posting, scrape JD, pick resume,
  confirm → capture. **AC:** "Track in WorkIfence" on a job page creates the application;
  never auto-submits external forms.
  *Dep: E1 (resume picker), E3 (application + JD). Open decision D2 (target browsers) — §6.*

### Epic R1-E5 — Gating, polish & release readiness · P0

- **R1-S5.1** Nav + route gating for all R1 features, matched and **fail-closed**; run
  `audit:nav:ci`. **AC:** no nav↔route drift; gated routes deny in prod build.
- **R1-S5.2** Update `docs/rest-endpoint-inventory.md`; reconcile shipped behavior into
  `REQUIREMENTS.md`. **AC:** docs current.
- **R1-S5.3** Test pass: `./mvnw verify`, `npm test`, extension smoke. **AC:** all green.

**R1 build order (single lane):** E0 → E1 → E3 → E2 → E4 → E5.
*(E3 before E2 so AI tailoring can link to real applications; E2 before E4 so the extension's
resume picker has AI-tailored resumes available.)*

**R1 Definition of Done:** a user can build/name resumes, set visibility, AI-tailor to a JD,
apply via the extension, and track the application to outcome with full context — all
entitlement-gated and tested.

---

## 3. Release 2 — Discovery & growth (epics, prioritized)

*Sequence after R1. Detailed stories to be expanded when R1 nears done.*

- **R2-E1 Job Central** (P0): multi-source ingestion → unified `JobPosting`, faceted search,
  apply→track (source=JOB_CENTRAL). *Open decision D3: licensed sources.*
- **R2-E2 Course Central search** (P0): faceted search over existing `CourseInfo` catalog.
- **R2-E3 Skill-gap suggestions** (P1): resume/target-role → missing skills + recommended
  courses.
- **R2-E4 Career pathways** (P1): role→role paths with skills/courses per step.
- **R2-E5 Job-market analytics** (P2): trends, hot jobs, salary ranges dashboards.

**R2 order:** E1 → E2 → E3 → E4 → E5.

---

## 4. Release 3 — Multi-party work / staffing (epics, prioritized)

- **R3-E1 Employer resume marketing** (P0): roster of marketable resumes, bench listings,
  view/lead tracking.
- **R3-E2 Vendor↔client placement lifecycle** (P0): placement records + status flow.
- **R3-E3 Timesheets** (P0): submit/approve, shared role-scoped visibility (vendor, client,
  employer, employee).
- **R3-E4 Work billing** (P0): invoices from approved timesheets + payments; shared
  visibility. *Open decision D4: tax/multi-currency, gateway-vs-record.*

**R3 order:** E2 (placement) → E3 (timesheets) → E4 (billing) → E1 (marketing can run parallel
conceptually but, single lane, do last).

---

## 5. Release 4 — Campus + cross-cutting WOW (epics, prioritized)

- **R4-E1 Campus recruitment events** (P0): create/schedule, registration, run-day interview
  board, outcome analytics.
- **R4-E2 All-parties candidate timeline** (P0): unified chronological record each party sees
  their slice of (resume→app→interview→offer→placement→timesheet→payment).
- **R4-E3 AI career copilot** (P1): conversational agent over the user's resume/apps/skills.
- **R4-E4 Application intelligence** (P1): benchmarks, follow-up nudges, stale alerts.
- **R4-E5 Verified public profiles** (P2): employer-attested experience + revocable links.

**R4 order:** E1 → E2 → E4 → E3 → E5.

---

## 6. Product decisions — LOCKED ✅

> Stakeholder accepted the recommended defaults. These are now binding for the releases noted.

| ID | Decision | LOCKED choice |
| -- | -------- | ------------- |
| **D1** | AI provider + data retention (R1-E2) | **Gemini** (already bundled), called **server-side** with a no-train/retention setting; abstracted behind `AiProviderClient` so the provider can be swapped without touching feature code. |
| **D2** | Extension target browsers (R1-E4) | **Chrome + Edge** (single MV3 build) for R1; Firefox deferred. |
| **D3** | Job-source ingestion (R2-E1) | **Manual + partner API feeds we control** first; scraping deferred pending legal review. |
| **D4** | Work-billing scope (R3-E4) | **Record-only** invoices/payments for R3; payment-gateway integration deferred to a later release. |
| **D5** | Resume parsing (R1-E2 / S2.2) | Use a **third-party/library parser** first to de-risk; revisit quality after R1. |

No open blockers remain for R1.

---

## 7. How I'll operate as PO (cadence of artifacts)

- **Now:** R1 is fully specified and ordered (above + `IMPLEMENTATION-TIER-A.md`). Ready to hand to Claude Code.
- **Per release:** I expand the next release's epics into ordered stories with AC, like R1,
  just before it's needed (avoids over-planning).
- **On completion of each story/epic:** I reconcile shipped behavior into `REQUIREMENTS.md`,
  re-prioritize the backlog, and confirm the next "Ready" item.
- **When scope/ideas change:** I fold them into this backlog and re-order rather than letting
  them interrupt the current lane.

> Single source of truth for product order = this file. Single source of truth for *as-built*
> = `REQUIREMENTS.md`. Engineering how-to = `IMPLEMENTATION-TIER-A.md` (+ future tier guides).

---

## 8. Plan & entitlement matrix (monetization)  · PROPOSED, needs sign-off

> The R1 entitlement keys (R1-S0.2) must map to plans, or "gating" has nothing to gate to.
> This is my proposed monetization for the **individual** side that R1 touches. Plans use the
> existing `SubscriptionPlan` + `PlanEntitlement` + `FeatureType` model and `SubscriptionScope`
> (INDIVIDUAL / ENTERPRISE). **Confirm or adjust the limits.**

| Feature (entitlement key) | **Free** | **Pro** (individual, paid) | **Enterprise** |
| ------------------------- | -------- | -------------------------- | -------------- |
| Build & save resumes | ✅ up to **2** | ✅ unlimited | ✅ unlimited |
| Visibility PRIVATE / PUBLIC | ✅ | ✅ | ✅ |
| Share links + UNLISTED / EMPLOYER_ONLY (`resume.share`) | ❌ | ✅ | ✅ |
| AI draft / improve (`resume.ai`) | ✅ **limited** (e.g. 5 actions/mo) | ✅ unlimited | ✅ unlimited |
| AI from-JD tailoring + match score | ❌ | ✅ | ✅ |
| AI from-upload (parse) + cover letters | ❌ | ✅ | ✅ |
| Application tracking (`application.tracking`) | ✅ **up to 10 active** | ✅ unlimited | ✅ unlimited |
| Communication log + offers | ✅ | ✅ | ✅ |
| Browser extension capture (`extension.capture`) | ✅ | ✅ | ✅ |

Rationale: free tier proves the core loop and drives signups; paid unlocks the AI tailoring
and sharing that deliver the most value. Enterprise plans add the employer/vendor features in
R3. **Decision needed: the exact free-tier limits and the Pro price point** (D6 — see below).
Until confirmed, R1 can build the gating against these keys with limits read from
`PlanEntitlement` config (so numbers change without code changes).

**New open decision** — **D6: free-tier limits + Pro price point.** Does not block building
R1 (limits are config-driven), but blocks go-to-market. Recommendation: ship R1 with the
limits above as defaults, finalize pricing before public launch.

---

## 9. R1 success metrics (how we'll know it worked)  · PO-defined

I'll judge R1 against these. Instrument them as part of R1-E5 (lightweight product analytics).

- **Activation:** % of new signups who create ≥1 resume; target a strong majority.
- **AI adoption:** % of resumes that used an AI action (draft/improve/from-JD) — the headline
  differentiator; this is the metric I care most about.
- **Core-loop completion:** % of activated users who track ≥1 application.
- **Extension reach:** extension installs and % of applications captured via extension vs manual.
- **Engagement:** applications tracked per active user; resumes per user.
- **Time-to-first-application:** signup → first tracked application (lower is better).
- **Free→Pro intent:** clicks on gated Pro features (share links, from-JD) by free users —
  signals monetization demand.

Requirement **R1-S5.4 (add to E5):** emit product-analytics events for resume created, AI
action used, application created (with source), and gated-feature-hit. **AC:** the seven
metrics above are derivable from emitted events.

---

## 10. Cross-cutting requirements backlog (tracked, mostly post-R1)

Real gaps I'm tracking so they aren't forgotten. None block R1 unless marked.

- **Account & onboarding (jobseeker):** ✅ **VERIFIED — already exists, not an R1 gap.**
  Backend `POST /register` + `GET /activate`; UI pages `sign-up`, `confirm-email`,
  `forgot-password`, `reset-password`. Only revisit if we want to redesign the signup UX.
- **Notifications & email:** channels (in-app/email), templates, and user preferences. R1 uses
  `Notification` only for reminders (P2); a fuller spec is needed when R2 adds job alerts.
- **Resume export formats:** PDF exists; add DOCX export and multi-template rendering. *(R2.)*
- **Resume import sources:** beyond file upload — LinkedIn import. *(R2/R3.)*
- **Email ingestion into the communication log** (auto-capture recruiter emails). *(R3+.)*
- **Saved searches & job alerts.** *(R2, part of Job Central.)*
- **Interview preparation** (AI mock interviews on the `InterviewQuestion` bank) — candidate
  WOW idea; not in the original list but high value. *(Candidate for R4.)*
- **Accessibility (a11y)** and **responsive/mobile** standards for public-facing pages
  (resume view, builder). *(Define as an NFR; apply from R1 on public resume pages.)*
- **Internationalization:** translation is enabled — confirm target locales. *(Pre-launch.)*
- **Privacy/GDPR:** user data export + delete-my-account. *(Pre-public-launch; required.)*
- **Admin content management:** curating Course Central / Job Central / templates. *(R2.)*

I'll fold any of these into a release's story set when it becomes relevant, or sooner if you
want one pulled forward.
# WorkIfence — Product Requirements Document (PRD)

> **Purpose.** A codegen-ready specification of the full WorkIfence vision: what the product
> is, who it serves, what already exists, what is missing, the "WOW" differentiators, and
> per-feature functional requirements with acceptance criteria, proposed data model
> (JDL-style entities/fields), and REST API contracts. A coding agent should be able to
> implement features directly from sections 6–8.
>
> An identical copy lives at the root of both repos (`work-ifence-web-ws`, `work-ifence-web-ui`).
> The existing `REQUIREMENTS.md` documents the system *as built*; this PRD documents the
> *target* product and the path to it.
>
> Status legend used throughout: **[DONE]** implemented · **[PARTIAL]** foundation exists,
> needs completion · **[NEW]** not yet built.

---

## 1. Product vision

WorkIfence is a **career operating system** that takes a person from *building a resume* all
the way to *getting placed and paid* — and gives employers, staffing vendors, and clients a
shared workspace around the same candidates.

For a **jobseeker**, WorkIfence is the single place to:
- Build, name, version, and control the visibility of multiple resumes, with **AI** that
  drafts and improves them — including generating a tailored resume from a **job
  description** or from an **uploaded** existing resume.
- **Apply to jobs anywhere** via a **browser extension**, which auto-creates a tracked job
  application capturing the resume used, the job description, the source, and the link.
- **Track every application** end-to-end — from "applied" to final outcome — with all
  context in one place: resume version used, JD, interview rounds & feedback, recruiter
  communication, and offers.
- Discover openings in **Job Central** (aggregated from many sources), upskill via **Course
  Central**, follow **career pathways**, see the **skills to learn next**, and read
  **industry job statistics, trends, and what's hot**.

For an **employer**, WorkIfence manages their employees' **publicly available resumes**,
**markets** those resumes, and tracks resulting applications **until the candidate is placed**.

For **staffing vendors**, it manages placing their consultants at **client** sites, and adds
**timesheet management** and **billing** so vendor, client, employer, and employee all see
**timesheets, payments, and invoices** in one shared view.

For **colleges**, it supports **campus recruitment events** — scheduling, running, and
tracking on-campus interview drives.

The differentiator: most tools do *one* slice (a resume builder, an ATS, a job board, a
timesheet app). WorkIfence connects the **whole lifecycle** for **all parties** around a
single candidate record, with AI threaded through resume creation, job matching, and
upskilling.

---

## 2. Personas

| # | Persona | Goals |
| - | ------- | ----- |
| P1 | **Jobseeker (individual)** | Build/tailor resumes with AI, apply fast, track everything to outcome, upskill toward a target role. |
| P2 | **Employer / Enterprise Admin** | Manage employees' public resumes, market them, track applications to placement, manage subscription. |
| P3 | **Enterprise role users** (HR, Recruiter, Marketing, Employee) | Role-scoped slices of the employer workspace. |
| P4 | **Staffing Vendor** | Place consultants at clients, manage timesheets, raise invoices, get paid. |
| P5 | **Client** | Receive vendor consultants, approve timesheets, view invoices. |
| P6 | **College / Campus coordinator** | Run campus recruitment events; track student applications and outcomes. |
| P7 | **App Admin** | Approve enterprise onboarding, manage entitlements/menus, oversee subscriptions and content. |

Existing enums already model much of this: member types `PERSONAL / ENTERPRISE_EMPLOYEE /
ENTERPRISE_ADMIN / ADMIN`, and `EnterpriseRole` `ENTERPRISE_ADMIN / ENTERPRISE_HR /
ENTERPRISE_MARKETING / ENTERPRISE_RECRUITER / ENTERPRISE_EMPLOYEE`. **Vendor**, **Client**,
and **Campus coordinator** need first-class role support **[NEW/PARTIAL]**.

---

## 3. Feature map → current implementation (gap analysis)

| Capability | Vision | Today | Status |
| ---------- | ------ | ----- | ------ |
| Resume builder, multiple named resumes | Yes | `JobResume` (title, tags, resumeJson, resumeDocUrl), `JobResumeUserRelation` | **[PARTIAL]** core model exists |
| Resume **visibility levels** | Public/Private/Unlisted/Employer-only | `JobResume.accessType` (free-text String) | **[PARTIAL]** make it an enum + enforcement |
| Resume **templates** | Yes | `ResumeTemplate` (templateKey, accessLevel, configJson) + PDF export (`export/template1/2`) | **[DONE]** |
| **AI** resume drafting/improving | Yes | `@google/generative-ai` in UI deps | **[PARTIAL]** library present; structured flows to build |
| Create resume **by upload** | Parse uploaded file → structured resume | `resumeDocUrl` + S3 upload | **[PARTIAL]** storage yes, parsing no |
| Create resume **from job description** | Tailor to a JD | — | **[NEW]** |
| **Browser extension** apply + auto-create application | Yes | — (no extension package found) | **[NEW]** |
| **Job application tracking** (full context) | Yes | `JobApplication` (resumeId, jobUrl, source, statusId, vendor/clientContactId, notes) + `ApplicationStatus` + `ApplicationHistory` + interview rounds/feedback | **[PARTIAL→strong]** good base; add comms log, offers |
| **Interview** rounds, feedback, Q-bank | Yes | `JobInterviewRound(s)`, `JobInterviewFeedback`, `InterviewQuestion` | **[DONE]** |
| **Communication log** per application | Emails/messages in one place | `JobApplication.notes` only | **[NEW]** |
| Employer manages employees' **public resumes** | Yes | `EnterpriseProfile`, relations | **[PARTIAL]** |
| Employer **markets** resumes | Yes | — | **[NEW]** |
| **Vendor → client placement** | Yes | `VendorContact`, `ClientContact`, `VendorJobApplication`, `ServiceEnterpriseRelation` | **[PARTIAL]** contacts modeled; placement lifecycle no |
| **Timesheet management** | Vendor/client/employer/employee shared | — (0 files) | **[NEW]** |
| **Invoices & payments for work** (timesheet-based) | Yes | `SubscriptionInvoice/Payment` exist but are **SaaS billing only** | **[NEW]** (distinct billing domain) |
| **Job Central** (multi-source listings) | Yes | `CollegeJobs` (single source: title, company, location, jobUrl) + `GetJobsResource` | **[PARTIAL]** seed exists; aggregation/ingestion no |
| **Course Central** (search trainings) | Yes | `CourseInfo` (rich), `CourseSubject`, `CourseProvider` | **[DONE→extend]** strong catalog; add search/suggestions |
| **Skill-gap suggestions** | Yes | — | **[NEW]** |
| **Career pathways** | Yes | — | **[NEW]** |
| **Industry stats / trends / hot jobs** | Yes | — | **[NEW]** |
| **Campus recruitment events** | Yes | `CollegeJobs` only | **[NEW]** |
| Subscriptions & **entitlements** | Yes | Full model: plans, entitlements, catalog, feature types, upgrade requests | **[DONE]** |
| Notifications & news feed | Yes | `Notification`, `NewsFeed` | **[DONE→extend]** |
| Data-driven **navigation/menus** per tenant | Yes | `NavMenuSection/Item`, `TenantMenuConfig`, `UserMenuPref`, `MenuAuditLog` | **[DONE]** |

**Summary of what's left (net-new domains):** Browser extension; JD-based & upload-parse
resume AI; communication log + offers on applications; resume marketing; placement
lifecycle; **timesheets + work billing**; Job Central ingestion/aggregation; skill-gap +
career pathways; job market analytics; campus events.

---

## 4. Scope tiers

- **Tier A — Complete the core loop:** resume visibility enum, AI resume flows (blank / from
  upload / from JD), browser extension + auto-application, application comms log & offers.
- **Tier B — Multi-party work:** employer resume marketing, vendor↔client placement
  lifecycle, **timesheets**, **work invoices/payments**.
- **Tier C — Discovery & growth:** Job Central aggregation, Course Central search +
  skill-gap, career pathways, job-market analytics.
- **Tier D — Campus & WOW features:** campus recruitment events + the differentiators in §8.

Entitlements (existing `PlanEntitlement`/`FeatureType`) gate every feature per plan.

---

## 5. Conventions for the spec below

- **Entities** are written in JDL-compatible shorthand so they can be added to a `.jdl`
  file and imported (`npx jhipster import-jdl …`, then an `addColumn`/`createTable`
  Liquibase changeset — see `README.md`). Reuse existing entities where noted.
- **APIs** follow JHipster conventions: kebab-plural paths under `/api`, JWT auth, criteria
  filtering + pagination on list endpoints. Custom endpoints live under `web/rest/ext`.
- Every requirement has an **ID** (`FR-<area>-<n>`) and **acceptance criteria** (AC).
- All access decisions are **backend-authoritative + fail-closed** on the frontend
  (see `ARCHITECTURE.md` §5 and `docs/navigation-gating.md`).

---

## 6. Functional requirements — Tier A (core jobseeker loop)

### 6.1 Resume management & visibility  *(extends `JobResume`)*

**FR-RES-1 — Multiple named resumes.** A user can create, rename, duplicate, version, and
delete resumes. *(JobResume.title, status; add `parentResumeId`, `versionNo`.)*
- AC: a user can hold N resumes with distinct titles; duplicating copies `resumeJson`;
  deleting is soft-delete (`status=ARCHIVED`).

**FR-RES-2 — Visibility levels.** Replace free-text `accessType` with enum
`ResumeVisibility { PRIVATE, PUBLIC, UNLISTED, EMPLOYER_ONLY }` and enforce it on every read.
- AC: `PRIVATE` visible only to owner; `PUBLIC` discoverable; `UNLISTED` accessible only via
  share token; `EMPLOYER_ONLY` visible to the owning enterprise's recruiters. Enforced
  server-side; unauthorized read → 403.

**FR-RES-3 — Share links.** Generate a revocable share token + public URL for a resume.
- AC: token resolves to a read-only render; revoking returns 404/410 thereafter.

**Proposed model**
```
enum ResumeVisibility { PRIVATE, PUBLIC, UNLISTED, EMPLOYER_ONLY }
// JobResume: add visibility ResumeVisibility, parentResumeId Long, versionNo Integer,
//            shareToken String, lastAiModelUsed String
entity ResumeShareLink { token String required, resumeId Long, expiresAt Instant, revoked Boolean }
```
**API**
```
GET/POST/PUT/DELETE /api/job-resumes                 (existing CRUD; add visibility filter)
POST   /api/job-resumes/{id}/duplicate
POST   /api/job-resumes/{id}/share        → { token, url }
DELETE /api/job-resumes/{id}/share/{token}
GET    /api/public/resumes/{token}        (no auth; UNLISTED/PUBLIC only)
```

### 6.2 AI resume creation & editing

**FR-AI-1 — AI draft & improve.** From a blank or existing resume, the user requests AI to
draft sections (summary, bullet points) or improve tone/impact/ATS-friendliness.
- AC: each AI action returns suggested content the user can accept/reject per section;
  accepted content writes to `resumeJson`; the model used is recorded.

**FR-AI-2 — Create from upload.** User uploads a PDF/DOCX; the system parses it into the
structured `resumeJson` schema.
- AC: upload → parsed structured resume within the editor; original stored at `resumeDocUrl`
  (S3); parse failures return a clear error and keep the raw file.

**FR-AI-3 — Tailor to a job description.** Given a JD (pasted text or URL), AI produces a
resume tailored to it and reports a **match score** + missing keywords.
- AC: output highlights added/emphasized skills; match score 0–100 returned; user can save
  as a new resume linked to the JD.

**FR-AI-4 — Cover letter generation.** Generate a cover letter from a resume + JD.
- AC: stored and linkable to a `JobApplication.coverLetterId`.

**Proposed model**
```
entity AiResumeJob {
  userId String, resumeId Long, mode AiResumeMode, inputRef TextBlob, // JD text or upload key
  status AiJobStatus, matchScore Integer, resultJson TextBlob, modelUsed String,
  createdDate Instant
}
enum AiResumeMode { DRAFT, IMPROVE, FROM_UPLOAD, FROM_JD, COVER_LETTER }
enum AiJobStatus  { QUEUED, RUNNING, SUCCEEDED, FAILED }
```
**API**
```
POST /api/ext/ai/resume/draft        { resumeId, sections[] }
POST /api/ext/ai/resume/improve      { resumeId, instructions }
POST /api/ext/ai/resume/from-upload  { fileKey }                 → structured resumeJson
POST /api/ext/ai/resume/from-jd      { jobDescription | jobUrl } → { resumeJson, matchScore, missingKeywords[] }
POST /api/ext/ai/cover-letter        { resumeId, jobDescription }
GET  /api/ext/ai/jobs/{id}                                       (poll async job)
```
> Note: keep the AI provider call **server-side** for key safety, even though the UI bundles
> `@google/generative-ai`. The UI calls these endpoints, not the model directly, in prod.

### 6.3 Browser extension — apply & auto-track

**FR-EXT-1 — One-click capture.** A browser extension detects a job posting on any site and
lets the signed-in user create a `JobApplication` capturing: job title, company, location,
job URL, JD text (scraped), source domain, and the resume chosen.
- AC: clicking "Track in WorkIfence" on a job page creates an application via API and shows
  confirmation; the JD text and URL are stored.

**FR-EXT-2 — Autofill assist (progressive).** Where possible, the extension autofills
application forms from the selected resume/profile.
- AC: best-effort field mapping; never submits without explicit user action.

**FR-EXT-3 — Auth.** Extension authenticates via the same JWT (OAuth-style token exchange);
tokens are stored securely and scoped.
- AC: revoking the session invalidates the extension.

**Proposed model** — reuse `JobApplication`; add `source` already present; add `jdText TextBlob`,
`capturedVia ApplicationSource`.
```
enum ApplicationSource { MANUAL, EXTENSION, IMPORT, JOB_CENTRAL }
// New repo/build target: /browser-extension (MV3) in work-ifence-web-ui or a sibling package.
```
**API**
```
POST /api/ext/applications/capture  { jobTitle, company, location, jobUrl, jdText, resumeId, source }
POST /api/ext/extension/token       (issue/refresh extension-scoped token)
```

### 6.4 Job application tracking (full context)  *(extends `JobApplication`)*

**FR-APP-1 — Lifecycle.** Track an application through stages to a final result, with history.
*(Existing `ApplicationStatus` + `ApplicationHistory`.)* Suggested stages:
`SAVED → APPLIED → SCREENING → INTERVIEWING → OFFER → ACCEPTED/REJECTED/WITHDRAWN`.
- AC: every status change appends to `ApplicationHistory` with actor + timestamp.

**FR-APP-2 — One place for everything.** An application detail view shows: resume used (link
+ version), JD, source/URL, all interview rounds & feedback, the communication log, and any
offer.
- AC: all related records resolve from the application ID in one response/screen.

**FR-APP-3 — Communication log.** Log emails/messages/calls/notes against an application.
- AC: entries are timestamped, typed, and ordered; optional email ingestion later.

**FR-APP-4 — Offers.** Capture offer details (comp, start date, decision).
- AC: an `OFFER` status requires an `Offer` record; accepting can trigger placement (Tier B).

**FR-APP-5 — Reminders.** Optional follow-up reminders → `Notification`.
- AC: due reminders create notifications.

**Proposed model**
```
entity ApplicationCommunication {
  applicationId Long required, type CommType, direction CommDirection,
  subject String, body TextBlob, contactName String, occurredAt Instant, createdBy String
}
enum CommType { EMAIL, CALL, MESSAGE, NOTE, EVENT }
enum CommDirection { INBOUND, OUTBOUND, INTERNAL }
entity Offer {
  applicationId Long required, salaryAmount BigDecimal, currency CurrencyCode,
  startDate LocalDate, status OfferStatus, details TextBlob
}
enum OfferStatus { EXTENDED, ACCEPTED, DECLINED, RESCINDED }
// JobApplication: add jdText TextBlob, capturedVia ApplicationSource, finalResult String
```
**API**
```
GET  /api/ext/applications/{id}/detail      → aggregate (resume, jd, interviews, comms, offer)
POST /api/application-communications         (CRUD)
POST /api/offers                              (CRUD)
POST /api/ext/applications/{id}/status       { statusId }  (writes history)
```

---

## 7. Functional requirements — Tiers B & C

### 7.1 Employer: manage & market employee resumes (Tier B)

**FR-EMP-1 — Roster of public resumes.** An enterprise sees its employees' `EMPLOYER_ONLY`/
`PUBLIC` resumes and can curate which are marketable.
- AC: recruiter role can list/filter employee resumes by skill, availability, visibility.

**FR-EMP-2 — Market a resume / bench listing.** Publish a marketable profile (anonymized
optional) to a marketplace; track views/leads.
- AC: a `MarketedResume` is discoverable by clients per entitlement; PII can be masked.

**FR-EMP-3 — Track to placement.** Follow applications/submissions of marketed candidates
until placed. *(links to placement, §7.2.)*

**Proposed model**
```
entity MarketedResume {
  enterpriseId Long, employeeUserId String, resumeId Long, headline String,
  skills String, availability String, rate BigDecimal, anonymized Boolean,
  status MarketingStatus, views Integer
}
enum MarketingStatus { DRAFT, LISTED, PAUSED, PLACED, WITHDRAWN }
```
**API** `GET/POST/PUT /api/marketed-resumes` (+ `?skills.contains=`, `?status=`), `GET /api/ext/marketplace/resumes`.

### 7.2 Vendor ↔ client placement lifecycle (Tier B)

**FR-PLC-1 — Placement record.** Model a consultant placed by a vendor at a client, with
role, rate, dates, and status. *(Builds on `VendorContact`, `ClientContact`,
`VendorJobApplication`, `ServiceEnterpriseRelation`.)*
- AC: a placement links vendor + client + employee + (optional) originating application.

**FR-PLC-2 — Status flow.** `PROPOSED → INTERVIEWING → SELECTED → ONBOARDED → ACTIVE →
COMPLETED/TERMINATED`.
- AC: transitions are audited; an `ACTIVE` placement enables timesheets (§7.3).

**Proposed model**
```
entity Placement {
  vendorId Long, clientId Long, employeeUserId String, applicationId Long,
  role String, billRate BigDecimal, payRate BigDecimal, currency CurrencyCode,
  startDate LocalDate, endDate LocalDate, status PlacementStatus
}
enum PlacementStatus { PROPOSED, INTERVIEWING, SELECTED, ONBOARDED, ACTIVE, COMPLETED, TERMINATED }
```
**API** `GET/POST/PUT /api/placements`, `POST /api/ext/placements/{id}/status`.

### 7.3 Timesheets (Tier B)

**FR-TS-1 — Submit timesheets.** An employee/consultant submits hours per period against a
placement (daily/weekly entries, project/task optional).
- AC: a timesheet has a period, line entries (date, hours, notes), and a total.

**FR-TS-2 — Approval workflow.** Client (and/or vendor/employer) approves or rejects.
- AC: status `DRAFT → SUBMITTED → APPROVED/REJECTED`; rejection requires a reason; all
  parties (vendor, client, employer, employee) can view per their role.

**FR-TS-3 — Shared visibility.** Vendor, client, employer, and employee each see the
timesheets relevant to them, fail-closed by role/entitlement.
- AC: role-scoped queries; no cross-tenant leakage.

**FR-TS-4 — Feeds billing.** Approved timesheets generate work invoices (§7.4).

**Proposed model**
```
entity Timesheet {
  placementId Long required, employeeUserId String, periodStart LocalDate, periodEnd LocalDate,
  totalHours BigDecimal, status TimesheetStatus, submittedAt Instant, approvedBy String, approvedAt Instant
}
entity TimesheetEntry { timesheetId Long required, workDate LocalDate, hours BigDecimal, project String, task String, notes String }
enum TimesheetStatus { DRAFT, SUBMITTED, APPROVED, REJECTED }
```
**API**
```
GET/POST/PUT /api/timesheets        (?placementId=&status=&periodStart=)
POST /api/timesheets/{id}/submit
POST /api/timesheets/{id}/approve | /reject   { reason? }
GET  /api/ext/timesheets/mine                 (role-scoped view for each party)
```

### 7.4 Work billing — invoices & payments (Tier B)

> Distinct from existing **SaaS** subscription billing (`SubscriptionInvoice/Payment`).
> This is **work/timesheet** billing between vendor↔client (and employer payouts).

**FR-BILL-1 — Generate invoice from approved timesheets.**
- AC: selecting approved timesheets for a placement/period produces a `WorkInvoice` with line
  items (hours × bill rate); status `DRAFT → ISSUED → PAID/OVERDUE/VOID`.

**FR-BILL-2 — Record payments.** Track payments against invoices; partial payments allowed.
- AC: invoice balance updates; fully-paid → `PAID`.

**FR-BILL-3 — Shared visibility.** Vendor, client, employer, employee see invoices/payments
per role.

**Proposed model**
```
entity WorkInvoice {
  vendorId Long, clientId Long, placementId Long, number String, periodStart LocalDate, periodEnd LocalDate,
  subtotal BigDecimal, tax BigDecimal, total BigDecimal, currency CurrencyCode, status WorkInvoiceStatus, dueDate LocalDate
}
entity WorkInvoiceLine { invoiceId Long required, description String, hours BigDecimal, rate BigDecimal, amount BigDecimal, timesheetId Long }
entity WorkPayment { invoiceId Long required, amount BigDecimal, paidAt Instant, method String, reference String, status PaymentStatus }
enum WorkInvoiceStatus { DRAFT, ISSUED, PARTIALLY_PAID, PAID, OVERDUE, VOID }
```
**API** `GET/POST /api/work-invoices`, `POST /api/work-invoices/{id}/issue`, `POST /api/work-payments`, `GET /api/ext/billing/mine`.

### 7.5 Job Central — aggregated listings (Tier C)

**FR-JC-1 — Multi-source ingestion.** Ingest openings from multiple sources (manual,
partner feeds/APIs, scraped, `CollegeJobs`) into a unified `JobPosting`.
- AC: each posting records its `source` and external id; de-duplication by (company, title,
  url/hash).

**FR-JC-2 — Search & filter.** Full-text + faceted search (title, company, location, remote,
skills, posted date).
- AC: paginated, filterable; relevance ranking.

**FR-JC-3 — Apply / track from Job Central.** Apply creates a `JobApplication` (source
`JOB_CENTRAL`).

**Proposed model**
```
entity JobPosting {
  title String required, company String, location String, remoteType String, employmentType String,
  description TextBlob, skills String, salaryMin BigDecimal, salaryMax BigDecimal, currency CurrencyCode,
  applyUrl String, source String, externalId String, postedDate Instant, status String, dedupeHash String
}
entity JobSource { name String required, type JobSourceType, config TextBlob, lastSyncedAt Instant, enabled Boolean }
enum JobSourceType { MANUAL, FEED, API, SCRAPER, CAMPUS }
```
**API** `GET /api/ext/job-central/search?q=&location=&remote=&skills=&page=`, `POST /api/ext/job-central/{id}/apply`, admin `GET/POST /api/job-sources`, `POST /api/job-sources/{id}/sync`.

### 7.6 Course Central, skill-gap & career pathways (Tier C)

**FR-CC-1 — Course search.** Search the existing rich `CourseInfo` catalog by subject,
provider, mode, level, rating, cost.
- AC: faceted search over existing fields; results link to `courseLink`.

**FR-CC-2 — Skill-gap suggestions.** Given the user's resume/target role, recommend skills
to learn and matching courses.
- AC: returns ranked missing skills + recommended `CourseInfo` items; explainable.

**FR-CC-3 — Career pathways.** Model role-to-role pathways with required skills per step;
show "what to learn to get there".
- AC: selecting a target role renders a pathway (current → target) with skills + courses per
  step and an estimated effort.

**Proposed model**
```
entity Skill { name String required, category String, aliases String }
entity Role  { title String required, family String, seniority String }
entity RoleSkill { roleId Long, skillId Long, importance Integer }
entity CareerPath { fromRoleId Long, toRoleId Long, steps TextBlob, estDuration String }
entity UserSkill { userId String, skillId Long, level Integer, source String }   // source: resume/assessment
```
**API**
```
GET  /api/ext/courses/search?subject=&provider=&level=&minRating=
POST /api/ext/skills/gap            { resumeId | targetRoleId } → { missingSkills[], recommendedCourses[] }
GET  /api/ext/career-paths?targetRoleId=   → pathway with steps, skills, courses
```

### 7.7 Job-market analytics (Tier C)

**FR-STAT-1 — Trends & hot jobs.** Dashboards: trending roles/skills, demand by location,
salary ranges, "what's hot", derived from `JobPosting` ingestion + curated data.
- AC: time-series + top-N widgets; filter by industry/location; refreshes on a schedule.

**Proposed model**
```
entity JobMarketStat { metric String, dimension String, dimensionValue String, period LocalDate, value BigDecimal, source String }
```
**API** `GET /api/ext/market/trends?metric=&dimension=&from=&to=`, `GET /api/ext/market/hot-jobs?location=`.

---

## 8. WOW / differentiator features (Tier D)

These are the features intended to make WorkIfence unique. Each is entitlement-gated.

1. **One-candidate, all-parties timeline.** A single chronological record per candidate that
   *every* permitted party (jobseeker, employer, vendor, client) sees their slice of — from
   resume → application → interview → offer → placement → timesheet → payment. No competitor
   stitches the *whole* lifecycle across *all* parties. *(Aggregates §6.4, §7.2–7.4.)*
2. **JD-diff resume tailoring with live match score.** Paste a JD and watch the resume's
   match score update as AI suggests edits; one-click "apply suggestion". *(Extends FR-AI-3.)*
3. **Apply-anywhere browser extension that auto-builds the tracker.** Applying on any site
   silently creates the fully-contextual application record (resume used, JD, source).
   *(FR-EXT-1.)*
4. **AI career copilot.** Conversational agent that knows the user's resume, applications,
   skills, and target role; answers "what should I learn / apply to next?" and drafts
   outreach. *(Builds on §6.2, §7.6.)*
5. **Skill-gap → course → progress loop.** Detected gaps generate a learning plan from Course
   Central with progress tracking that updates `UserSkill` and re-scores job matches.
6. **Bench-to-placement marketplace.** Vendors/employers market bench consultants; clients
   search and request; the system tracks all the way to placement, timesheets, and invoices —
   a closed loop. *(§7.1–7.4.)*
7. **Campus drive command center** *(see §9)* — run on-campus events end to end with
   real-time pipelines and post-event analytics.
8. **Transparent shared billing.** Vendor, client, employer, and employee see the same
   timesheet→invoice→payment truth, reducing disputes. *(§7.3–7.4.)*
9. **Application intelligence.** Benchmarks ("your response rate vs. similar applicants"),
   best-time-to-follow-up nudges, and stale-application alerts. *(Analytics over §6.4.)*
10. **Verified public resume profiles** with employer-attested experience and shareable,
    revocable links. *(Extends FR-RES-2/3 + employer attestation.)*

---

## 9. Campus recruitment events (Tier D)

**FR-CMP-1 — Create & schedule events.** A college/campus coordinator creates a recruitment
event (date, venue/virtual, participating employers, eligible students).
- AC: event has schedule, participating enterprises, and eligibility rules.

**FR-CMP-2 — Registration.** Students register; employers shortlist.
- AC: registrations tracked; capacity & eligibility enforced.

**FR-CMP-3 — Run interviews on the day.** Manage interview slots, panels, and live status per
candidate (reuses `JobInterviewRound`, `JobInterviewFeedback`, `InterviewQuestion`).
- AC: real-time pipeline board; feedback captured per round.

**FR-CMP-4 — Track outcomes.** From event → application → offer → placement, with post-event
analytics (offers made, acceptance rate).
- AC: each event rolls up outcome metrics.

**Proposed model**
```
entity CampusEvent {
  collegeName String required, title String, eventDate LocalDate, mode String, venue String,
  status CampusEventStatus, eligibility TextBlob, createdBy String
}
entity CampusEventEmployer { eventId Long, enterpriseId Long, openings Integer }
entity CampusRegistration  { eventId Long, studentUserId String, resumeId Long, status RegistrationStatus }
entity CampusInterviewSlot { eventId Long, studentUserId String, employerId Long, roundId Long, scheduledAt Instant, status String }
enum CampusEventStatus { PLANNED, OPEN, IN_PROGRESS, COMPLETED, CANCELLED }
enum RegistrationStatus { REGISTERED, SHORTLISTED, INTERVIEWING, OFFERED, REJECTED, WITHDRAWN }
```
**API**
```
GET/POST/PUT /api/campus-events            (?status=&collegeName.contains=)
POST /api/campus-events/{id}/register      { studentUserId, resumeId }
POST /api/campus-events/{id}/shortlist     { studentUserId, employerId }
GET  /api/ext/campus-events/{id}/board     (live pipeline)
GET  /api/ext/campus-events/{id}/analytics
```

---

## 10. Non-functional requirements

| Category | Requirement |
| -------- | ----------- |
| **Security** | JWT + role + entitlement; fail-closed gating; resume visibility enforced server-side; share tokens revocable; extension tokens scoped & revocable; PII masking for anonymized marketing. |
| **Privacy** | Resume visibility and public profiles must respect owner consent; GDPR-style export/delete of a user's data. |
| **AI governance** | AI calls run server-side (key safety); store model used + prompt/version; user reviews before save; no autodecisions on hiring without human review. |
| **Performance** | Paginated/faceted search (Job Central, Course Central, marketplace); async AI jobs (`AiResumeJob`) with polling; consider search indexing (e.g. for `JobPosting`). |
| **Scalability** | Stateless JWT backend scales horizontally; ingestion runs on schedules; heavy AI/parse work is async. |
| **Reliability** | Liquibase migrations gate releases; idempotent ingestion + de-dup; timesheet/invoice writes are transactional. |
| **Auditability** | Status changes (applications, placements, timesheets, invoices, campus) are append-only history; reuse the `MenuAuditLog` pattern. |
| **Multi-tenancy** | All employer/vendor/client/campus data is tenant-scoped; no cross-tenant leakage. |
| **Observability** | Actuator + Prometheus/Grafana; metrics on ingestion, AI jobs, billing. |
| **Compatibility** | Stay on pinned toolchain: JHipster 8.1.0, Node 18.19.1, Java 17/21, Angular 21, MySQL 8. |
| **Entitlements** | Every new feature maps to a `FeatureType`/`PlanEntitlement` and is gated per plan/scope (INDIVIDUAL vs ENTERPRISE). |

---

## 11. Build sequencing (recommended)

1. **Tier A**: resume visibility enum + share links → AI resume flows → browser extension →
   application comms/offers + detail aggregate. *(Delivers the core jobseeker WOW.)*
2. **Tier B**: placement lifecycle → timesheets → work billing → employer resume marketing.
3. **Tier C**: Job Central ingestion + search → Course Central search + skill-gap → career
   pathways → market analytics.
4. **Tier D**: campus events + the cross-cutting WOW features (career copilot, all-parties
   timeline, application intelligence).

Each step: add JDL → import with local JHipster 8.1.0 → new `addColumn`/`createTable`
Liquibase changeset → implement `ext/` services & resources → gate via entitlements → add
nav+route gating (fail-closed) → tests (`./mvnw verify`, `npm test`, `npm run audit:nav:ci`).

---

## 12. Open questions / decisions to confirm

- **AI provider**: confirm Google Generative AI (Gemini) server-side vs. another provider;
  data-retention terms for resumes/JDs sent to the model.
- **Job Central sources**: which partner feeds/APIs are licensed for ingestion (legal/ToS).
- **Work billing**: tax/multi-currency rules, and whether a payment gateway is in scope or
  payments are recorded only.
- **Browser extension**: target browsers (Chrome/Edge/Firefox) and store-distribution plan.
- **Campus**: data ownership between college and employers; student consent.
- **Resume parsing**: build vs. third-party parser for FR-AI-2.

> This PRD is the target specification. As features land, reconcile them into the as-built
> `REQUIREMENTS.md` and keep `docs/rest-endpoint-inventory.md` current.


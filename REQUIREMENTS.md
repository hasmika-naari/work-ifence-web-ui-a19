# WorkIfence — Requirements

> Requirements reconstructed from the implemented data model, REST resources, and feature
> code across `work-ifence-web-ws` (backend) and `work-ifence-web-ui` (frontend). An
> identical copy lives at the root of both repos. This describes the system **as built**,
> with gaps flagged as future work where relevant.

## 1. Actors & roles

| Actor | Description |
| ----- | ----------- |
| **Individual user** | Personal member: builds a profile/resume, applies to jobs, tracks interviews, takes courses. |
| **Enterprise Admin** | Manages an enterprise tenant, its members, and subscription. |
| **Enterprise HR / Recruiter / Marketing / Employee** | Scoped enterprise roles (`EnterpriseRole`) with role-specific access. |
| **App Admin** | Anthropic-of-the-platform: approves enterprise onboarding, manages enterprise lifecycle, configures menus/entitlements, oversees subscriptions. |

Member types: `PERSONAL`, `ENTERPRISE_EMPLOYEE`, `ENTERPRISE_ADMIN`, `ADMIN`.

## 2. Functional requirements

### 2.1 Authentication & account

- FR-1 Users authenticate via JWT (`POST /api/authenticate`); tokens authorize all `/api` calls.
- FR-2 The system exposes the authenticated user's identity, authorities, and entitlements
  (`GET /api/access/me`) for the client to render and gate against.
- FR-3 Account management: registration/activation (`LoginProfile` with `activationCode`,
  `status`), password handling, and profile linkage (`AccountResource`).

### 2.2 Profiles & resumes

- FR-4 Users maintain a biographical profile (`BioProfile`: name, dob, gender, title,
  summary, image), academic history (`AcademicProfile`), work history (`JobProfile`),
  social links (`SocialLinks`), and addresses (`Address`).
- FR-5 Users create and store resumes (`JobResume`) linked to users
  (`JobResumeUserRelation`) and choose from resume templates (`ResumeTemplate`).
- FR-6 The system renders a resume to **PDF** server-side from a selected template
  (`export/template1`, `export/template2`).
- FR-7 File uploads (e.g. resume assets, profile images) are stored via **AWS S3**
  (`FileUploadResource`, `AWSS3Resource`).

### 2.3 Jobs, applications & interviews

- FR-8 The system manages job postings/listings (`CollegeJobs`, `GetJobsResource`) and
  categories (`Category`).
- FR-9 Users apply to jobs (`JobApplication`); vendor-sourced applications are supported
  (`VendorJobApplication`).
- FR-10 Application state is tracked over time via `ApplicationStatus` and an audit trail
  `ApplicationHistory`; applications can be imported in bulk
  (`JobApplicationImportResource`).
- FR-11 Interview workflow: rounds (`JobInterviewRound`/`JobInterviewRounds`), structured
  feedback (`JobInterviewFeedback`), and a reusable interview question bank
  (`InterviewQuestion`).

### 2.4 Courses & learning

- FR-12 The system catalogs courses (`CourseInfo`), subjects (`CourseSubject`), and
  providers (`CourseProvider`), with an extended course API (`CourseInfoExtResource`).

### 2.5 Enterprise / multi-tenant

- FR-13 Organizations onboard via `EnterpriseOnboardingRequest`, moving through
  `OnboardingStatus` (SUBMITTED → UNDER_REVIEW → NEED_MORE_INFO → APPROVED/REJECTED).
- FR-14 App Admin manages enterprise lifecycle: read APIs `GET /api/enterprises` (paged;
  filters `status`, `name.contains`, `createdDateFrom/To`) and `GET /api/enterprises/{id}`;
  actions `POST /api/app-admin/enterprises/{id}/activate|suspend|archive` driving
  `EnterpriseSetupStatus` (NOT_STARTED → IN_PROGRESS → ACTIVE → SUSPENDED → ARCHIVED).
- FR-15 Enterprises model members and relationships (`EnterpriseProfile`,
  `EnterpriseProfileRelation`), services (`WifenceService`, `ServiceEnterpriseRelation`),
  and contacts (`WifenceContact`, `ClientContact`, `VendorContact`, `ContactRelation`).
- FR-16 Enterprise members have scoped roles (`EnterpriseRole`) and membership states
  (`MembershipStatus`: ACTIVE / INVITED / SUSPENDED).

### 2.6 Subscriptions, billing & entitlements

- FR-17 The system defines subscription plans (`SubscriptionPlan`) with a billing interval
  (`BillingInterval`), currency (`CurrencyCode`), and scope (`SubscriptionScope`:
  INDIVIDUAL / ENTERPRISE).
- FR-18 Plans map to features through `PlanEntitlement` → `EntitlementCatalog` /
  `FeatureType`, defining what each plan unlocks.
- FR-19 Active subscriptions (`WifenceSubscription`) carry a `SubscriptionStatus`
  (TRIALING → ACTIVE → PAST_DUE → CANCELED/EXPIRED/SUSPENDED); add-ons supported via
  `SubscriptionAddon`.
- FR-20 Billing: invoices (`SubscriptionInvoice`, `InvoiceStatus`) and payments
  (`SubscriptionPayment`, `PaymentStatus`, `PaymentProvider`).
- FR-21 Plan changes are requested and tracked via `SubscriptionUpgradeRequest`
  (`SubscriptionUpgradeRequestType` / `...Status`).
- FR-22 Entitlements computed from the active subscription are the **authoritative** input
  to access control (see §3).

### 2.7 Navigation & menu management

- FR-23 Navigation is data-driven: `NavMenuSection` and `NavMenuItem` define menus; admins
  manage them (`AdminNavMenuResource`, `NavMenuItemResource`, `NavMenuSectionResource`).
- FR-24 Menus can be configured per tenant (`TenantMenuConfig`) and per user
  (`UserMenuPref`); the user's effective navbar is served (`AccountNavbarResource`).
- FR-25 Menu/config changes are audited (`MenuAuditLog`, `MenuAuditAction`, `MenuAuditScope`).

### 2.8 Engagement & dashboards

- FR-26 Users receive notifications (`Notification`, `NotificationType`: NEW_JOB_POSTED,
  INTERVIEW_SCHEDULE, WIF_NEWS) and view a news feed (`NewsFeed`).
- FR-27 Role-specific dashboards: user (`MyDashboardResource`) and app admin
  (`AppAdminDashboardResource`, `AppAdminUserResource`).

## 3. Access-control requirements (cross-cutting)

- AC-1 The **backend is the single source of truth** for access; all entitlement decisions
  are computed and enforced server-side.
- AC-2 The frontend enforces **defense-in-depth**: nav gating + route gating must match and
  must **fail closed in production** when flags/entitlements are missing or stale.
- AC-3 `entitlementRouteGuard` requires `data.entitlementKey`; a missing key denies access
  (dev and prod). `accessGuard` denies when its `data.requireFlag` flag is disabled.
- AC-4 Any new gated feature must define the backend entitlement, gate the nav item, gate
  the route identically, and pass the nav/route audit (`npm run audit:nav`).

## 4. Non-functional requirements

| Category | Requirement |
| -------- | ----------- |
| **Security** | JWT auth; role + entitlement authorization; fail-closed gating; secrets via env (`JHIPSTER_SECURITY_AUTHENTICATION_JWT_BASE64_SECRET`). |
| **Performance** | Paginated, filterable list endpoints (JHipster criteria). No cache layer today — DB is hit directly; introduce caching deliberately if load requires. |
| **Scalability** | Stateless JWT backend allows horizontal scaling behind a load balancer; MySQL is the shared state store. |
| **Reliability** | Schema evolution via Liquibase migrations; clean startup is a release gate. |
| **Maintainability** | Generated code isolated from custom code via `ext/` packages; entities driven by JDL; static analysis via Checkstyle + SonarQube. |
| **Observability** | Spring Boot Actuator (`/management/*`), Prometheus/Grafana, structured logging via AOP. |
| **Portability** | Dockerized (MySQL, app, monitoring); Jib image builds. |
| **Internationalization** | Translation enabled (`i18n/messages_*`), multi-locale UI. |
| **SEO / first paint** | Angular SSR for server-rendered initial responses. |
| **Testability** | Backend integration tests (`*IT`), frontend Karma/Jasmine unit tests, Playwright e2e, Cypress audits. |
| **Compatibility** | Pinned toolchain: JHipster 8.1.0, Node 18.19.1, Java 17/21, Angular 21, MySQL 8. |

## 5. External dependencies

- **MySQL 8** — primary datastore (`workIfenceWsV2`).
- **AWS S3** — file/object storage.
- **SMTP** — transactional mail (`support@workifence.com`, port 587).
- **Google Generative AI** — AI assistance in the frontend (`@google/generative-ai`).
- **Prometheus / Grafana / SonarQube** — ops & quality (compose-provided).

## 6. Open items / assumptions

- Some requirements are inferred from entity/endpoint presence; exact business rules per
  field should be confirmed with product owners.
- Payment provider integration (`PaymentProvider`) is modeled; the live gateway wiring
  should be confirmed before relying on FR-20 end to end.
- This document reflects the codebase as of the current checkout and should be revised
  alongside JDL/schema changes.

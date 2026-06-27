# WorkIfence — System Architecture

> Scope: the whole WorkIfence system, spanning the backend (`work-ifence-web-ws`) and the
> Angular frontend (`work-ifence-web-ui`). An identical copy of this document lives at the
> root of both repos.

## 1. Overview

WorkIfence is a career / jobs platform serving two audiences from a single backend:

- **Individuals** — build profiles and resumes, discover and apply to jobs, track
  applications and interviews, take courses.
- **Enterprises (tenants)** — onboard organizations, manage members and roles, post and
  recruit for jobs, and consume features according to a subscription plan.

The system is a classic two-tier web application: a **JHipster Spring Boot monolith**
exposing a JWT-secured REST API, and an **Angular single-page app** (with server-side
rendering) that consumes it. State lives in **MySQL**, with schema evolution managed by
**Liquibase**.

```
┌──────────────────────────┐        HTTPS / JSON          ┌──────────────────────────────┐
│  work-ifence-web-ui       │  ───────────────────────▶   │  work-ifence-web-ws           │
│  Angular 21 SPA + SSR     │   Authorization: Bearer JWT  │  Spring Boot 3.2 (Java 21)    │
│  (Express SSR :4000)      │  ◀───────────────────────   │  JHipster 8.1.0 monolith :8090│
└──────────────────────────┘                              └───────────────┬──────────────┘
                                                                           │ JPA / Liquibase
                                                                           ▼
                                                                  ┌────────────────┐
                                                                  │  MySQL 8        │
                                                                  │  workIfenceWsV2 │
                                                                  └────────────────┘
        External: SMTP (mail), AWS S3 (file storage), Google Generative AI (UI), PDF export
```

## 2. Technology stack

| Layer            | Technology |
| ---------------- | ---------- |
| Frontend         | Angular 21.1 (standalone), Angular Material, ng-bootstrap, PrimeNG, Bootstrap 5, FullCalendar, ApexCharts/Chart.js |
| SSR              | `@angular/ssr` + Express (`server.ts`, `server_http.ts`) |
| Frontend tests   | Karma + Jasmine (unit), Playwright (e2e), Cypress (fixtures/audits) |
| Backend          | Spring Boot 3.2.0, Java 21, JHipster 8.1.0 (Maven) |
| Security         | Spring Security, JWT (OAuth2 resource server), method + URL authorization |
| Persistence      | Spring Data JPA / Hibernate, MySQL 8, HikariCP, **Liquibase** migrations |
| API style        | REST under `/api`, JHipster criteria filtering + pagination |
| Caching          | None configured (`cacheProvider: no`, Hibernate 2nd-level cache off) |
| File storage     | AWS S3 (`AWSS3Resource`, `service/storage`) |
| Mail             | Spring Mail / SMTP (`support@workifence.com`) |
| Docs/observability| springdoc/OpenAPI, Actuator, Prometheus/Grafana compose, SonarQube |
| Build/CI         | Maven wrapper, npm scripts, Docker Compose, Jib image build |

## 3. Backend architecture (`work-ifence-web-ws`)

Standard layered JHipster architecture under `com.workifence.app`:

```
web/rest (*Resource)  →  service (+ service/impl, mappers, dto, criteria)  →  repository  →  domain (JPA)
        ▲                          ▲                                              │
        │                          │                                              ▼
   security (JWT, authorities)   ext/ packages (custom logic)                  MySQL (Liquibase)
```

- **`web/rest`** — REST controllers. ~64 `*Resource` classes: generated CRUD resources
  plus hand-written ones (`AppAdminDashboardResource`, `MyDashboardResource`,
  `AccountNavbarResource`, `AdminNavMenuResource`, `FileUploadResource`, etc.).
  Sub-packages: `rest/ext` (custom controllers), `rest/vm` (view models), `rest/dto`,
  `rest/errors`, `filter/`, `websocket/`.
- **`service`** — business logic, DTO mappers (MapStruct), `criteria` for filtered queries,
  `service/impl`, and `service/ext` for hand-written services.
- **`repository`** — Spring Data JPA repos (`JpaSpecificationExecutor` for criteria);
  `repository/ext` for custom queries.
- **`domain`** — JPA entities (generated from JDL), `enumeration` (status enums),
  `converter`, and `domain/ext`.
- **`security`** — JWT token provider, authorities, plus `security/ext` for app-specific
  authorization (entitlement enforcement).
- **`export`** — resume rendering to PDF (`template1`, `template2`).
- **`management`** — enterprise / tenant lifecycle logic.
- **`aop/logging`** — cross-cutting logging aspects.

**Generated vs. custom code:** entity scaffolding (domain, repos, base services/DTOs, base
resources, `create table` changelogs) is JDL-generated and should not be hand-edited.
Custom behavior lives in the `ext/` sub-packages. This is the most important structural
convention in the codebase.

### Profiles & configuration

`src/main/resources/config/application*.yml`: default + `dev` (MySQL on localhost, mail
on :587, S3 export) + `prod`. App port **8090**. JWT secret via
`JHIPSTER_SECURITY_AUTHENTICATION_JWT_BASE64_SECRET`. There is also an `e2e` profile for
CI integration tests.

## 4. Frontend architecture (`work-ifence-web-ui`)

Angular standalone app with SSR. Notable areas (`src/app`):

- **`auth` / `authentication`** — login, JWT storage, session lifecycle; an HTTP
  interceptor attaches the bearer token.
- **`guards`** — route protection. `entitlementRouteGuard` (requires `data.entitlementKey`)
  and `accessGuard` (reads `data.requireFlag`) implement fail-closed gating.
- **`entitlements` / `facades`** — client-side entitlement state, reflecting the backend
  payload; drives feature gating.
- **`nav` / `layout` / `routing`** — app shell, navbar, and route tables. Nav gating and
  route gating are kept in lockstep (audited by `tools/nav-route-audit.mjs`).
- **`services` / `api` / `models`** — typed HTTP clients and DTOs mirroring the backend.
- **Feature areas** — `dashboard`, `my-profile`, `resume-portal`, `settings`,
  plus reusable `components`, `widgets`, `forms`, `tables`, `ui-elements`.
- **SSR** — `main.server.ts`, `server.ts`/`server_http.ts`; browser-only APIs are guarded
  for server rendering.

## 5. Security & multi-tenancy model

- **Authentication:** JWT. `POST /api/authenticate` issues a token; clients send
  `Authorization: Bearer <token>`.
- **Authorization:** role/authority based at the backend (Spring Security), enforced on
  both URL and method level. Member types include personal users, enterprise roles
  (`ENTERPRISE_ADMIN`, `ENTERPRISE_HR`, `ENTERPRISE_MARKETING`, `ENTERPRISE_RECRUITER`,
  `ENTERPRISE_EMPLOYEE`), and app `ADMIN`.
- **Entitlements:** what a user can access is computed by the backend from the
  subscription plan → plan entitlements → entitlement catalog / feature types. The
  frontend mirrors this for UX but **the backend is authoritative** and gates fail closed.
- **Multi-tenancy:** enterprises are modeled as first-class entities
  (`EnterpriseProfile` + relations); navigation and feature availability can be tuned per
  tenant via `TenantMenuConfig` / `NavMenuSection` / `NavMenuItem`, with changes tracked in
  `MenuAuditLog`.

## 6. Data model

~50 JHipster entities managed via JDL and Liquibase. Functional clusters:

- **Identity & profile:** `LoginProfile`, `BioProfile`, `AcademicProfile`, `JobProfile`,
  `SocialLinks`, `Address`, `Category`.
- **Jobs & applications:** `JobApplication`, `ApplicationStatus`, `ApplicationHistory`,
  `CollegeJobs`, `VendorJobApplication`, `JobInterviewRound(s)`, `JobInterviewFeedback`,
  `InterviewQuestion`.
- **Resumes:** `JobResume`, `JobResumeUserRelation`, `ResumeTemplate` (+ PDF export engine).
- **Courses:** `CourseInfo`, `CourseSubject`, `CourseProvider`.
- **Enterprise / tenants:** `EnterpriseProfile`, `EnterpriseProfileRelation`,
  `EnterpriseOnboardingRequest`, `ServiceEnterpriseRelation`, `WifenceService`,
  `WifenceContact`, `ClientContact`, `VendorContact`, `ContactRelation`.
- **Subscriptions & billing:** `SubscriptionPlan`, `PlanEntitlement`, `EntitlementCatalog`,
  `FeatureType`, `WifenceSubscription`, `SubscriptionAddon`, `SubscriptionInvoice`,
  `SubscriptionPayment`, `SubscriptionUpgradeRequest`.
- **Navigation & menus:** `NavMenuSection`, `NavMenuItem`, `TenantMenuConfig`,
  `UserMenuPref`, `MenuAuditLog`.
- **Engagement:** `Notification`, `NewsFeed`.

Status lifecycles are enumerated in `domain/enumeration/`, e.g. `SubscriptionStatus`
(TRIALING → ACTIVE → PAST_DUE → CANCELED/EXPIRED/SUSPENDED), `OnboardingStatus`
(SUBMITTED → UNDER_REVIEW → NEED_MORE_INFO → APPROVED/REJECTED), `EnterpriseSetupStatus`
(NOT_STARTED → IN_PROGRESS → ACTIVE → SUSPENDED → ARCHIVED), `InvoiceStatus`, `PaymentStatus`.

## 7. Key request flows

**Login:** UI `POST /api/authenticate` → JWT → stored client-side → attached by interceptor.

**Access bootstrap:** UI calls `GET /api/access/me` to load the user's identity,
authorities, and entitlements; the nav and routes gate against this payload (fail closed).

**Enterprise onboarding (App-Admin Phase 1):** an `EnterpriseOnboardingRequest` is
submitted, reviewed, and approved; App-Admin lifecycle actions
(`POST /api/app-admin/enterprises/{id}/activate|suspend|archive`) move the enterprise
through `EnterpriseSetupStatus`. Read APIs: `GET /api/enterprises` (paged, filterable) and
`GET /api/enterprises/{id}`.

**Resume export:** a `JobResume` + `ResumeTemplate` is rendered server-side
(`export/template*`) to PDF and returned to the UI.

## 8. Deployment

- Backend packaged as a runnable jar (`./mvnw -Pprod clean verify`) or war; container image
  via Jib (`src/main/docker/jib`).
- Compose files in `src/main/docker/` for MySQL, the app, and monitoring
  (Prometheus/Grafana), plus SonarQube.
- Frontend built to static assets (`npm run build`) and/or served with SSR via the Express
  server (`npm run ssr:prod:https`, port 443 / 4000).
- Observability via Spring Boot Actuator (`/management/*`) and Prometheus scraping.

## 9. Known constraints & conventions

- Toolchain is pinned: **JHipster 8.1.0, Node 18.19.1, Java 17/21**. Regenerate only with
  these versions.
- No caching layer — reads hit the DB directly; add caching deliberately if needed.
- Schema changes are **JDL → new Liquibase `addColumn` changeset**, never direct table edits.
- The backend is the single source of truth for access; the frontend is defense-in-depth.

See `REQUIREMENTS.md` and `ROADMAP.md` for scope and forward plan.
